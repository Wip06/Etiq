import * as WebBrowser from 'expo-web-browser';

import { colors } from '@/theme/colors';

// Ouvre un lien externe dans le navigateur intégré, sans quitter l'app.
export function openLink(url: string) {
  return WebBrowser.openBrowserAsync(url, {
    toolbarColor: colors.background,
    controlsColor: colors.accent,
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
  });
}
