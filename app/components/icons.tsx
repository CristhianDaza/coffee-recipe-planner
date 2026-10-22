import type { SVGProps } from "react";

type IconName = "cup" | "filter" | "chemex" | "press" | "aero" | "sun" | "moon" | "bookmark" | "check" | "arrow" | "play" | "reset" | "close";

const paths: Record<IconName, React.ReactNode> = {
  cup: <><path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8ZM17 9h2a3 3 0 1 1 0 6h-2M8 3v2m5-2v2" /></>,
  filter: <><path d="m3 5 9 11 9-11H3Zm4 14h10M12 16v3M7 5l5 11 5-11" /></>,
  chemex: <><path d="m6 3 4 8-5 9c-.3.5 0 1 1 1h12c1 0 1.3-.5 1-1l-5-9 4-8H6Zm3 9h6M8 17h8" /></>,
  press: <><path d="M5 7h12v14H5V7Zm12 2h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M4 7h14M11 3v12M8 3h6M7 15h8" /></>,
  aero: <><path d="M7 7h10v13H7V7ZM9 3h6v4M5 20h14M5 7h14M10 11h4m-4 4h4" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />,
  bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
  check: <path d="m5 12 4 4L19 6" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  play: <path d="m8 4 12 8-12 8V4Z" />,
  reset: <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /></>,
  close: <path d="m6 6 12 12M6 18 18 6" />,
};

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

export function MethodIcon({ id }: { id: string }) {
  return <Icon name={id === "v60" ? "filter" : id === "chemex" ? "chemex" : id === "french" ? "press" : id === "aero" ? "aero" : "cup"} />;
}
