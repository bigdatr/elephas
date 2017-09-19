'use strict';

var express = require('express');

module.exports = function (done, app, static_root_path) {
    if (static_root_path) {
        app.use(express['static'](static_root_path));
    }

    done();
};