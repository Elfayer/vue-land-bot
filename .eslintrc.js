module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: ['prettier', 'plugin:vue/essential', '@vue/prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'func-call-spacing': 'warn',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
