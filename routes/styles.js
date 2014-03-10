// GET
exports.editor = function(req,res) {
    res.render('styles/editor', {});
};


// POST
exports.save = function(req,res) {
    req.session.message = "style saved";
    res.redirect('/');
};

exports.delete = function(req,res) {
    req.session.message = "style deleted";
    res.redirect('/');  
};