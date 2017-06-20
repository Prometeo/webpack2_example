var isProd = process.env.NODE.ENV === 'prod';
const path = require('path');
const glob = require('glob');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
const bootstrapEntryPoints = require('./webpack.bootstrap.config.js');
const PurifyCSSPlugin = require('purifycss-webpack');
var bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
    entry: {
        app: './src/app.js',
        contact: './src/contact.js',
        bootstrap: bootstrapEntryPoints.prod
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [{
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader'],
                    publicPath: '/dist'
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?name=[name].[ext]&outputPath=images/&publicPath=dist/',
                    'image-webpack-loader'
                ]
            },
            {
                test: /\.(woff2?|svg)$/,
                loader: 'url-loader?limit=10000&name=fonts/[name].[ext]'
            },
            {
                test: /\.(ttf|eot)$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
                loader: 'imports-loader?jQuery=jquery'
            },

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Project Demo',
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            excludeChunks: ['contact'],
            filename: 'index.html',
            template: './src/index.ejs'
        }),
        new HtmlWebpackPlugin({
            title: 'Contact Page',
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            chunks: ['contact'],
            filename: 'contact.html',
            template: './src/contact.html'
        }),
        new ExtractTextPlugin({
            filename: '/css/[name].css',
            disable: false,
            allChunks: true
        }),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html'))
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 9000,
            server: {
                baseDir: ['dist']
            },
            reload: false
        })
    ]
};