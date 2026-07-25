import { redirect } from 'next/navigation';

export default function Home() {
  // Redireksi otomatis ke halaman login portal SSO
  redirect('/login');
}
