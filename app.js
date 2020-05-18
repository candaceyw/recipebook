var express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cons = require('consolidate'),
  dust = require('dustjs-helpers'),
  pg = require('pg'),
  app = express();

// DB Connect string

const config = {
  user: 'candace',
  database: 'recipebookdb',
  password: 'Bokeh2470',
  port: 5432, //Default port, change it if needed
};
const pool = new pg.Pool(config);
// Assign Dust Engine to .dust files
app.engine('dust', cons.dust);

// Set default ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM recipes', function (err, result) {
      if (err) {
        return console.error('error running query', err);
      }
      res.render('index', { recipes: result.rows });
      done();
    });
  });
});

// Server
app.listen(3000, function () {
  console.log('Server Started On Port 3000');
});
// command line: $ node app
