// POST /blogs

import mongoose from "mongoose";
import { HttpStatus } from "../constant/constants.js";
import {
    asyncErrorHandler,
    sendSuccessResponse,
    throwError,
} from "../helpers/index.js";
import { Blog } from "../schemaModels/model.js";

// POST /blogs/
export const addBlog = asyncErrorHandler(async (req, res) => {
    const blogDetails = req.body.blogDetails;
    const coverImg = req?.file?.filename;

    if (!blogDetails || !coverImg) {
        throwError({
            message: "Please provide all the details",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const _blogDetails = JSON.parse(blogDetails);

    if (!mongoose.isValidObjectId(_blogDetails.userID)) {
        throwError({
            message: "Invalid user ID",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const blog = new Blog({
        ..._blogDetails,
        coverImg,
        user: _blogDetails.userID,
    });

    await blog.save();

    sendSuccessResponse({
        res,
        data: blog,
        message: "Blog is published successfully",
    });
});

// GET /blogs/user/:userId
export const getBlogsByUser = asyncErrorHandler(async (req, res) => {
    const userID = req.params.userID;

    if (!mongoose.isValidObjectId(userID)) {
        throwError({
            message: "Invalid user ID",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const blogs = await Blog.find({ user: userID })
        .sort({ createdAt: -1 })
        .populate({
            path: "user",
        });

    sendSuccessResponse({
        res,
        data: blogs,
        message: "All blogs details are fetched successfully",
    });
});

// DELETE /blogs/:blogID
export const deleteBlog = asyncErrorHandler(async (req, res) => {
    const blogID = req.params.blogID;

    if (!mongoose.isValidObjectId(blogID)) {
        throwError({
            message: "Invalid blog ID",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }
    await Blog.findByIdAndDelete(blogID);

    sendSuccessResponse({
        res,
        message: "Blog is deleted successfully",
    });
});

// GET /blogs/:blogID
export const getBlogByID = asyncErrorHandler(async (req, res) => {
    const blogID = req.params.blogID;

    if (!mongoose.isValidObjectId(blogID)) {
        throwError({
            message: "Invalid blog ID",
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }

    const blog = await Blog.findById(blogID).populate({
        path: "user",
    });

    if (!blog) {
        throwError({
            message: "Blog not found",
            statusCode: HttpStatus.NOT_FOUND,
        });
    }

    sendSuccessResponse({
        res,
        data: blog,
        message: "Blog details are fetched successfully",
    });
});

// GET /blogs
export const getAllBlogs = asyncErrorHandler(async (req, res) => {
    let blogs = await Blog.find()
        .populate({
            path: "user",
        })
        .sort({ createdAt: -1 });

    blogs = blogs.filter(({ user }) => user);

    sendSuccessResponse({
        res,
        data: blogs,
        message: "All blogs details are fetched successfully",
    });
});
