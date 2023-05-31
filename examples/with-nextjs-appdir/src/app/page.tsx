import { Inter } from 'next/font/google';
import NextLink from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className={inter.className}>
      <h1>Examples</h1>
      <ul>
        <li>
          <NextLink href="/blog">blog</NextLink>
        </li>
      </ul>
    </main>
  );
}
