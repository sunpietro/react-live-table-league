'use strict';

var Ajax = function (url, successCallback, errorCallback) {
    var xmlhttp = new XMLHttpRequest(),
        defaultCallback = function (response) {
            console.log('defaultCallback', response);
        };

    successCallback = successCallback || defaultCallback;
    errorCallback = errorCallback || defaultCallback;

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
            if (xmlhttp.status === 200) {
                successCallback(xmlhttp.responseText);
            } else {
                errorCallback(xmlhttp.responseText);
            }
        }
    };

    xmlhttp.open('GET', url, true);
    xmlhttp.send();
};

module.exports = Ajax;
