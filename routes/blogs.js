var blog_db    = require("../db/blog");
var styles_db  = require("../db/styles");
var categories = ['Projects'];

// GET
exports.viewPublished = function(req, res) {
    var message;
    if(typeof req.session.message !== "undefined") {
        message = req.session.message;
        req.session.message = undefined;
    }

    blog_db.listDrafts(true, function(drafts) {
        res.render('index.ejs', {message: message, drafts: drafts});
    });
};

// for author only
exports.viewAll = function(req, res) {
    var message;
    if(typeof req.session.message !== "undefined") {
        message = req.session.message;
        req.session.message = undefined;
    }

    blog_db.listAll(function(drafts) {
        res.render('blogs/view_all.ejs', {message: message, drafts: drafts});
    });
};

exports.viewEditor = function(req, res) {
    var id = req.params.id;

    if(typeof id !== 'undefined') {
        blog_db.getDraftById(id, function(draft) {
            styles_db.getStyles(function(styles) {
                res.render('blogs/editor',
                    {
                        draft      : draft,
                        categories : categories,
                        styles     : styles
                    }
                );
            });
        });
    } else {
        styles_db.getStyles(function(styles) {
            res.render('blogs/editor',
                {
                    categories : categories,
                    styles     : styles
                }
            );
        });
    }
};

exports.viewPost = function(req, res) {
    var url = req.params.url;
    console.log("URL: " + url);

    blog_db.getDraftByUrl(url, function(draft) {
      console.log(draft);
      if(typeof draft !== 'undefined') {
        styles_db.getStyleById(draft.styling, function(style) {
          res.render('blogs/post', { draft: draft, styling: style.content });
        });
      } else {
        req.session.message = "Could not find Blog post";
        res.redirect('/');
      }

    });
};

// POST
exports.saveDraft = function(req, res) {
    var title    = req.body.title;
    var content  = req.body.content;
    var styling  = req.body.style;
    var category = req.body.category;
    var draft_id = req.body.draft_id;

    req.session.message = "draft saved";

    if(draft_id === '') {
        blog_db.newDraft(title, content, styling, category, function(id) {
            res.redirect('/');
        });
    } else {
        blog_db.updateDraft(draft_id, title, content, styling, category, function(id) {
            res.redirect('/');
        });
    }
};

exports.publishDraft = function(req, res) {
    var blog_id = req.body.id;
    blog_db.publishDraft(blog_id, function(url) {
      req.session.message = "draft published";
      res.json({url: url});
    });
};

exports.deleteDraft = function(req, res) {
    var blog_id = req.body.id;
    blog_db.deleteDraft(blog_id, function(deleted, message) {
      req.session.message = message;
      res.json({status: deleted, message: message });
    });
};
