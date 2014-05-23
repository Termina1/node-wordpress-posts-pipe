var mysql = require('mysql');
var through = require('through2');

function WordpressService(config, params) {
  this.config = config || {};
  this.params = params || {};
  this.connection = mysql.createConnection({
    host: this.config.host,
    user: this.config.user,
    password: this.config.password,
    database: this.config.database
  });
  this.stream = through.obj(function(chunk, enc, callback) {
    this.push(chunk);
    callback();
  });
  this.connection.connect();
  this._startSucking();
}

WordpressService.prototype = {
  getStream: function() {
    return this.stream;
  },

  _startSucking: function() {
    function suck() {
      var queryStream = this.connection.query(this._createQuery()).stream();
      queryStream.on('data', function(chunk) {
        this.stream.write(chunk);
      }.bind(this));
      queryStream.on('end', function() {
        setTimeout(suck.bind(this), 5 * 1000);
      }.bind(this));
    }
    suck.apply(this);
  },

  _getWhere: function() {
    var where = this.params.where || { post_status: 'publish' };
    var result = [];
    for(var key in where) if(where.hasOwnProperty(key)) {
      result.push(key + " = '" + where[key] + "'");
    }
    return result.join(" AND ");
  },

  _createQuery: function() {
    var fields = this.params.fields || ['post_date', 'post_title', 'post_content', 'post_excerpt'];
    fields.push('ID');
    return "SELECT " + fields.join(',') + " FROM " + this.config.prefix + "posts WHERE " + this._getWhere() + " LIMIT 10";
  }
}

module.exports = WordpressService;
