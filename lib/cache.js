var through = require('through2');
var crypto = require('crypto');
var redis = require('redis');
var redisClient = redis.createClient()
var SET = 'wp_tube_caches';

module.exports = through.obj(function(chunk, enc, callback) {
  var string = JSON.stringify(chunk);
  var hash = crypto.createHash('md5').update(string).digest('hex');
  redisClient.sismember(SET, hash, function(err, result) {
    if(!result) {
      this.push(chunk);
      redisClient.sadd(SET, hash);
    }
    callback();
  }.bind(this))
})
