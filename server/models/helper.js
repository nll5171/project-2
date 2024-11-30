const _ = require('underscore');

const trim = (text) => _.escape(text).trim();

module.exports = {
    trim,
};