const mongoose = require("mongoose");

const subscribeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const subscribeModel = mongoose.model("subscribe", subscribeSchema);
module.exports = subscribeModel;
