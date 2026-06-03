import Link from 'next/link';
import { auth0 } from '@/lib/auth0';

export async function Navbar() {
  const session = await auth0.getSession();

  return (
    <nav className='max-w-7xl w-full mx-auto flex justify-between p-8'>
      <Link href={'/'}>App Logo</Link>
      {session?.user ? <a href='/auth/logout'>Log out</a> : <a href='/auth/login'>Log in</a>}
    </nav>
  );
}
