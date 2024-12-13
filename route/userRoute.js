import express from "express";
import { createUserWithRoleAndPermissions, loginUser} from "../controllers/userController.js";
import { authenticate, authorize } from "../middelware/authMiddelware.js";

const router = express.Router();

router.post("/register", createUserWithRoleAndPermissions);
router.post("/login", loginUser);
// router.get("/", authenticate, authorize(["view_users"]), getAllUsers);

export default router;
