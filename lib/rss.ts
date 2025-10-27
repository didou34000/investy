/**
 * Helpers pour parser et nettoyer les flux RSS
 */

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

export function cleanUrl(url: string): string {
  try {
    const u = new URL(url);
    // Retirer les paramètres UTM
    const params = new URLSearchParams(u.search);
    for (const key of params.keys()) {
      if (key.toLowerCase().includes("utm")) {
        params.delete(key);
      }
    }
    u.search = params.toString();
    return u.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

export async function hash256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function parseRss(xmlText: string) {
  const items: Array<{
    title: string;
    link: string;
    pubDate: string;
    description: string;
    image?: string;
  }> = [];

  try {
    // Parser les <item> (RSS standard)
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    const itemsMatches = xmlText.match(itemRegex) || [];

    for (const itemMatch of itemsMatches) {
      const titleMatch = itemMatch.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>/i) ||
                       itemMatch.match(/<title[^>]*>(.*?)<\/title>/i);
      const linkMatch = itemMatch.match(/<link[^>]*>(.*?)<\/link>/i);
      const pubDateMatch = itemMatch.match(/<pubDate[^>]*>(.*?)<\/pubDate>/i);
      const descMatch = itemMatch.match(/<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>/i) ||
                     itemMatch.match(/<description[^>]*>(.*?)<\/description>/i);
      
      // Extraire les images
      let imageUrl: string | undefined;
      
      // Media RSS
      const mediaContent = itemMatch.match(/<media:content[^>]*url=["'](.*?)["']/i);
      if (mediaContent) {
        imageUrl = mediaContent[1].trim();
      }
      
      // Enclosure (audio/image/video)
      const enclosure = itemMatch.match(/<enclosure[^>]*url=["'](.*?)["']/i);
      if (enclosure) {
        imageUrl = enclosure[1].trim();
      }
      
      // Image dans description HTML
      if (!imageUrl) {
        const imgMatch = descMatch?.[1]?.match(/<img[^>]*src=["']([^"']*)["']/i);
        if (imgMatch) {
          imageUrl = imgMatch[1].trim();
        }
      }

      if (titleMatch && linkMatch) {
        items.push({
          title: titleMatch[1].trim(),
          link: linkMatch[1].trim(),
          pubDate: pubDateMatch?.[1]?.trim() || new Date().toISOString(),
          description: descMatch?.[1]?.trim() || "",
          image: imageUrl,
        });
      }
    }

    // Fallback pour Atom (compatibilité)
    if (items.length === 0) {
      const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/gi;
      const entries = xmlText.match(entryRegex) || [];

      for (const entry of entries) {
        const titleMatch = entry.match(/<title[^>]*>(.*?)<\/title>/i);
        const linkMatch = entry.match(/<link[^>]*href=["'](.*?)["']/i);
        const updatedMatch = entry.match(/<updated[^>]*>(.*?)<\/updated>/i);
        const summaryMatch = entry.match(/<summary[^>]*>(.*?)<\/summary>/i);

        if (titleMatch && linkMatch) {
          items.push({
            title: titleMatch[1].trim(),
            link: linkMatch[1].trim(),
            pubDate: updatedMatch?.[1]?.trim() || new Date().toISOString(),
            description: summaryMatch?.[1]?.trim() || "",
          });
        }
      }
    }
  } catch (error) {
    console.error("RSS parsing error:", error);
  }

  return items;
}

