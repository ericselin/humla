const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => ({
  entry: './src/index.jsx',
  output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, '..', 'dist'),
  },
  mode: argv.mode,
  devtool: argv.mode === 'production' ? 'source-maps' : 'eval',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['react-hot-loader/webpack', 'babel-loader'],
      },
      {
        test: /\.svg$/,
        loader: 'react-svg-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Humla App',
      template: './src/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  devServer: {
    historyApiFallback: true,
  },
});