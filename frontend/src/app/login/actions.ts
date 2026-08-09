'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Ambil input dari form
  const rawUsername = formData.get('username') as string
  const password = formData.get('password') as string
  const turnstileToken = formData.get('cf-turnstile-response') as string

  if (!rawUsername || !password) {
    return { error: 'Username dan Password wajib diisi' }
  }

  if (!turnstileToken) {
    return { error: 'Verifikasi keamanan diperlukan. Harap selesaikan captcha.' }
  }

  // Verifikasi token Turnstile ke Cloudflare
  const turnstileSecret = process.env.NODE_ENV === 'development' 
    ? '1x0000000000000000000000000000000AA' 
    : (process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA');
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(turnstileToken)}`,
    });
    const data = await res.json();
    if (!data.success) {
      return { error: 'Verifikasi keamanan gagal. Silakan coba lagi.' }
    }
  } catch (err) {
    return { error: 'Gagal menghubungi server keamanan.' }
  }

  // Jika input adalah NIP (hanya angka) atau username tanpa @, kita append @pupr.garut.id
  // Ini adalah trik agar Supabase Auth (yang butuh format email) bisa bekerja
  let email = rawUsername
  if (!email.includes('@')) {
    email = `${email}@pupr.garut.id`
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Kembalikan pesan error yang ramah
    if (error.message === 'Invalid login credentials') {
      return { error: 'Kredensial tidak valid. Silakan periksa kembali NIP dan Password Anda.' }
    }
    return { error: error.message }
  }

  // Handle SSO redirect flow if parameters are present
  const clientId = formData.get('client_id') as string
  const redirectUrl = formData.get('redirect_url') as string
  
  if (clientId && redirectUrl) {
    // Import dynamically to avoid circular dependencies or edge runtime issues
    const { validateClientRedirect, generateSSOToken } = await import('@/lib/sso-clients')
    
    if (validateClientRedirect(clientId, redirectUrl)) {
      // Data user dari session yang baru dibuat
      const user = data.user
      
      const userData = {
        id: user.id,
        nip: rawUsername, // NIP asli sebelum di-append domain
        fullName: user.user_metadata?.full_name || 'User PUPR',
        email: user.email,
        role: user.user_metadata?.role || 'User',
      }
      
      const ssoToken = await generateSSOToken(userData)
      
      // Construct redirect URL with token
      // Append rawUsername to token string so SIPEKA's fallback mock logic (tokenOrCode.includes(nip)) works
      const url = new URL(redirectUrl)
      url.searchParams.set('token', `${ssoToken}___${rawUsername}`)
      url.searchParams.set('user_nip', rawUsername)
      
      redirect(url.toString())
    }
  }

  // Revalidasi dan redirect ke dashboard jika sukses (non-SSO flow)
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
