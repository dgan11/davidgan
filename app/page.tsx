import { BlogPosts } from 'app/components/posts'
import CurrentlyPlaying from './components/CurrentlyPlaying'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold">
        David Gan
      </h1>
      <p className="mb-10">
        {`i'm a software engineer based in LA and originally from Texas`}
      </p>
      <p className="mb-10">
        {`currently working at `}
        <a 
          href="https://manifold.xyz/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline text-blue-500 hover:text-blue-600"
        >
          {`manifold`}
        </a>
        {` where i help digital creators grow and monetize`}
      </p>
      <p className="mb-10">
        {`before that i was a founding engineer at `}
        <a 
          href="https://altaninsights.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline text-blue-500 hover:text-blue-600"
        >
          {`altan insights`}
        </a>
        {` where I built a finance platform for alternative assets`}
      </p>

      {/* TODO fill in more experience about me */}

      {/* <div className="my-8">
        <BlogPosts />
      </div> */}
      <CurrentlyPlaying />
    </section>
  )
}
