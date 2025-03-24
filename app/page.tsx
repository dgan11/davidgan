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
        {`currently working at `}
        <a 
          href="https://anysphere.inc/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline text-blue-500 hover:text-blue-600"
        >
          {`anysphere`}
        </a>
        {` building `}
        <a 
          href="https://www.cursor.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline text-blue-500 hover:text-blue-600"
        >
          {`cursor AI`}
        </a>
      </p>
      <p className="mb-12">
        {`previously worked at coinbase (`}
        <a 
          href="https://base.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline text-blue-500 hover:text-blue-600"
        >
          {`base`}
        </a>
        {`) building on-chain wechat, `}
        <a 
          href="https://manifold.xyz/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline text-blue-500 hover:text-blue-600"
        >
          {`manifold`}
        </a>
        {` where i helped digital creators monetize, and `}
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
