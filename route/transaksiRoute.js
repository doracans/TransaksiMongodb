import express from "express";
import {createTransaksi,getAllTransaksi,getTransaksiById,deleteTransaksi, updateTransaksi} from "../controllers/transaksiController.js";
import { authenticate, authorize } from "../middelware/authMiddelware.js";

const router = express.Router();

router.post("/", authenticate, authorize(["CREATE_USER"]), createTransaksi);
router.get("/", getAllTransaksi);
router.get("/:id",  getTransaksiById);
router.put("/;id", updateTransaksi)
router.delete("/:id",deleteTransaksi);

export default router;
