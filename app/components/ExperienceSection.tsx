import Image from 'next/image';
import { AnysphereDescV2 } from './homepage/AnysphereDescV2';
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
    description: 'built the consumer base app',
  },
  {
    company: 'Manifold.xyz',
    period: '2021 - 2024',
    description: 'helped creators and brands use NFTs',
  },
  {
    company: 'Altan Insights',
    period: '2020 - 2021',
    description: 'helped investors understand alternative assets',
  },
];

const manifoldProjectImage = {
  src: 'https://utfs.io/f/1ae0bb1d-9164-48d4-9ed2-6c8d59b0190d-b11qqo.com-crop-final.gif',
  href: 'https://kith.com/collections/kith-for-invisible-friends-collection?srsltid=AfmBOoqAWbeqMKeykky5HNG97UTXW_do8aVWRrtddQ7tHepUJwbQ8a6S',
};

export default function ExperienceSection() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-y-8">
        {experiences.map((exp, index) => (
          <div key={exp.company} className="flex flex-col w-full">
            <div className="flex flex-row gap-x-1 items-center">
              <h4 className="font-medium">{exp.company}</h4>
              <p className="opacity-50 ml-1">{exp.period}</p>
            </div>
          {index === 0 ? (
            <AnysphereDescV2 />
          ) : (
            <p className={`opacity-75 ${index === 2 || index === 3 ? 'mb-0' : ''}`}>{exp.description}</p>
          )}
          {index === 3 && (
             <div className="mt-4 pl-16">
               <MixedMediaSlider />
             </div>
          )}
          {index === 2 && (
            <div className="mt-1 pl-16">
              <a
                href={manifoldProjectImage.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-32 h-32 min-[475px]:w-36 min-[475px]:h-36 min-[500px]:w-40 min-[500px]:h-40
                  bg-anthropic-secondary-bg/40 border border-anthropic-secondary-bg/40 
                  rounded-md overflow-hidden 
                  shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_6px_rgba(0,0,0,0.08)] 
                  hover:-translate-y-1 transition duration-200 ease-in-out"
              >
                <Image
                  src={manifoldProjectImage.src}
                  alt="Manifold project"
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                  priority
                  unoptimized
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  sizes="(max-width: 475px) 128px, (max-width: 500px) 144px, 160px"
                />
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
  );
}
