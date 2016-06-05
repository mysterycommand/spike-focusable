import webpack from 'webpack';
import Text from 'extract-text-webpack-plugin';

export default {
    entry: {
        'main.js': './source/main.js',
        'main.css': './source/main.scss',
    },

    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                plugins: ['transform-runtime'],
                presets: ['es2015'],
            },
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            loader: Text.extract('style', 'css?root=.&sourceMap!sass?' + JSON.stringify({
                outputStyle: 'expanded',
                precision: 9,
                sourceComments: true,
                sourceMap: true,
            })),
        }],
    },

    output: {
        filename: '[name]',
        publicPath: '',
    },

    plugins: [
        new webpack.EnvironmentPlugin([
            'NODE_ENV',
        ]),
        new Text('main.css'),
    ],
};
