import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['public/lib/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['public/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // Vendored libraries loaded with classic <script> tags before the modules.
        THREE: 'readonly',
        gsap: 'readonly',
        anime: 'readonly',
      },
    },
  },
  {
    files: ['public/sw.js'],
    languageOptions: { sourceType: 'script', globals: globals.serviceworker },
  },
  {
    files: ['scripts/**/*.mjs', 'tests/**/*.js', '*.config.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: globals.node },
  },
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
