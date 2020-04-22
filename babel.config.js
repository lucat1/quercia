module.exports = {
  presets: ['@babel/preset-typescript', '@babel/preset-react'],
  plugins: [
    ['babel-plugin-transform-async-to-promises', { externalHelpers: true }]
  ]
}
