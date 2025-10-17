export function isDebug(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("investy_debug") === "on";
}

export function toggleDebug(): void {
  if (typeof window === "undefined") return;
  const v = isDebug() ? "off" : "on";
  window.localStorage.setItem("investy_debug", v);
}


