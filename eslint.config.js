// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    // supabase/ contient des fonctions serveur Deno, hors de l'app.
    ignores: ["dist/*", "supabase/*"],
  }
]);
