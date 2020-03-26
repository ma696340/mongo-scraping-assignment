var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var noteSchema = new Schema({

  _headlineId: {
    type: Schema.Types.ObjectId
  },
  date: {
    type: Date,
    default: Date.now
  },
  noteText: String
});

var Note = mongoose.model(noteSchema);

module.exports = Note;
