const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
          plugins: ['emotion'],
        },
      },
      {
        test: /\.jsx?$/,
        include: /node_modules/,
        use: ['react-hot-loader/webpack'],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      // inject: false,
      template: HtmlWebpackTemplate,
      title: 'Valmis',
      appMountId: 'root',
      mobile: true,
      links: [
        'https://fonts.googleapis.com/css?family=Roboto:200,300,400,500',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
};
