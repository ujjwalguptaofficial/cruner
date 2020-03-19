const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
// const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')


const isProd = process.env.NODE_ENV === 'production';
console.log("webpack build runing for environment", process.env.NODE_ENV);
const outputFolder = isProd ? "build" : "dist";

module.exports = [{
    entry: './src/electron/index.ts',
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : 'source-map',
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader'
            }
        }]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'scripts/app.js',
        path: path.resolve(__dirname, outputFolder)
    },

    target: 'electron-main',
    node: {
        __dirname: false,
        __filename: false
    }
}
    , {
    entry: './src/app/index.ts',
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : 'source-map',
    target: 'electron-renderer',
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            }
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: 'client/images',
                },
            }]
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        },

        {
            test: /\.css$/,
            oneOf: [
                // this applies to <style module>
                {
                    resourceQuery: /module/,
                    use: [
                        'vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[local]_[hash:base64:8]'
                            }
                        }
                    ]
                },
                // this applies to <style> or <style scoped>
                {
                    use: [
                        'vue-style-loader',
                        'css-loader'
                    ]
                }
            ]
            // use: [
            //     isProd ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            //     { loader: 'css-loader' },
            // ]
        },
        {
            test: /\.styl$/,
            use: [
                {
                    loader: "style-loader" // creates style nodes from JS strings
                },
                {
                    loader: "css-loader" // translates CSS into CommonJS
                },
                {
                    loader: "stylus-loader" // compiles Stylus to CSS
                }
            ]
        },
        {
            test: /\.scss$/,
            use: [
                'vue-style-loader',
                'css-loader',
                {
                    loader: 'sass-loader',
                    // global data for all components
                    // this can be read from a scss file
                }
            ]
        },
        {
            test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
            use: 'file-loader?name=fonts/[name][hash].[ext]]&mimetype=application/octet-stream'
        },
        {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            use: 'file-loader?name=fonts/[name][hash].[ext]&mimetype=application/octet-stream'
        },
        {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            use: 'file-loader'
        }
        ]
    },
    output: {
        filename: 'scripts/renderer.js',
        path: path.resolve(__dirname, outputFolder)
    },
    resolve: {
        extensions: ['.js', '.ts', '.vue']
    },
    plugins: [
        // new VuetifyLoaderPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            // cache: true,
            // hash: true,
            template: './src/index.html',
            minify: {
                collapseWhitespace: !isProd,
                removeComments: !isProd,
                removeRedundantAttributes: !isProd,
                removeScriptTypeAttributes: !isProd,
                removeStyleLinkTypeAttributes: !isProd
            }
        }),
        new CopyPlugin([{
            from: './src/assets/',
            to: 'assets/'
        }]),
        new MiniCssExtractPlugin({
            filename: 'styles/style.[contenthash].css',
            // chunkFilename: '[id].css',
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ],
    optimization: {
        // runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 10000,
            maxSize: 100000,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        console.log('package', packageName);
                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
        minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin({
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
        })],
        // output: {
        //     filename: 'scripts/renderer.js',
        //     path: path.resolve(__dirname, 'dist/')
        // },
        // plugins: [
        //     new HtmlWebpackPlugin({
        //         template: 'src/index.html'
        //     })
        // ],

    }
}];