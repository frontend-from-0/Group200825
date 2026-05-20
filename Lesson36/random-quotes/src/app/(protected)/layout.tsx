import { auth0 } from '@/lib/auth0';
import { redirect, RedirectType } from 'next/navigation';


export default async function ProtectedLayout({ children }) {
  const session = await auth0.getSession();
  if (!session) redirect('/auth/login', RedirectType.replace);

  const { user, error, loading } = await auth0.getSession();

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return (
      <p>
        An error occured, try to refesh the page and{' '}
        <a href='/auth/login'>log in</a> again.
      </p>
    );
  }

  return (!!user ?  <div>{children}</div> : <></>);
}
