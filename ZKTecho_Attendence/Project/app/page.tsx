import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = cookies();
  const allCookies = await cookieStore;
  const token = allCookies.get ? allCookies.get('auth-token')?.value : undefined;
  let isAuthenticated = false;
  if (token) {
    try {
      isAuthenticated = !!verifyToken(token);
    } catch (e) {
      isAuthenticated = false;
    }
  }
  if (isAuthenticated) {
    redirect('/admin');
  } else {
    redirect('/login');
  }
}