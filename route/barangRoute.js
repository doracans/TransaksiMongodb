import express from "express";
import { createBarang, getAllBarang, getBarangById, updateBarang, deleteBarang } from "../controllers/barangControllr.js";
import { authenticate,authorize } from "../middelware/authMiddelware.js";

const router = express.Router();

router.post("/", createBarang);
router.get("/", getAllBarang);
router.get("/:id",  getBarangById);
router.put("/:id",updateBarang);
router.delete("/:id",  deleteBarang);

export default router;
