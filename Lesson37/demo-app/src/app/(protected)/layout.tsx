import { Sidebar } from '@/components/sidebar';
import { auth0 } from '@/lib/auth0';
import { redirect } from "next/navigation";


export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="grid grid-cols-[250px_1fr]">
      <Sidebar />
      <main className='flex flex-1 w-full max-w-3xl flex-col items-center justify-between p-16 sm:items-start'>
      {children}
      </main>
    </div>
  );
}
