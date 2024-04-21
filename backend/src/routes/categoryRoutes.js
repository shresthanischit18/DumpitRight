import express from "express"
import { createCategory, deleteCategory, getAllCategory, getaCategory, updateCategory } from "../controllers/categoryController.js";



const categoryRouter = express.Router();

categoryRouter.route("/").get(getAllCategory).post(createCategory)

categoryRouter.route("/:id").get(getaCategory).put(updateCategory).delete(deleteCategory)






export default categoryRouter;