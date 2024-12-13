import Barang from "../model/barangModel.js";


// Create Barang
export const createBarang = async (req, res) => {
  const { nama_barang, stok, harga } = req.body;
  try {
    const barang = new Barang({ nama_barang, stok, harga });
    await barang.save();
    res.status(201).json({ message: "Barang created successfully", barang });
  } catch (error) {
    res.status(500).json({ message: "Error creating barang", error });
  }
};

// Get All Barang
export const getAllBarang = async (req, res) => {
  try {
    const barang = await Barang.find();
    res.json(barang);
  } catch (error) {
    res.status(500).json({ message: "Error fetching barang", error });
  }
};

// Get Barang by ID
export const getBarangById = async (req, res) => {
  try {
    const barang = await Barang.findById(req.params.id);
    if (!barang) return res.status(404).json({ message: "Barang not found" });
    res.json(barang);
  } catch (error) {
    res.status(500).json({ message: "Error fetching barang", error });
  }
};

// Update Barang
export const updateBarang = async (req, res) => {
  const { nama_barang, stok, harga } = req.body;
  try {
    const barang = await Barang.findById(req.params.id);
    if (!barang) return res.status(404).json({ message: "Barang not found" });

    barang.nama_barang = nama_barang || barang.nama_barang;
    barang.stok = stok || barang.stok;
    barang.harga = harga || barang.harga;

    await barang.save();
    res.json({ message: "Barang updated successfully", barang });
  } catch (error) {
    res.status(500).json({ message: "Error updating barang", error });
  }
};

// Delete Barang
export const deleteBarang = async (req, res) => {
  try {
    await Barang.findByIdAndDelete(req.params.id);
    res.json({ message: "Barang deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting barang", error });
  }
};
