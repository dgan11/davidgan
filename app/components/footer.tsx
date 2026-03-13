import { Newsreader } from 'next/font/google';

const serif = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
});

export default function Footer() {
  return (
    <footer className="mt-4 mb-10 flex gap-5 text-[16px]">
      <a
        href="https://twitter.com/davidgan__"
        target="_blank"
        rel="noopener noreferrer"
        className={`${serif.className} italic text-neutral-400 hover:text-neutral-700 transition-colors`}
      >
        Twitter
      </a>
      <span className="text-neutral-300">/</span>
      <a
        href="https://github.com/dgan11"
        target="_blank"
        rel="noopener noreferrer"
        className={`${serif.className} italic text-neutral-400 hover:text-neutral-700 transition-colors`}
      >
        GitHub
      </a>
    </footer>
  )
}
