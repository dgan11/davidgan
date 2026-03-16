import { newsreaderSerif } from 'app/lib/newsreader';

export function Header() {
  return (
    <header className="mb-8">
      <h1
        className={`${newsreaderSerif.className} text-[2rem] md:text-[2.25rem] font-normal text-[#111] leading-tight tracking-tight`}
      >
        David Gan
      </h1>
    </header>
  );
}
