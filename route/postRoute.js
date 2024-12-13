import express from "express";
import { tambahData, tampilData, detailPost,updatePost,delPost } from "../controllers/postController.js";

const router = express.Router()

router.post('/post', tambahData)
router.get('/post', tampilData)
router.get('/post/:id', detailPost)
router.put("/post/:id", updatePost);
router.delete("/post/:id", delPost);



export default router