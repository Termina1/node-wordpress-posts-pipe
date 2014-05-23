var through = require('through2');
var WordpressService = require('./wordpress_service');
var cache = require('./cache');

module.exports = function(config, params) {
  var service = new WordpressService(config, params);
  return service.getStream().pipe(cache);
}
