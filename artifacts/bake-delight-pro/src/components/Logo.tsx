export function Logo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Marhaba Sweets Logo"
    >
      {/* Outer decorative dashed ring */}
      <circle
        cx="30"
        cy="30"
        r="28.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3.5 2.5"
        opacity="0.35"
      />

      {/* 8-pointed star background (Islamic geometric motif) */}
      <polygon
        points="30,6 33.5,18 44,10 39,21.5 52,24 39,27 44,39.5 33.5,34 30,46 26.5,34 16,39.5 21,27 8,24 21,21.5 16,10 26.5,18"
        fill="currentColor"
        opacity="0.12"
      />

      {/* Main circle */}
      <circle cx="30" cy="30" r="21" fill="currentColor" />

      {/* Inner decorative ring */}
      <circle cx="30" cy="30" r="18" stroke="white" strokeWidth="0.75" opacity="0.25" />

      {/* Crescent moon — top center */}
      <path
        d="M30 12 C25.5 12 22 15.5 22 20 C22 24.5 25.5 28 30 28 C27 28 24.5 24.5 24.5 20 C24.5 15.5 27 12 30 12Z"
        fill="white"
        opacity="0.9"
      />

      {/* Decorative dots at cardinal points */}
      <circle cx="30" cy="8" r="1.8" fill="currentColor" opacity="0.6" />
      <circle cx="52" cy="30" r="1.8" fill="currentColor" opacity="0.6" />
      <circle cx="8" cy="30" r="1.8" fill="currentColor" opacity="0.6" />
      <circle cx="30" cy="52" r="1.8" fill="currentColor" opacity="0.6" />

      {/* Stylized sweet bowl / mithai dish */}
      {/* Bowl rim */}
      <ellipse cx="30" cy="34" rx="9" ry="3.5" fill="white" opacity="0.95" />
      {/* Bowl body */}
      <path
        d="M21 34 Q21 42 30 42 Q39 42 39 34"
        fill="white"
        opacity="0.85"
      />
      {/* Decorative lines on the sweet */}
      <path d="M25 37 Q30 34.5 35 37" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M24 39.5 Q30 37 36 39.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />

      {/* Small star sparkles */}
      <circle cx="14" cy="18" r="1.2" fill="white" opacity="0.7" />
      <circle cx="46" cy="18" r="1.2" fill="white" opacity="0.7" />
      <circle cx="14" cy="42" r="1.2" fill="white" opacity="0.5" />
      <circle cx="46" cy="42" r="1.2" fill="white" opacity="0.5" />
    </svg>
  );
}
