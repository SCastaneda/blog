var mongoose           = require('mongoose');
var db                 = mongoose.connect('mongodb://localhost/blog');
var Schema             = mongoose.Schema;

var blogSchema  = new Schema({
    title:       String,
    content:     String,
    styling:     Schema.Types.ObjectId,
    url:         String,
    date_posted: Date,
    posted:      Boolean,
    category:    String
});

// styles will allow for custom styling per draft/post
var stylingSchema = new Schema({
    name:    String,
    content: String
});

var blogModel    = mongoose.model('blog', blogSchema);
var stylingModel = mongoose.model('styling', stylingSchema);

exports.getStyle = function(id, cb) {
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
    stylingModel.findOne({_id: id}, {name: name, content: content}, 
        function(err, numAffected, raw){
            if(err) { throw err; }
            return cb(true);
    });
};

// only delete if there are no posts depending on the style
exports.deleteStyle = function(id, cb) {
    blogModel.find({styling: id}, function(err, drafts) {
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

exports.newDraft = function(title, content, styling, category, cb) {
    var draft      = new blogModel();
    draft.title    = title;
    draft.content  = content;
    draft.styling  = styling;
    draft.posted   = false;
    draft.category = category;

    generateUrl(title, (new Date()), function(url) {
        draft.url = url;
        draft.save(function(err, draft) {
            if(err) { throw err; }
            return cb(draft.url);
        });
    }); 
};

exports.updateDraft = function(id, title, content, styling, category, cb) {
    generateUrl(title, (new Date()), function(url) {

        blogModel.update({_id: id}, 
            {title: title, content: content, styling: styling, url: url, category:category},
            function(err, numAffected, raw) {
                return cb(url);
        });
    }); 
};

exports.deleteDraft = function(id, cb) {
    blogModel.findOne({_id: id}, function(err, draft) {
        if(!draft.posted) {
            blogModel.findByIdAndRemove(id, function(err) {
                return cb(true, "Draft was deleted successfully!");
            });
        } else {
            return cb(false, "Can't delete draft, already posted!");
        }
    });
};

exports.publishDraft = function(id, cb) {
    blogModel.update({_id: id}, {posted: true, date_posted: (new Date())}, function(err, numAffected, raw) {
        if(err) { throw err; }
        cb(url);
    });
};

exports.getPostByUrl = function(url, cb) {
    blogModel.findOne({url: url}, function(err, post) {
        if(err) { throw err; }
        return cb(post);
    });
};

// appends the year makes all lowercase, and replaces whitespace with '-' 
function generateUrl(title, date, cb) {
    var url = (title.length > 40 ? title.substr(0,10) : title);
    return (url + " " + date.getFullYear()).toLowerCase().replace(/\s/g, "-");
}
