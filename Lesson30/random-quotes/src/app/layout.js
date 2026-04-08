import { Geist, Geist_Mono } from 'next/font/google';
import { QuotesContextProvider } from '@/app/QuotesContext';
import Link from 'next/link'
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Random Quotes Application',
  description: 'Random Quotes Application 130625',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <nav>
        <ul>
          <li>
            <Link href='/'>Home</Link>
          </li>
          <li>
            <Link href='/user/quotes/liked'>Liked Quotes</Link>
          </li>
        </ul>
      </nav>
      <QuotesContextProvider>
        <body className='min-h-full'>{children}</body>
      </QuotesContextProvider>
    </html>
  );
}
