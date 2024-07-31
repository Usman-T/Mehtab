const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
});

const roadmapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  sections: {
    type: [sectionSchema],
    required: true,
  },
});

module.exports = mongoose.model("Roadmap", roadmapSchema);
