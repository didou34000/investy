import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc); dayjs.locale('fr');

export function canonicalUrl(raw: string): string {
  if (!raw) return '';
  try {
    const u = new URL(raw);
    // retire les UTM et autres query "tracking"
    const params = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm'];
    params.forEach(p => u.searchParams.delete(p));
    u.hash = '';
    // retire trailing slash inutile
    const clean = u.toString().replace(/\/$/,'');
    return clean;
  } catch { return raw; }
}

export function cleanText(htmlOrText: string, max = 1200): string {
  if (!htmlOrText) return '';
  const noHtml = htmlOrText.replace(/<[^>]+>/g, ' ');
  const singleSpaced = noHtml.replace(/\s+/g, ' ').trim();
  return singleSpaced.length > max ? singleSpaced.slice(0, max) + '…' : singleSpaced;
}

export function iso(dateLike?: any): string {
  const d = dateLike ? dayjs(dateLike) : dayjs();
  return (d.isValid() ? d : dayjs()).utc().toISOString();
}