module.exports = {
    context: __dirname,
    entry: './frontend/app/entry',
    output: {
        path: __dirname + '/public/javascript',
        filename: 'bundle.js',
    },
    module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015'],
                 },
             },
         ],
     },
};
