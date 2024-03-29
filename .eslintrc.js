/*
 * @Author: Derek Xu
 * @Date: 2023-02-10 11:30:40
 * @LastEditors: Derek Xu
 * @LastEditTime: 2023-10-18 17:53:48
 * @FilePath: \xut-calendar-vant-weapp\.eslintrc.js
 * @Description:
 *
 * Copyright (c) 2023 by 楚恬商行, All Rights Reserved.
 */
module.exports = {
  extends: './node_modules/@antmjs/eslint/index.js',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2021
  },
  rules: {
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        allowDestructuring: false, // Disallow `const { props, state } = this`; true by default
        allowedNames: ['self'] // Allow `const self = this`; `[]` by default
      }
    ],
    '@typescript-eslint/no-namespace': 'off'
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: 'tsconfig.json'
      }
    },
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: 'React', // Pragma to use, default to "React"
      fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
      version: 'detect' // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      // flowVersion: "0.53", // Flow version
    }
  }
}
