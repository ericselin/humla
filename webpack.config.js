const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => ({
  entry: './src/index.jsx',
  output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, 'dist'),
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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Humla App',
      template: './src/index.html',
    }),
    new CopyPlugin([
      { from: 'src/humla-*.html', to: '.', flatten: true },
    ]),
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  devServer: {
    historyApiFallback: true,
  },
});
