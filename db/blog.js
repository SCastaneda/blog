var connect  = require('./connect');
var mongoose = connect.mongoose;
var Schema   = connect.schema;

var draftSchema  = new Schema({
  title:       String,
  content:     String,
  styling:     Schema.Types.ObjectId,
  url:         String,
  date_posted: Date,
  posted:      Boolean,
  category:    String
});

var draftModel   = mongoose.model('drafts', draftSchema);

// can list posted, or unposted ones
exports.listDrafts = function(posted, cb) {
  draftModel.find({posted: posted}, function(err, drafts) {
    if(err) { throw err; }
    return cb(drafts);
  });
};

exports.listAll = function(cb) {
  draftModel.find({}, function(err, drafts) {
    if(err) { throw err; }
    return cb(drafts);
  });
};

exports.newDraft = function(title, content, styling, category, cb) {
  var draft      = new draftModel();
  draft.title    = title;
  draft.content  = content;
  draft.styling  = styling;
  draft.posted   = false;
  draft.category = category;

  draft.save(function(err, draft) {
    if(err) { throw err; }
    return cb(draft._id);
  });
};

exports.getDraftById = function(id, cb) {
  draftModel.findOne({_id: id}, function(err, draft) {
    if(err) { throw err; }
    return cb(draft);
  });
};

exports.updateDraft = function(draft_id, title, content, styling, category, cb) {
  draftModel.update({ _id: draft_id },
    {title: title, content: content, styling: styling, category: category}, function(err, numAffected, raw) {
    //console.log(raw);
    if(err) { throw err; }
    return cb(draft_id);
  });
};

exports.deleteDraft = function(id, cb) {
  draftModel.findOne({_id: id}, function(err, draft) {
    if(!draft.posted) {
      draftModel.findByIdAndRemove(id, function(err) {
        return cb(true, "Draft was deleted successfully!");
      });
    } else {
      return cb(false, "Can't delete draft, already posted!");
    }
  });
};

exports.publishDraft = function(id, cb) {
  draftModel.findOne({_id:id}, function(err, draft) {
    generateUrl(draft.title, (new Date()), function(url) {
      draftModel.update({_id: id}, {posted: true, date_posted: new Date(), url: url}, function(err, numAffected, raw) {
        if(err) { throw err; }
        cb(url);
      });
    });
  });
};

exports.getDraftByUrl = function(url, cb) {
  draftModel.findOne({url: url}, function(err, draft) {
    if(err) { throw err; }
    return cb(draft);
  });
};

// appends the year makes all lowercase, and replaces whitespace with '-'
function generateUrl(title, date, cb) {

  var url = (title.length > 40 ? title.substr(0,10) : title);
  url = (url + " " + date.getFullYear()).toLowerCase().replace(/\s/g, "-");
  console.log("Generated URL: " + url);
  return cb(url);
}
