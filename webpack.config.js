const path = require('path');

module.exports = {
    entry: {
        editor: './src/index.ts'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/js/'),
        clean: false,
        publicPath: './js/',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            }
        ],
    },
    mode: 'development',
};
