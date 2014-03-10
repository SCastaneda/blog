
// GET
exports.viewPublished = function(req, res) {
    var message;
    if(typeof req.session.message !== "undefined") {
        message = req.session.message;
        req.session.message = undefined;
    }

    res.render('index.ejs', {message: message});
};

exports.viewEditor = function(req, res) {
    var title = req.params.title;
    res.render('blogs/editor', {title: title});
};

exports.viewPost = function(req, res) {
    res.render('blogs/post', {});
};

// POST
exports.saveDraft = function(req, res) {
    req.session.message = "draft saved";
    res.redirect('/');
};

exports.publishDraft = function(req, res) {
    req.session.message = "draft published";
    res.redirect('/');
};

exports.deleteDraft = function(req, res) {
    req.session.message = "draft deleted";
    res.redirect('/');
};

