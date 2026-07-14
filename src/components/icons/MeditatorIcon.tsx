export function MeditatorIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="5" r="2" fill="currentColor" />
      <path
        d="M12 8c-2.5 0-4 2.2-4 5v1.5c0 .8.7 1.5 1.5 1.5h5c.8 0 1.5-.7 1.5-1.5V13c0-2.8-1.5-5-4-5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7 20c1.2-2.2 3.2-3.5 5-3.5s3.8 1.3 5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 14.5c-1.5 1-2.5 2.5-2.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 14.5c1.5 1 2.5 2.5 2.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
