'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const loaders = require('./loaders');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const publicPath = '/';
const publicUrl = '';
const env = getClientEnvironment(publicUrl);


module.exports = {
    devtool: 'inline-source-map',
    entry: {
        index: [
            require.resolve('./polyfills'),
            require.resolve('react-dev-utils/webpackHotDevClient'),
            paths.appIndexJs
        ],
        vendor: [
            'react',
            'react-dom',
            'react-router',
            "redux",
            "react-loadable",
            'react-redux',
        ],
    },
    output: {
        pathinfo: true,
        filename: 'static/[name].[hash].js',
        sourceMapFilename: 'static/[file].[hash].map',
        chunkFilename: 'static/[name].[chunkhash:5].chunk.js',
        publicPath: publicPath,
        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: info =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    resolve: {
        // This allows you to set a fallback for where Webpack should look for modules.
        // We placed these paths second because we want `node_modules` to "win"
        // if there are any conflicts. This matches Node resolution mechanism.
        // https://github.com/facebookincubator/create-react-app/issues/253
        modules: ['node_modules', paths.appNodeModules].concat(
            // It is guaranteed to exist because we tweak it in `env.js`
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        ),
        // These are the reasonable defaults supported by the Node ecosystem.
        // We also include JSX as a common component filename extension to support
        // some tools, although we do not recommend using it, see:
        // https://github.com/facebookincubator/create-react-app/issues/290
        // `web` extension prefixes have been added for better support
        // for React Native Web.
        extensions: [
            '.mjs',
            '.web.ts',
            '.ts',
            '.web.tsx',
            '.tsx',
            '.web.js',
            '.js',
            '.json',
            '.web.jsx',
            '.jsx',
        ],
        alias: {

            // Support React Native Web
            // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
            'react-native': 'react-native-web',
        },
        plugins: [
            // Prevents users from importing files from outside of src/ (or node_modules/).
            // This often causes confusion because we only process files within src/ with babel.
            // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
            // please link the files into your node_modules/ and let module-resolution kick in.
            // Make sure your source files are compiled, as they will not be processed in any way.
            new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
            new TsconfigPathsPlugin({
                configFile: paths.appTsConfig
            }),
        ],
    },
    module: {
        strictExportPresence: true,
        rules: [
            // TODO: Disable require.ensure as it's not a standard language feature.
            // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
            // { parser: { requireEnsure: false } },
            {
                test: /\.(js|jsx|mjs)$/,
                loader: require.resolve('source-map-loader'),
                enforce: 'pre',
                include: paths.appSrc,
            },
            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list.
                oneOf: [
                    loaders.urlLoader,
                    loaders.jsLoader,
                    loaders.tsLoader,
                    // loaders.modulesCssLoad,
                    //  loaders.cssLoaderProd,
                    //  loaders.scssLoaderProd,
                    // loaders.lessLoaderProd,
                    // ** STOP ** Are you adding a new loader?
                    // Make sure to add the new loader(s) before the "file" loader.
                ],
            },
            {
                test: /\.less$/,
                include: [/node_modules/], //antd目录
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
                    use: ['css-loader?localIdentName=[local]___[hash:base64:5]', 'less-loader']
                })
            },
            {
                test: /\.(scss|css)$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: "typings-for-css-modules-loader",
                            options: {
                                modules: true,
                                localIdentName: "[name]_[hash:base64]",
                                camelCase: true,
                                namedExport: true,
                                minimize: false
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
        ],
    },
    plugins: [
        // Makes some environment variables available in index.html.
        // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
        // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
        // In development, this will be an empty string.
        new InterpolateHtmlPlugin(env.raw),
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
        }),
        // Add module names to factory functions so they appear in browser profiler.
        new webpack.NamedModulesPlugin(),
        // Makes some environment variables available to the JS code, for example:
        // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
        new webpack.DefinePlugin(env.stringified),
        // This is necessary to emit hot updates (currently CSS only):
        new webpack.HotModuleReplacementPlugin(),
        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        // See https://github.com/facebookincubator/create-react-app/issues/240
        new CaseSensitivePathsPlugin(),
        new WatchMissingNodeModulesPlugin(paths.appNodeModules),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
        // Perform type checking and linting in a separate process to speed up compilation
        new ForkTsCheckerWebpackPlugin({
            async: false,
            watch: paths.appSrc,
            tsconfig: paths.appTsConfig,
            tslint: paths.appTsLint,
        }),
        new webpack
        .optimize
        .CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        }),
        new webpack
        .optimize
        .ModuleConcatenationPlugin(),
        new ExtractTextPlugin({
            filename: '[name].[hash].css',
            disable: false,
            allChunks: false,
        }),
    ],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    },
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
        hints: false,
    },
};
