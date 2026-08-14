type IconName =
  | "ruler"
  | "star"
  | "chat"
  | "bell"
  | "thread"
  | "lock"
  | "check"
  | "sparkle"
  | "search";

const PATHS: Record<IconName, React.ReactNode> = {
  ruler: (
    <>
      <path d="M3.6 14.5 14.5 3.6a1.5 1.5 0 0 1 2.1 0l3.8 3.8a1.5 1.5 0 0 1 0 2.1L9.5 20.4a1.5 1.5 0 0 1-2.1 0l-3.8-3.8a1.5 1.5 0 0 1 0-2.1Z" />
      <path d="m8 10 2 2M11 7l2 2M14.5 10.5l2 2M6.5 13l1.5 1.5" />
    </>
  ),
  star: <path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.6Z" />,
  chat: (
    <>
      <path d="M20.5 12c0 4-3.8 7.2-8.5 7.2-1 0-2-.15-2.9-.42L4 20.5l1.5-3.6C4.2 15.6 3.5 13.9 3.5 12c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2Z" />
      <path d="M9 12h.01M12 12h.01M15 12h.01" />
    </>
  ),
  bell: (
    <>
      <path d="M18 9a6 6 0 1 0-12 0c0 3.2-.9 5.1-2 6.2h16c-1.1-1.1-2-3-2-6.2Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  thread: (
    <>
      <path d="M12 3v10.5" />
      <path d="M12 3c-2 2-3 3.5-3 5.5M12 3c2 2 3 3.5 3 5.5" />
      <circle cx="12" cy="17.5" r="3" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="3" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  sparkle: (
    <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
};

interface Props {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}

export default function Icon({ name, className = "h-6 w-6", strokeWidth = 1.7 }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
