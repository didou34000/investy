export async function getUserIdDev(sessionUserId?: string | null){
  const env = process.env.NEXT_PUBLIC_ENV;
  if (env === "dev") return sessionUserId || "demo-user";
  return sessionUserId || null;
}


