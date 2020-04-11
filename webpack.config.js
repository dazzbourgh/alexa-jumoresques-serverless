const path = require('path')
const glob = require('glob')

const entryArray = glob.sync('./src/**/handlers/**/index.ts')

const entryObject = entryArray.reduce((acc, item) => {
  const name = path.dirname(item.replace('./src/', ''))
  acc[name] = item
  return acc
}, {})

module.exports = {
  entry: entryObject,
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/dist')
  }
}
