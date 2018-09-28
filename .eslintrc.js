module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    node: true
  },
  rules: {
    camelcase: [0, {"properties": "never"}],
    semi: 0,
    quotes: 0,
    'no-unused-vars': 0,
    'no-undef': 0,
    'space-before-function-paren': 0,
    'no-sequences': 0,
    'comma-spacing': 0
  },
  globals: {}
}
