import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  redirect('/')
}
