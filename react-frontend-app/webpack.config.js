var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPloginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body'
})


module.exports = {
    entry: [
        './app/index.js'
    ],
    output: {
        path: __dirname + '/dist',
        filename: "index_bundle.js"
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: ['file-loader?context=src/images&name=images/[path][name].[ext]', {
                    loader: 'image-webpack-loader',
                    query: {
                        mozjpeg: {
                        progressive: true,
                        },
                        gifsicle: {
                        interlaced: false,
                        },
                        optipng: {
                        optimizationLevel: 4,
                        },
                        pngquant: {
                        quality: '75-90',
                        speed: 3,
                        },
                    },
                }]
            }
        ]
    },
    plugins: [HtmlWebpackPloginConfig]
}