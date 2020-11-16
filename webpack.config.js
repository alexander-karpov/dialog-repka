const path = require('path');

module.exports = {
    entry: {
        repka: './src/repka/handler.ts',
    },
    mode: 'production',
    target: 'node',
    externals: ['axios', 'mongodb'],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs'
    },
};
