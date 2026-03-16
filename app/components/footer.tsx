import { SerifExternalLink } from './SerifExternalLink';

export default function Footer() {
  return (
    <footer className="mt-4 mb-10 flex gap-5 text-[16px]">
      <SerifExternalLink
        href="https://twitter.com/davidgan__"
        className="text-neutral-400 hover:text-neutral-700"
      >
        Twitter
      </SerifExternalLink>
      <span className="text-neutral-300">/</span>
      <SerifExternalLink
        href="https://github.com/dgan11"
        className="text-neutral-400 hover:text-neutral-700"
      >
        GitHub
      </SerifExternalLink>
    </footer>
  )
}
