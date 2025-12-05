const mongoose = require("mongoose");

const StorageSchema = new Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    space: {
      type: Number,
      default: 20 * 1024 * 1024, 
    },

    usedSpace: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Storage", StorageSchema);
