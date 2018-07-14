module.exports = {
  use: [
    '@neutrinojs/standardjs',
    [
      '@neutrinojs/vue',
      {
        html: {
          title: 'IG Live Desktop'
        }
      }
    ],
    '@neutrinojs/jest'
  ]
};
