module.exports = {
    js: {
        files: 'js/**/*.js',
        tasks: ['browserify']
    },
    jsx: {
        files: 'js/**/*.jsx',
        tasks: ['browserify']
    },
    html: {
        files: 'index.html',
        tasks: ['browserify']
    }
};
