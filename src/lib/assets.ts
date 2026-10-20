/**
 * Helper to resolve public assets correctly on GitHub Pages or custom subdomains.
 */
export function getAssetUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = import.meta.env.BASE_URL || './';
  const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${prefix}${cleanPath}`;
}

export const LOGO_ASSET_URL = getAssetUrl('assets/aistudio/IMG-20261020-WA0010_2d9a882a.jpg');
