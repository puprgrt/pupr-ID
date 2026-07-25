'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { KeyRound } from 'lucide-react'

export default function KeycloakLoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleKeycloakLogin = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'keycloak',
      options: {
        // Otomatis mengarahkan kembali ke route callback kita setelah berhasil
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) {
      setIsLoading(false)
      console.error(error)
    }
  }

  return (
    <button 
      onClick={handleKeycloakLogin}
      disabled={isLoading}
      className="w-full mt-6 mb-4 flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-[#123B7A] to-[#071A3D] hover:from-[#1A4B9A] hover:to-[#123B7A] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group border border-[#1E5EFF]/30"
    >
      {isLoading ? (
        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <KeyRound className="w-5 h-5 text-[#FFDA00] group-hover:scale-110 transition-transform" />
      )}
      <span>{isLoading ? 'Mengalihkan...' : 'Lanjutkan dengan SSO PUPR (Keycloak)'}</span>
    </button>
  )
}
