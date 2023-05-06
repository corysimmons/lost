module.exports = {
  env: {
    es2017: true,
    node: true,
  },
  plugins: ['prettier'],
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'eol-last': 2,
    'no-multiple-empty-lines': [2, { max: 2, maxEOF: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    semi: ['error', 'always'],
    'prettier/prettier': 'error',
  },
};
