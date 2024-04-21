import { Router } from "express";
import {
    addBlog,
    deleteBlog,
    getAllBlogs,
    getBlogByID,
    getBlogsByUser,
} from "../controllers/blogController.js";
import upload from "../middlewares/fileUpload.js";

export const blogRouter = Router();

blogRouter.route("/").post(upload.single("coverImg"), addBlog).get(getAllBlogs);

blogRouter.route("/:blogID").get(getBlogByID).delete(deleteBlog);

blogRouter.route("/user/:userID").get(getBlogsByUser);

export default blogRouter;
