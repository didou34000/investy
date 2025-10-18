export type FlagValue = string;

export function getFlag<T extends string = string>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  return (v as T) ?? fallback;
}

export function setFlag(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

export function getAllFlags(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = {};
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i)!;
    if (k && k.startsWith("ff_")) out[k] = window.localStorage.getItem(k) ?? "";
  }
  return out;
}


