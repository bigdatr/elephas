'use strict';

var recursive = require('recursive-readdir');

module.exports = function findFiles(path, suffix, cb) {
    recursive(path, function(err, files) {
        if (err) { return cb ? cb(err) : null; }
        
        var routers = files.filter(function(f) {
            var len = suffix.length;
            return f.substr(f.length - len, len) === suffix;
        });

        return cb(null, routers);
    });
};