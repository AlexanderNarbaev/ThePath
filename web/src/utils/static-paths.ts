import { LOCALES } from '../constants';

export function getLangPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}
