import { Newsreader } from 'next/font/google';

export const newsreaderSerif = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
});
