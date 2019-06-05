// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
      project: './tsconfig.json',
    },
    env: {
      node: true
    },
    plugins: [
      '@typescript-eslint'
    ],
    extends: ['plugin:@typescript-eslint/recommended']
}