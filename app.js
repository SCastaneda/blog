
/**
 * Module dependencies.
 */

var express  = require('express');
var partials = require('express-partials');
var http     = require('http');
var path     = require('path');
var app      = express();

var blogs    = require('./routes/blogs');
var styles   = require('./routes/styles');

var db_blogs = require('./db/blog');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(partials());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/'             , blogs.viewPublished);
app.get('/edit/:url?'   , blogs.viewEditor);

app.post('/save-draft'  , blogs.saveDraft);
app.post('/publish'     , blogs.publishDraft);
app.post('/delete-draft', blogs.deleteDraft);

app.get('/styles/:name' , styles.editor);
app.post('/save-style'  , styles.save);
app.post('/delete-style', styles.delete);

// last one will catch any link
app.get('/:title'       , blogs.viewPost);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
