import * as WebBrowser from 'expo-web-browser';
import { Alert, Linking } from 'react-native';

import { colors } from '@/theme/colors';

// Ouvre un lien externe dans le navigateur intégré, sans quitter l'app.
export function openLink(url: string) {
  return WebBrowser.openBrowserAsync(url, {
    toolbarColor: colors.background,
    controlsColor: colors.accent,
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
  });
}

export const CONTACT_EMAIL = 'contact@etiq.com';

// Demande d'ajout d'une marque : ouvre la messagerie avec un e-mail déjà rédigé pour l'équipe.
export function requestBrandByEmail(brandName: string) {
  const name = brandName.trim();
  const subject = name ? `Demande d’ajout de marque : ${name}` : 'Demande d’ajout de marque';
  const body = `Bonjour,\n\nPourriez-vous ajouter la marque ${name || '…'} à Etiq ?\n\nPourquoi cette marque (facultatif) : \n`;
  const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return Linking.openURL(url).catch(() =>
    Alert.alert('Aucune application e-mail', `Écrivez-nous à ${CONTACT_EMAIL} avec le nom de la marque.`),
  );
}
