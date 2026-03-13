import { Newsreader } from 'next/font/google';
import ExperienceSection from '../ExperienceSection';
import { BlogPosts } from '../posts';
import { Header } from './Header';
import { Spotify } from './Spotify';

const serif = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: false,
});

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${serif.className} italic text-[#555] hover:text-[#111] transition-colors duration-200`}
    >
      {children}
    </a>
  );
}

export default function Homepage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCFBF9' }}>
      <article className={`${serif.className} max-w-[52rem] mx-auto pt-16 md:pt-24 pb-6`}>
        <Header serif={serif.className} />

        {/* Bio */}
        <div className="mb-14 text-[19px] leading-[1.6] text-[#555] space-y-3">
          <p>
            I build software in Los Angeles, and I&rsquo;m originally from Texas.
          </p>
          <p>
            Right now I&rsquo;m at <Link href="https://anysphere.inc/">Anysphere</Link> working on{' '}
            <Link href="https://www.cursor.com/">Cursor</Link>. Previously at{' '}
            <Link href="https://www.coinbase.com/">Coinbase</Link> and{' '}
            <Link href="https://manifold.markets/">Manifold</Link>.
          </p>
        </div>

        {/* Listening */}
        <section className="mb-12">
          <Spotify />
        </section>

        {/* Writing — hidden for now */}
        {/* <section className="mb-12">
          <p className="text-[13px] uppercase tracking-[0.2em] text-[#666] mb-5">
            Writing
          </p>
          <div className="text-[19px] leading-[1.6] text-[#555] [&_a]:text-[#555] [&_a:hover]:text-[#111] [&_a]:italic">
            <BlogPosts variant="compact" />
          </div>
        </section> */}

        {/* Work */}
        <section className="mb-6">
          <p className="text-[13px] uppercase tracking-[0.2em] text-[#666] mb-5">
            Work
          </p>
          <div className="text-[19px] leading-[1.6] text-[#555] [&_h3]:text-[#111] [&_h4]:text-[#111] [&_.font-semibold]:text-[#111]">
            <ExperienceSection />
          </div>
        </section>

      </article>
    </div>
  );
}
