import express from "express";

import { createProduct, deleteProduct, updateProduct ,getProducts} from "../controllers/product.controller.js";


const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);


export default router;