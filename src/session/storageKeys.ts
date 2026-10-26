// Clés AsyncStorage de chaque compte, réunies ici pour pouvoir tout effacer à la suppression du compte.
export const preferencesKey = (email: string) => `etiq.preferences.${email}`;
export const firstNameKey = (email: string) => `etiq.firstName.${email}`;
export const libraryKey = (email: string) => `etiq.library.${email}`;
