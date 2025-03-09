// import { BlogPosts } from 'app/components/posts'
import EnhancedSpotifyEmbed from './components/EnhancedSpotifyEmbed'
import ExperienceSection from './components/ExperienceSection'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold">
        David Gan
      </h1>
      <p className="mb-6">
        {`i'm a software engineer based in LA and originally from Texas`}
      </p>
      <p className="mb-6">
        {`currently working at coinbase (`}
        <a 
          href="https://base.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline text-blue-500 hover:text-blue-600"
        >
          {`base`}
        </a>
        {`) building on-chain wechat`}
      </p>
      <p className="mb-6">
        {`previously worked at `}
        <a 
          href="https://manifold.xyz/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline text-blue-500 hover:text-blue-600"
        >
          {`manifold`}
        </a>
        {` where i helped digital creators grow and monetize`}
      </p>
      <p className="mb-12">
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

      {/* Custom Spotify Embed */}
      <div className="flex justify-center items-center mb-12">
        <EnhancedSpotifyEmbed />
      </div>

      <ExperienceSection />
      {/* <div className="my-8">
        <BlogPosts />
      </div> */}
    </section>
  )
}
