module.exports = function (cfg) {
  cfg.resolve = {
    // Add `.ts` and `.tsx` as a resolvable extension
    extensions: ['.ts', '.tsx', '.js']
  }

  cfg.module = {
    rules: [
      {
        test: /.(ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          configFile: require('path').join(__dirname, 'tsconfig.json')
        }
      }
    ]
  }

  return cfg
}
