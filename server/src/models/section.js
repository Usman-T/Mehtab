const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
});

module.exports = mongoose.model("Section", sectionSchema);
