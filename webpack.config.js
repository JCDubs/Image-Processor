const slsw = require('serverless-webpack');
const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: slsw.lib.entries,
    devtool: 'eval-source-map',
    output: {
        libraryTarget: 'commonjs',
        path: path.resolve(__dirname, '.webpack'),
        filename: '[name].js'
    },
    optimization: {
        minimize: false
    },
    target: 'node',
    mode: 'production',
    resolve: {
        alias: {
            '-': path.resolve(__dirname, 'src')
        }
    },
    plugins: [new webpack.ProvidePlugin({
        vue: ['vue/dist/vue.esm.js', 'default']
    })]
}