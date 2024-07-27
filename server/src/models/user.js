
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  progress: {
    type: [
      {
        roadmap: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap" },
        completedSections: [{ type: mongoose.Schema.Types.ObjectId }],
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("User", schema);
