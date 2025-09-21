function ArrowIcon() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="mt-16 mb-10">
      {/* <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300"> */}
      <ul className="font-sm mt-8 flex flex-row flex-wrap gap-x-6 gap-y-2 text-neutral-600">
      <li>
          <a
            // className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            className="flex items-center transition-all hover:text-neutral-600"
            rel="noopener noreferrer"
            target="_blank"
            href="https://twitter.com/davidgan__"
          >
            <p className="mr-1 h-4 relative top-[4px]">twitter</p>
            <ArrowIcon />
          </a>
        </li>
        <li>
          <a
            // className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            className="flex items-center transition-all hover:text-neutral-600"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/dgan11"
          >
            <p className="mr-1 h-4 relative top-[4px]">github</p>
            <ArrowIcon />
          </a>
        </li>
      </ul>
    </footer>
  )
}
