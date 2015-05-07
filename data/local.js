// Settings specific to this server. Everything you put here
// is merged with the object you pass when configuring
// `apostrophe-site` in app.js.
var settings;
var nodeEnv = process.env.NODE_ENV || 'development';
if (nodeEnv === 'production') {
  settings = require('./production');
} else {
  settings = require('./development');
}

module.exports = settings;
