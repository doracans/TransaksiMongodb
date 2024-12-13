import mongoose from "mongoose";

const transaksiSchema = mongoose.Schema(
  {
    id_user: {type: mongoose.Schema.Types.ObjectId, ref: "User",required: true,},
    nama_pemesan: { type: String, required: true },
    detail_transaksi: [
      {
        id_barang: { type: mongoose.Schema.Types.ObjectId, ref: "Barang", required: true, },
        nama_barang:{type: String, required:true},
        harga: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Transaksi", transaksiSchema);
