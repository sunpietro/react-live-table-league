module.exports = {
    js: {
        options: {
            debug: true,
            transform: ['reactify']
        },
        files: {
            'js/app.js': [
                'js/ajax.js',
                'js/gamesservice.js',
                'js/tableview.jsx'
            ]
        }
    },
};
