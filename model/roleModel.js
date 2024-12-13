import mongoose from "mongoose";
import permissionsModel from "./permissionsModel.js";

const roleSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [
    { type: mongoose.Schema.Types.ObjectId, ref: permissionsModel },
  ],
});

export default mongoose.model("Role", roleSchema);
