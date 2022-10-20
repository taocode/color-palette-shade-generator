const mixins = require('postcss-mixins');
const simplevars = require('postcss-simple-vars');
const autoprefixer = require('autoprefixer');

const config = {
	plugins: [mixins,simplevars,autoprefixer]
};

module.exports = config;
