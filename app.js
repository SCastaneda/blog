
/**
 * Module dependencies.
 */

var express  = require('express');
var partials = require('express-partials');
var http     = require('http');
var path     = require('path');
var app      = express();

var drafts    = require('./routes/blogs');
var styles   = require('./routes/styles');

// all environments
app.configure(function() {
  app.use(express.bodyParser());
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
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
  app.use(express.static(__dirname + '/public'));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/'             , drafts.viewPublished);
app.get('/edit/:id?'    , drafts.viewEditor);
app.get('/view-drafts'  , drafts.viewAll);

app.post('/save-draft'  , drafts.saveDraft);
app.post('/publish'     , drafts.publishDraft);
app.post('/delete-draft', drafts.deleteDraft);

app.get('/view-styles'  , styles.listStyles);
app.get('/style/:id?'    , styles.editor);
app.post('/save-style'  , styles.save);
app.post('/delete-style', styles.delete);

// last one will catch any link
app.get('/:url'       , drafts.viewPost);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
