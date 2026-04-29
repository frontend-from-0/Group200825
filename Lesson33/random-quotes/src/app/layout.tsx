import { Playfair_Display, Inter } from 'next/font/google';
import { QuotesContextProvider } from '@/app/QuotesContext';
import { TopNav } from '@/app/Navbar';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin'],
})


export const metadata = {
  title: 'Random Quotes Application',
  description: 'Random Quotes Application 130625',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className='min-h-full'>
        <QuotesContextProvider>
          <TopNav />
          {children}
        </QuotesContextProvider>
      </body>
    </html>
  );
}
