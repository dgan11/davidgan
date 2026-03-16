import ExperienceSection from '../ExperienceSection';
import { SerifExternalLink } from '../SerifExternalLink';
import { newsreaderSerif } from 'app/lib/newsreader';
import { Header } from './Header';
import { Spotify } from './Spotify';

export default function Homepage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCFBF9' }}>
      <article className={`${newsreaderSerif.className} mx-auto max-w-[52rem] pb-6 pt-16 md:pt-24`}>
        <Header />

        {/* Bio */}
        <div className="mb-14 text-[19px] leading-[1.6] text-[#555] space-y-3">
          <p>
            I build software in Los Angeles, and I&rsquo;m originally from Texas.
          </p>
          <p>
            Right now I&rsquo;m at{' '}
            <SerifExternalLink href="https://anysphere.inc/" className="text-[#555] hover:text-[#111]">
              Anysphere
            </SerifExternalLink>{' '}
            working on{' '}
            <SerifExternalLink href="https://www.cursor.com/" className="text-[#555] hover:text-[#111]">
              Cursor
            </SerifExternalLink>
            . Previously at{' '}
            <SerifExternalLink href="https://www.coinbase.com/" className="text-[#555] hover:text-[#111]">
              Coinbase
            </SerifExternalLink>{' '}
            and{' '}
            <SerifExternalLink href="https://manifold.xyz/" className="text-[#555] hover:text-[#111]">
              Manifold
            </SerifExternalLink>
            .
          </p>
        </div>

        {/* Listening */}
        <section className="mb-12">
          <Spotify />
        </section>
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
