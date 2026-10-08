// Tema claro u oscuro. La preferencia guardada se aplica antes de pintar (script en el <head> de index.html).
import { writeText } from '../lib/storage.js';

export const THEME_KEY = 'eu27-theme';

export function toggleTheme(){
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  writeText(THEME_KEY, root.dataset.theme);
}
