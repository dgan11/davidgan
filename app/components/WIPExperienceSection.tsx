import Image from 'next/image';
import MixedMediaSlider from './MixedMediaSlider';

interface ExperienceItem {
  company: string;
  period: string;
  description: string;
}

const experiences: ExperienceItem[] = [
  {
    company: 'Manifold.xyz',
    period: '2021 - now',
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
    src: 'https://utfs.io/f/0cab5656-dfa3-4f8e-a819-d0bda41be1b2-dsr4ul.gif',
    href: 'https://twitter.com/nftnow/status/1770647178454679602',
    type: 'image'
  },
  {
    src: 'https://utfs.io/f/2422b9df-aaad-45df-bd8f-2ab51333a11a-a18da0.png',
    href: 'https://www.niftygateway.com/collections/sam-spratt-the-monument-game/',
    type: 'image'
  },
  {
    src: 'https://utfs.io/f/29bab749-687a-478d-b95f-4d48ca2981e1-1fze5x.png',
    href: 'https://www.fewoworld.io/',
    type: 'image'
  },
];

export default function ExperienceSection() {
  return (
    <div className="flex flex-col gap-y-8">
      <h3 className="text-md font-semibold">Experience</h3>
      {experiences.map((exp, index) => (
        <div key={exp.company} className="flex flex-col w-full">
          <div className="flex flex-row gap-x-1 items-center">
            <h4 className="font-medium">{exp.company}</h4>
            <p className="opacity-50 ml-1">{exp.period}</p>
          </div>
          <p className="opacity-75">{exp.description}</p>
          {index === 1 && (
             <MixedMediaSlider />
          )}
          {index === 0 && (
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
                    <img
                      src={image.src}
                      alt=""
                      width={144}
                      height={144}
                      className="w-full h-full object-cover"
                    />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
