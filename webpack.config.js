const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { execSync } = require('child_process');
const pkg = require('./package.json');

function getVersion() {
  const epoch = Math.floor(Date.now() / 1000);

  try {
    // If you use git tags, you can keep this, but ensure it returns a valid structure
    const tag = execSync('git describe --tags --abbrev=0', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
    return `${epoch}.${tag}`;
  } catch {
    try {
      const sha = execSync('git rev-parse --short HEAD', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim();
      const branch = execSync('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim();

      // Returns format: 1716217210.8ed86b1-main
      // Tampermonkey evaluates the number up to the dot first, ensuring clean sorting
      return `${epoch}.${branch}.${sha}`;
    } catch {
      return `${epoch}.development`;
    }
  }
}

const version = getVersion();
const isProd = process.argv.includes('production');

module.exports = {
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.user.js',
    path: path.resolve(__dirname, 'dist'),
    environment: {
      arrowFunction: true,
      const: true,
      destructuring: true,
      dynamicImport: true,
      forOf: true,
      module: true,
      optionalChaining: true,
      templateLiteral: true,
    }
  },
  mode: isProd ? 'production' : 'development',
  optimization: {
    minimize: isProd,
    minimizer: isProd ? [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: /==UserScript==|==\/UserScript==|@name|@description|@version|@author|@namespace|@match|@allFrames|@icon|@updateURL|@downloadURL|@grant/,
          },
        },
      }),
    ] : undefined,
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(version),
    }),
    new webpack.BannerPlugin({
      banner: `// ==UserScript==
// @name         ${pkg.name}
// @description  ${pkg.description}
// @version      ${version}
// @author       ${pkg.author}
// @namespace    ${pkg.config.namespace}
// @match        ${pkg.config.match}
// @allFrames    true
// @icon         ${pkg.config.icon}
// @updateURL    https://github.com/mxbaylee/${pkg.name}/releases/download/latest/bundle.user.js
// @downloadURL  https://github.com/mxbaylee/${pkg.name}/releases/download/latest/bundle.user.js
// @grant        none
// ==/UserScript==
`,
      raw: true,
    }),
  ],
  devtool: isProd ? false : 'inline-source-map',
  performance: {
    hints: false,
  },
};
