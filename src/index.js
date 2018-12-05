const crypto = require('crypto');

const pub = {};

const DEFAULT_STRING_LENGTH = 128;

pub.validate = function (_event) {
};

pub.create = function (event, _context, callback) {
    const length = event.ResourceProperties.Length || DEFAULT_STRING_LENGTH;
    const string = crypto.randomBytes(length).toString('hex');

    const data = {
        String: string
    };
    callback(null, data);
};

pub.delete = function (_event, _context, callback) {
    return callback();
};

pub.update = function (event, context, callback) {
    return pub.create(event, context, callback);
};

module.exports = pub;
