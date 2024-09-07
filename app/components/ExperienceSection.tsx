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
    description: '',
  },
  {
    company: 'Altan Insights',
    period: '2020 - 2021',
    description: "",
  },
  {
    company: 'Oracle',
    period: '2019 - 2020',
    description: "",
  },
];

const graphiteImages = [
  {
    src: 'https://utfs.io/f/28635fd9-9b5b-4874-9f1c-606ef5bbe662-iwevjv.jpeg',
    href: 'https://example.com/image1'
  },
  {
    src: 'https://dilxwvfkfup17.cloudfront.net/eyJpdiI6Ik5FZzVWL1VpdFNIa2hFNFYzMzNtT3c9PSIsInZhbHVlIjoiNlMrb1NCM2taWnN3L1Bpc3lLTWI3bXlDNkRWcHFYNHBpczV5SmtWYmdXYUdnQnZTYzJxRHV0SmliZXVrZjhqSkoyN2hURTgyVUg3Y3g1Tzd6a1ZKNXc9PSIsIm1hYyI6IjEwOGNmZWM4MGJkYzBiNjNlMGIyMjZjYjM1MGMzNTZhNmNiMzViODRmMTA5NzUwZmUxYmZjN2NiODE5ZTMxNjEiLCJ0YWciOiIifQ==',
    href: 'https://example.com/image2'
  },
  {
    src: '/graphite/3.png',
    href: 'https://example.com/image3'
  },
  {
    src: '/graphite/4.png',
    href: 'https://example.com/image4'
  },
];

export default function ExperienceSection() {
  return (
    <div className="flex flex-col gap-y-6">
      <h3 className="text-md font-semibold">Experience</h3>
      {experiences.map((exp, index) => (
        <div key={exp.company} className="flex flex-col w-full">
          <div className="flex flex-row gap-x-1 items-center">
            <h4 className="font-medium">{exp.company}</h4>
            <p className="opacity-50 ml-1">{exp.period}</p>
          </div>
          <p className="opacity-75">{exp.description}</p>
          {index === 1 && (
            <div className="flex flex-row -space-x-9 min-[430px]:-space-x-6 min-[500px]:-space-x-8 mt-4">
              {graphiteImages.map((image, i) => (
                <div
                  key={i}
                  className={`w-28 h-28 min-[475px]:w-32 min-[475px]:h-32 min-[500px]:w-36 min-[500px]:h-36 
                              bg-[#F5F4F9] border border-[#E6E6E6] rounded-md overflow-hidden 
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
      <MixedMediaSlider />
    </div>
  );
}
