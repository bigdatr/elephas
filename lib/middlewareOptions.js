'use strict';

var _ = require('lodash');
var logger = require('./logger');

var defaultOptions = {
    csp: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'self'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
        // sandbox: ['allow-forms', 'allow-scripts'],
        // reportUri: '/report-violation',
        // reportOnly: false, // set to true if you only want to report errors
        setAllHeaders: false, // set to true if you want to set all headers
        disableAndroid: true, // set to true if you want to disable Android (browsers can vary and be buggy)
        safari5: false // set to true if you want to force buggy CSP in Safari 5
    },
    frameguard: ["SAMEORIGIN"],
    hsts: {
        maxAge: 7776000000,
        includeSubdomains: true
    },
    // crossdomain: {
    //     caseSensitive: true
    // },
    session: {
        // cookie: {httpOnly: true, secure: true}, // This breaks the login!!
        saveUninitialized: true,
        resave: true,

        // Ideally, this should be provided
        secret: 'F*_WgXEN6=V-7xJLKvKF%6-NnZR7j^_gJX*@B4cATw#6@X%wkHP*_zV_8_3zXQRuu!=kGyds&+TMp^KB&=h^@NPd_KXQ3q%EXd=eJZ8m$*Zr@@B2!9Q^nPypTtqX^upJ'
    },
    bodyParser: {
        json: {
            limit: 10 * 1024 * 1024 //10MB limit
        },
        urlencoded: {
            extended: true
        }
    },
    multer: {
        dest: './tmp/uploads/',
        rename: function rename(fieldname, filename) {
            return fieldname + "_" + filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
        }
    },
    compression: {
        threshold: 1024 * 1 //1kb
    },
    timeout: {
        ms: 40 * 1000 //40 seconds
    }
};

function validateOptions(key, options) {
    if (key === 'session') {
        if (!options.session === false && (!options.session || !options.session.secret)) {
            logger.error('Should provide your own session secret in the elephas config.');
        }
    }
}

module.exports = function _middlewareOptions(key, options) {
    validateOptions(key, options);

    var opt = _.defaults(options[key] || {}, defaultOptions[key]);
    return opt;
};