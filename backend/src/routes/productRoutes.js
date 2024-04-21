import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProduct,
    getProductByID,
    updateProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/fileUpload.js";

const productRouter = express.Router();

productRouter
    .route("/")
    .get(getAllProduct)
    .post(upload.array("images"), createProduct);

productRouter
    .route("/:productID")
    .get(getProductByID)
    .patch(updateProduct)
    .delete(deleteProduct);

export default productRouter;
