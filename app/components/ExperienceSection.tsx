import Image from 'next/image';
import MixedMediaSlider from './MixedMediaSlider';

interface ExperienceItem {
  company: string;
  period: string;
  description: string;
}

const experiences: ExperienceItem[] = [
  {
    company: 'Anysphere',
    period: '2025 - now',
    description: 'building cursor',
  },
  {
    company: 'Coinbase',
    period: '2024-2025',
    description: 'built on-chain wechat',
  },
  {
    company: 'Manifold.xyz',
    period: '2021 - 2024',
    description: 'helped creators and brands use NFTs',
  },
  {
    company: 'Altan Insights',
    period: '2020 - 2021',
    description: "aggregated market data for assets like these and helped investors understand them better",
  },
];

// Interactive cards for Manifold projects
const manifoldProjectTiles = [
  {
    src: 'https://utfs.io/f/1ae0bb1d-9164-48d4-9ed2-6c8d59b0190d-b11qqo.com-crop-final.gif',
    href: 'https://kith.com/collections/kith-for-invisible-friends-collection?srsltid=AfmBOoqAWbeqMKeykky5HNG97UTXW_do8aVWRrtddQ7tHepUJwbQ8a6S',
    type: 'image'
  },
  {
    src: 'https://utfs.io/f/29bab749-687a-478d-b95f-4d48ca2981e1-1fze5x.png',
    href: 'https://www.fewoworld.io/',
    type: 'image'
  },
  {
    src: 'https://utfs.io/f/2422b9df-aaad-45df-bd8f-2ab51333a11a-a18da0.png',
    href: 'https://www.niftygateway.com/collections/sam-spratt-the-monument-game/',
    type: 'image'
  },
  {
    src: 'https://utfs.io/f/0cab5656-dfa3-4f8e-a819-d0bda41be1b2-dsr4ul.gif',
    href: 'https://twitter.com/nftnow/status/1770647178454679602',
    type: 'image'
  },
];

export default function ExperienceSection() {
  return (
    <div className="flex flex-col">
      <h3 className="text-md font-semibold mb-4">Experience</h3>
      <div className="flex flex-col gap-y-8">
        {experiences.map((exp, index) => (
          <div key={exp.company} className="flex flex-col w-full">
            <div className="flex flex-row gap-x-1 items-center">
              <h4 className="font-medium">{exp.company}</h4>
              <p className="opacity-50 ml-1">{exp.period}</p>
            </div>
          <p className="opacity-75">{exp.description}</p>
          {index === 0 && (
            <div className="">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-20"
              >
                <source src="https://pj55yltg5v.ufs.sh/f/GEQYflcXsdIYGCatiicXsdIYfbtW7MPAwgNvyn0ZRJ8jpcqo" type="video/mp4" />
              </video>
            </div>
          )}
          {index === 3 && (
             <MixedMediaSlider />
          )}
          {index === 2 && (
            <div className="flex flex-row -space-x-9 min-[430px]:-space-x-6 min-[500px]:-space-x-8 mt-4">
              {manifoldProjectTiles.map((image, i) => (
                <div
                  key={i}   
                  className={`w-32 h-32 min-[475px]:w-36 min-[475px]:h-36 min-[500px]:w-40 min-[500px]:h-40
                    bg-anthropic-secondary-bg/40 border-anthropic-secondary-bg/40 
                               border rounded-md overflow-hidden 
                              shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_6px_rgba(0,0,0,0.08)] 
                              hover:-translate-y-1 transition duration-200 ease-in-out 
                              ${i % 2 === 0 ? 'rotate-6' : '-rotate-6'}`}
                >
                  <a href={image.href} target="_blank" rel="noopener noreferrer" className="no-opacity-hover">
                    <Image
                      src={image.src}
                      alt={`Manifold project ${i + 1}`}
                      width={144}
                      height={144}
                      className="w-full h-full object-cover"
                      priority={i === 0}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      sizes="(max-width: 475px) 128px, (max-width: 500px) 144px, 160px"
                    />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
  );
}
