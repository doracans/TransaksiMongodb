import mongoose from "mongoose";

const permissionSchema = mongoose.Schema({
  action: { type: String, required: true },
});

export default mongoose.model("Permission", permissionSchema);
