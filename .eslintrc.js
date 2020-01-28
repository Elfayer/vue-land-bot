module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'func-call-spacing': 'error',
    curly: 'error',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
