import { requireAdmin } from '@/lib/auth0';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ecommerce Admin",
  description: "Admin ecommerce platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  await requireAdmin();
  // TODO: make sure only admin user can access this page
  return (
    <div>{children}</div>
  );
}
