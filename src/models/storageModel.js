import {Schema, model} from "mongoose" ;

const StorageSchema = new Schema(
  {
    account: {
      type:  Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true
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

const StorageModel  =  model("Storage", StorageSchema);
export default StorageModel;
