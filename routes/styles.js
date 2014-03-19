var styles_db  = require("../db/styles");

// GET
exports.editor = function(req,res) {
    var id = req.params.id;

    if(typeof id !== 'undefined') {
      styles_db.getStyleById(id, function(style) {
        res.render('styles/editor', {style: style});
      });
    } else {
      res.render('styles/editor', {style: undefined});
    }
};

exports.listStyles = function(req, res) {
    styles_db.getStyles(function(styles) {
      res.render('styles/view_all.ejs', {styles: styles});
    });
};


// POST
exports.save = function(req,res) {
    var name    = req.body.name;
    var content = req.body.content;
    var id      = req.body.id;

    if(id === '') {
        styles_db.newStyle(name, content, function(style) {
          req.session.message = "New style saved";
          res.redirect('/view-styles');
        });

    } else {
        styles_db.updateStyle(id, name, content, function(saved) {
          req.session.meessage = "Style saved";
          res.redirect('/view-styles');
        });

    }
};

exports.delete = function(req,res) {
    req.session.message = "style deleted";
    res.redirect('/');
};
