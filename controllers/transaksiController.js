import mongoose from "mongoose";
import Transaksi from "../model/transaksiModel.js";
import Barang from "../model/barangModel.js";

export const createTransaksi = async (req, res) => {
  const { id_user, nama_pemesan, detail_transaksi } = req.body;

  const session = await mongoose.startSession(); // Mulai sesi transaksi
  session.startTransaction(); // Memulai transaksi

  try {
    // Ambil ID barang dari detail_transaksi
    const barangIds = detail_transaksi.map((item) => item.id_barang);

    // Ambil data barang dengan session transaksi
    const barangList = await Barang.find({ _id: { $in: barangIds } }).session(
      session
    );

    // Validasi jika ada barang yang tidak ditemukan
    if (barangList.length !== barangIds.length) {
      throw new Error("One or more items not found");
    }

    // Validasi stok barang
    const insufficientStock = detail_transaksi.some((item) => {
      const barang = barangList.find(
        (barang) => barang._id.toString() === item.id_barang
      );
      return !barang || barang.stok < item.qty;
    });

    if (insufficientStock) {
      throw new Error("Insufficient stock");
    }

    // Update stok barang
    for (const item of detail_transaksi) {
      const barang = barangList.find(
        (barang) => barang._id.toString() === item.id_barang
      );
      barang.stok -= item.qty;
      await barang.save({ session });
    }

    // Tambahkan detail transaksi dengan informasi barang
    const enrichedDetailTransaksi = detail_transaksi.map((item) => {
      const barang = barangList.find(
        (barang) => barang._id.toString() === item.id_barang
      );
      return {
        id_barang: item.id_barang,
        nama_barang: barang.nama_barang,
        qty: item.qty,
        harga: barang.harga,
      };
    });

    // Buat transaksi
    const transaksi = new Transaksi({
      id_user,
      nama_pemesan,
      detail_transaksi: enrichedDetailTransaksi,
    });

    await transaksi.save({ session }); // Simpan transaksi dengan session
    await session.commitTransaction(); // Komit transaksi

    res
      .status(201)
      .json({ message: "Transaksi created successfully", transaksi });
  } catch (error) {
    await session.abortTransaction(); // Batalkan transaksi jika ada kesalahan
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.find()
      .populate("id_user", "username email")
      .populate("detail_trnasaksi.id_barang", "nama_barang harga");
    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transaksi", error });
  }
};
export const getTransaksiById = async (req, res) => {
  try {
    const transaksi = await Transaksi.findById(req.params.id)
      .populate("id_user", "username email")
      .populate("detail_transaksi.id_barang", "nama_barang harga");

    if (!transaksi) {
      return res.status(404).json({ message: "Transaksi not found" });
    }

    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transaksi", error });
  }
};

export const updateTransaksi = async (req, res) => {
  const { nama_pemesan, detail_transaksi } = req.body;
  const session = await mongoose.startSession(); // Mulai sesi transaksi
  session.startTransaction(); // Memulai transaksi

  try {
    const transaksi = await Transaksi.findById(req.params.id).session(session);
    if (!transaksi) {
      throw new Error("Transaksi not found");
    }

    // Kembalikan stok barang lama
    const oldBarangIds = transaksi.detail_transaksi.map(
      (item) => item.id_barang
    );
    const oldBarangList = await Barang.find({
      _id: { $in: oldBarangIds },
    }).session(session);

    transaksi.detail_transaksi.forEach((item) => {
      const barang = oldBarangList.find(
        (b) => b._id.toString() === item.id_barang
      );
      if (barang) {
        barang.stok += item.qty;
        barang.save({ session });
      }
    });

    // Validasi dan ambil barang baru
    const newBarangIds = detail_transaksi.map((item) => item.id_barang);
    const newBarangList = await Barang.find({
      _id: { $in: newBarangIds },
    }).session(session);

    if (newBarangList.length !== newBarangIds.length) {
      throw new Error("One or more new items not found");
    }

    // Validasi stok barang baru
    const insufficientStock = detail_transaksi.some((item) => {
      const barang = newBarangList.find(
        (barang) => barang._id.toString() === item.id_barang
      );
      return !barang || barang.stok < item.qty;
    });

    if (insufficientStock) {
      throw new Error("Insufficient stock for new items");
    }

    // Perbarui stok barang baru
    detail_transaksi.forEach((item) => {
      const barang = newBarangList.find(
        (barang) => barang._id.toString() === item.id_barang
      );
      if (barang) {
        barang.stok -= item.qty;
        barang.save({ session });
      }
    });

    // Perbarui transaksi
    transaksi.nama_pemesan = nama_pemesan;
    transaksi.detail_transaksi = detail_transaksi.map((item) => {
      const barang = newBarangList.find(
        (barang) => barang._id.toString() === item.id_barang
      );
      return {
        id_barang: item.id_barang,
        nama_barang: barang.nama_barang,
        qty: item.qty,
        harga: barang.harga,
      };
    });

    await transaksi.save({ session }); // Simpan transaksi dengan data baru
    await session.commitTransaction(); // Komit transaksi

    res
      .status(200)
      .json({ message: "Transaksi updated successfully", transaksi });
  } catch (error) {
    await session.abortTransaction(); // Batalkan transaksi jika ada kesalahan
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession(); // Akhiri sesi
  }
};

export const deleteTransaksi = async (req, res) => {
  const session = await mongoose.startSession(); // Mulai sesi transaksi
  session.startTransaction(); // Memulai transaksi

  try {
    const transaksi = await Transaksi.findById(req.params.id).session(session);

    if (!transaksi) {
      throw new Error("Transaksi not found");
    }

    // Kembalikan stok barang
    const barangIds = transaksi.detail_transaksi.map((item) => item.id_barang);
    const barangList = await Barang.find({ _id: { $in: barangIds } }).session(
      session
    );

    transaksi.detail_transaksi.forEach((item) => {
      const barang = barangList.find(
        (b) => b._id.toString() === item.id_barang
      );
      if (barang) {
        barang.stok += item.qty;
        barang.save({ session });
      }
    });

    // Hapus transaksi
    await Transaksi.findByIdAndDelete(req.params.id).session(session);

    await session.commitTransaction(); // Komit transaksi
    res.json({ message: "Transaksi deleted successfully" });
  } catch (error) {
    await session.abortTransaction(); // Batalkan transaksi jika ada kesalahan
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession(); // Akhiri sesi
  }
};

