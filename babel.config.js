module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        exclude: [
          '@babel/plugin-transform-regenerator',
          '@babel/plugin-transform-typeof-symbol'
        ],
        useBuiltIns: 'usage',
        corejs: 3,
        loose: true,
        targets: {
          browsers: ['last 2 versions', 'IE >= 11']
        }
      }
    ],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    ['babel-plugin-transform-async-to-promises', { includeHelpers: true }]
  ]
}
