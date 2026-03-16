interface ArticleEmbedProps {
  url: string;
  title: string;
  source: string;
  date?: string;
}

export function ArticleEmbed({ url, title, source, date }: ArticleEmbedProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 block w-full max-w-[400px] sm:max-w-[480px] group"
    >
      <div
        className="rounded-xl border border-[#e7e2da] bg-[#f3f0ea] p-4
          shadow-[0_1px_2px_rgba(0,0,0,0.04)]
          transition duration-200 ease-out
          group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] group-hover:-translate-y-0.5"
      >
        <p className="text-xs font-medium uppercase tracking-wider text-[#888]">
          {source}
          {date && <span className="ml-2">{date}</span>}
        </p>
        <p className="mt-1.5 text-[15px] font-medium leading-snug text-[#222] group-hover:text-[#111]">
          {title}
        </p>
        <p className="mt-2 text-xs text-[#666] group-hover:text-[#555]">
          Read article →
        </p>
      </div>
    </a>
  );
}
