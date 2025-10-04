import type { SVGProps } from "react";

export function BlackHoleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M12 12c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5" />
      <path d="M12 12c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5" />
    </svg>
  );
}
