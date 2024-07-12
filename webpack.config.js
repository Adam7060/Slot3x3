const path = require('path');

module.exports = {
  entry: './src/Boot.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '/'),
    },
    devMiddleware: {
      publicPath: '/dist/',
    },
    compress: true,
    port: 8080,
  },
  mode: 'development', // or 'production' based on your needs
};
