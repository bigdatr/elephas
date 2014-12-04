"use strict";
/* global escape:false, XMLHttpRequest:false, ActiveXObject:false */

var Promise = require('es6-promise').Promise;

function fetch(method, url, callback, params) {
    var xhr;

    params = params || '';
    params = params[0] === '?' ? params.substr(1, params.length) : params;
     
    if (typeof XMLHttpRequest !== 'undefined') {
        xhr = new XMLHttpRequest();
    }
    else {
        var versions = ["MSXML2.XmlHttp.5.0",
                        "MSXML2.XmlHttp.4.0",
                        "MSXML2.XmlHttp.3.0",
                        "MSXML2.XmlHttp.2.0",
                        "Microsoft.XmlHttp"];

         for(var i = 0, len = versions.length; i < len; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            }
            catch(e){
                // I can believe its 2014 and we still have to deal with these
                // shitty Microsoft issues!!
            }
         }
    }
     
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {  
            callback(xhr);
        }
        else {
            return;
        }
    };
     
    xhr.open(method, url, true);

    if (method === 'POST' && params !== '') {
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    }

    xhr.send(params);
}

function getParamString(params) {
    var str = '';

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            if (str !== '') { str += '&'; }

            var p = params[key];

            if (typeof p === 'object') {
                p = JSON.stringify(p);
            }

            str += key + '=' + encodeURIComponent(p);
        }
    }

    // TODO: This should be done but it breaks some server side code.
    // Add middleware to automatically unescape
    // str = escape(str);

    return str;
}

var xhr = {
    get: function(url, params) {
        return new Promise(function(resolve, reject) {
            var path = params ? url + '?' + getParamString(params) : url;

            // setTimeout(function() {

            fetch('GET', path, function(response) {
                if (response.status >= 500) {
                    return reject(response);
                }

                var txt = response.responseText;

                if (txt === '') {
                    console.error('XHR Request failed', response);
                    txt = '{}';
                }

                var message = JSON.parse(txt);

                if (response.status === 200) {
                    resolve(message);
                }
                else {
                    reject(message);
                }
            });

            // }, 5000);

        });
    },
    post: function(url, params) {
        return new Promise(function(resolve, reject) {
            fetch('POST', url, function(response) {
                if (response.status >= 500) {
                    return reject(response);
                }

                var message = JSON.parse(response.responseText);

                if (response.status === 200) {
                    resolve(message);
                }
                else {
                    reject(message);
                }
            }, getParamString(params));
        });
    }
};

module.exports = xhr;