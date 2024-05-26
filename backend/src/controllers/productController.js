import { asyncErrorHandler } from "../helpers/index.js";
import { Product } from "../schemaModels/model.js";

export const createProduct = asyncErrorHandler(async (req, res) => {
    const { title, description, point, quantity, category } = req.body;

    // Extract filenames from uploaded images
    const images = req.files.map((file) => file.filename);
    try {
        // Create a new product using data from request body and uploaded images
        const product = await Product.create({
            title,
            description,
            point,
            quantity,
            category,
            images,
        });

        // Send success response
        res.status(201).json({
            data: product,
            message: "Product Successfully Added",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create product." });
    }
});

export const updateProduct = asyncErrorHandler(async (req, res) => {
    try {
        // Extract product ID from request parameters
        const { productID: id } = req.params;

        // Find the product by ID
        let product = await Product.findById(id);

        // Check if the product exists
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Extract updated data from request body
        const { title, description, point, quantity, category, images } =
            req.body;

        // Update the product properties with the new data
        product.title = title || product.title;
        product.description = description || product.description;
        product.point = point || product.point;
        product.quantity = quantity || product.quantity;
        product.category = category || product.category;
        product.images = images || product.images;

        // Save the updated product
        product = await product.save();

        // Send the updated product as a response
        res.status(200).json({
            data: product,
            message: "Product successfully updated",
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update product." });
    }
});

export const deleteProduct = asyncErrorHandler(async (req, res) => {
    try {
        const productID = req.params.productID;

        const deletedProduct = await Product.findByIdAndDelete(productID);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({
            data: deletedProduct,
            message: "Product Deleted Successfully",
        });
    } catch (error) {
        throw new Error(error);
    }
});

export const getProductByID = asyncErrorHandler(async (req, res) => {
    try {
        const { productID } = req.params;
        const findProduct = await Product.findById(productID);
        if (!findProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ data: [findProduct] });
    } catch (error) {
        throw new Error(error);
    }
});

export const getAllProduct = asyncErrorHandler(async (req, res) => {
    try {
        // Retrieve all products from the database
        const products = await Product.find();

        // Send the products as a response
        res.status(200).json({ data: products });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: "Failed to fetch products." });
    }
});

export const rating = asyncErrorHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId } = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() == _id.String()
        );
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated },
                },
                {
                    set: { "ratings.$.star": star },
                },
                {
                    new: true,
                }
            );
            res.json(updateRating);
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            postedby: _id,
                        },
                    },
                },
                {
                    new: true,
                }
            );
        }
    } catch (error) {
        throw new Error(error);
    }
});
