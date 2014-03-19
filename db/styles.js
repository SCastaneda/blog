var connect  = require('./connect');
var mongoose = connect.mongoose;
var Schema   = connect.schema;

// styles will allow for custom styling per draft/post
var stylingSchema = new Schema({
    name:    String,
    content: String
});

var stylingModel = mongoose.model('stylings', stylingSchema);

exports.getStyles = function(cb) {
    stylingModel.find({}, function(err, styles) {
        if(err) { throw err; }
        return cb(styles);
    });
};

exports.getStyleById = function(id, cb) {
    stylingModel.findOne({_id: id}, function(err, style) {
        if(err) { throw err; }
        return cb(style);
    });
};

exports.newStyle = function(name, content, cb) {
    var style     = new stylingModel();
    style.name    = name;
    style.content = content;

    style.save(function(err, style) {
        if(err) { throw err; }
        return cb(style);
    });
};

exports.updateStyle = function(id, name, content, cb) {
    stylingModel.update({_id: id}, {name: name, content: content},
        function(err, numAffected, raw){
            if(err) { throw err; }
            return cb(true);
    });
};

// only delete if there are no posts depending on the style
exports.deleteStyle = function(id, cb) {
    draftModel.find({styling: id}, function(err, drafts) {
        if(drafts.length > 0) {
            return cb(false, "can't delete, drafts depending on styles", drafts);
        } else {
            stylingModel.findByIdAndRemove(id, function(err) {
                if(err) { throw err; }
                return cb(true, "style deleted successfully");
            });
        }
    });
};
