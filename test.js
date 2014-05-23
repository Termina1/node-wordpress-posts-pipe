var stream = require('./lib/stream');

stream({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'paperpress',
  prefix: 'papercut_'
}).on('data', function(chunk) {
  console.log(chunk);
});
