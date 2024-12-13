import mongoose from "mongoose";

const barangSchema = mongoose.Schema(
  {
    nama_barang: {type: String,required:true},
    deskripsi: { type: String, default: "" },
    harga: { type: Number, required: true },
    stok: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Barang", barangSchema);
