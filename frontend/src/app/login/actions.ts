'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Ambil input dari form
  const rawUsername = formData.get('username') as string
  const password = formData.get('password') as string

  if (!rawUsername || !password) {
    return { error: 'Username dan Password wajib diisi' }
  }

  // Jika input adalah NIP (hanya angka) atau username tanpa @, kita append @pupr.garut.id
  // Ini adalah trik agar Supabase Auth (yang butuh format email) bisa bekerja
  let email = rawUsername
  if (!email.includes('@')) {
    email = `${email}@pupr.garut.id`
  }

  const { error } = await supabase.auth.signInWithPassword({
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

  // Revalidasi dan redirect ke dashboard jika sukses
  revalidatePath('/dashboard')
  redirect('/dashboard')
}
