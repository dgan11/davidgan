import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'

export function BlogPosts({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  let allBlogs = getBlogPosts()

  const isCompact = variant === 'compact'

  function formatShort(dateString: string) {
    const d = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`)
    return d.toLocaleString('en-us', { month: 'short', day: 'numeric' })
  }

  return (
    <div className={isCompact ? 'space-y-5' : 'space-y-8'}>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => {
          const summary = (post.metadata as any).summary || (post.metadata as any).description || ''
          return (
            <Link
              key={post.slug}
              className={
                isCompact
                  ? 'group grid grid-cols-[80px_1fr] items-baseline gap-x-3'
                  : 'group grid grid-cols-[100px_1fr] items-baseline gap-x-4'
              }
              href={`/blog/${post.slug}`}
            >
              <p className={isCompact ? 'text-neutral-600 tabular-nums text-xs' : 'text-neutral-600 tabular-nums'}>
                {isCompact ? formatShort(post.metadata.publishedAt) : formatDate(post.metadata.publishedAt, false)}
              </p>
              <div>
                <p
                  className={
                    isCompact
                      ? 'text-sm md:text-base tracking-tight font-medium font-sans underline-offset-[4px] decoration-neutral-300 group-hover:underline'
                      : 'text-2xl md:text-xl tracking-tight group-hover:underline'
                  }
                >
                  {post.metadata.title}
                </p>
                {isCompact && summary && (
                  <p className="mt-1.5 text-xs text-neutral-600">{summary}</p>
                )}
              </div>
            </Link>
          )
        })}
    </div>
  )
}
