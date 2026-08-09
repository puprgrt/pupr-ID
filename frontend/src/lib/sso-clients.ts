import { SignJWT } from 'jose';

// Konfigurasi rahasia untuk menandatangani JWT (sebaiknya simpan di environment variable)
// Karena ini simulasi lokal, kita gunakan string statis atau fallback ke env
const SSO_JWT_SECRET = process.env.SSO_JWT_SECRET || 'super-secret-key-for-pupr-sso-jwt-signing-2026';
const secretKey = new TextEncoder().encode(SSO_JWT_SECRET);

// Whitelist client aplikasi yang diizinkan menggunakan SSO
export const SSO_CLIENTS = {
  'sipeka-garut': {
    name: 'SIPEKA - Sistem Informasi Penilaian Kerusakan Bangunan',
    allowedOrigins: [
      'http://localhost:3000',
      'https://sipeka.garutkab.go.id'
    ]
  },
  'simbg': {
    name: 'SIMBG - Sistem Informasi Manajemen Bangunan Gedung',
    allowedOrigins: [
      'https://simbg.pupr.go.id'
    ]
  },
  'sijenang': {
    name: 'SIJENANG',
    allowedOrigins: [
      'https://sijenang.garutkab.go.id'
    ]
  }
};

/**
 * Validasi apakah client_id terdaftar dan redirect_uri berasal dari origin yang diizinkan
 */
export function validateClientRedirect(clientId: string | null, redirectUri: string | null): boolean {
  if (!clientId || !redirectUri) return false;
  
  const client = SSO_CLIENTS[clientId as keyof typeof SSO_CLIENTS];
  if (!client) return false;

  try {
    const url = new URL(redirectUri);
    // Hapus trailing slash untuk komparasi origin
    const origin = url.origin; 
    return client.allowedOrigins.includes(origin);
  } catch (e) {
    return false;
  }
}

/**
 * Generate JWT khusus untuk SSO Client
 */
export async function generateSSOToken(userData: any): Promise<string> {
  const token = await new SignJWT({ 
      id: userData.id,
      nip: userData.nip,
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role,
      department: userData.department || 'Dinas PUPR Kabupaten Garut',
      position: userData.position || 'ASN',
      avatarUrl: userData.avatarUrl || null,
      authProvider: 'puprID'
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('urn:pupr:id:sso')
    .setAudience('urn:pupr:id:clients')
    .setExpirationTime('2h')
    .sign(secretKey);
    
  return token;
}
