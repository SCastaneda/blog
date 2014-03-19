var mongoose = require('mongoose');
var db       = mongoose.connect('mongodb://localhost/blog');

exports.schema   = mongoose.Schema;
exports.mongoose = mongoose;
