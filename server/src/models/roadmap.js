const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  sections: {
    type: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        resources: [{ type: String }],
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model("Roadmap", roadmapSchema);
