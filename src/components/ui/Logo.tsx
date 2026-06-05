interface LogoProps {
  className?: string;
}

export default function Logo({ className = 'w-10 h-10' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Abstract AP Shield Container */}
      <path
        d="M50 15 C65 25, 75 25, 80 30 C80 55, 70 75, 50 85 C30 75, 20 55, 20 30 C25 25, 35 25, 50 15 Z"
        fill="url(#logo-gradient)"
        stroke="#EAB308"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Stylized 'A' shape */}
      <path
        d="M38 65 L48 35 H52 L62 65 M43 55 H57"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Stylized 'P' curve overlap */}
      <path
        d="M48 35 C48 35, 62 38, 62 48 C62 55, 48 55, 48 55"
        stroke="#EAB308"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="logo-gradient" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0D9488" />
          <stop stopColor="#0F766E" />
        </linearGradient>
      </defs>
    </svg>
  );
}
