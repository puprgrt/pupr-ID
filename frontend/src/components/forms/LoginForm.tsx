'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { login } from '@/app/login/actions'
import { Turnstile } from '@marsidev/react-turnstile'

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    
    // Inject turnstile token manually into FormData if it's not present
    if (!formData.get('cf-turnstile-response') && turnstileToken) {
      formData.append('cf-turnstile-response', turnstileToken)
    }

    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300 ml-1">NIP / Username</label>
        <input 
          type="text" 
          name="username"
          required
          className="w-full px-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFDA00] focus:border-transparent transition-all backdrop-blur-sm shadow-inner"
          placeholder="Masukkan NIP Anda"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label className="text-sm font-medium text-slate-300">Password</label>
          <a href="#" className="text-xs text-[#FFDA00] hover:text-white transition-colors">Lupa Password?</a>
        </div>
        <input 
          type="password" 
          name="password"
          required
          className="w-full px-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFDA00] focus:border-transparent transition-all backdrop-blur-sm shadow-inner"
          placeholder="••••••••"
        />
      </div>

      <div className="flex items-center gap-2 pt-2 pb-4">
        <input type="checkbox" id="remember" className="rounded border-white/20 bg-black/20 text-[#FFDA00] focus:ring-[#FFDA00]/50 h-4 w-4" />
        <label htmlFor="remember" className="text-sm text-slate-300 cursor-pointer select-none">Ingat saya di peramban ini</label>
      </div>

      {/* Cloudflare Turnstile */}
      <div className="flex justify-center mt-2">
        <Turnstile 
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} 
          options={{ theme: 'dark' }}
          onSuccess={(token) => setTurnstileToken(token)}
        />
      </div>

      <button 
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1E5EFF] hover:bg-[#173D90] disabled:bg-[#173D90]/50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-[0_0_15px_rgba(30,94,255,0.4)] hover:shadow-[0_0_20px_rgba(30,94,255,0.6)] hover:-translate-y-0.5 transition-all duration-300 group"
      >
        {isPending ? 'Memproses...' : 'Login ke Portal'}
        {!isPending && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
      </button>
    </form>
  )
}
