import type { ReactNode } from 'react';

import { newsreaderSerif } from 'app/lib/newsreader';

type SerifExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function SerifExternalLink({
  href,
  children,
  className = '',
}: SerifExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${newsreaderSerif.className} italic transition-colors duration-200 ${className}`.trim()}
    >
      {children}
    </a>
  );
}
