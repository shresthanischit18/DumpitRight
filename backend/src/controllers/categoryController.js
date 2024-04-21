import { Category } from '../schemaModels/model.js'
import { asyncErrorHandler } from "../helpers/index.js";

export const createCategory = asyncErrorHandler(async (req, res) => {

  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});
export const updateCategory = asyncErrorHandler(async (req, res) => {

  const { id } = req.params;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
});
export const deleteCategory = asyncErrorHandler(async (req, res) => {

  const { id } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
});
export const getaCategory = asyncErrorHandler(async (req, res) => {

  const { id } = req.params;
  try {
    const getaCategory = await Category.findById(id);
    res.json(getaCategory);
  } catch (error) {
    throw new Error(error);
  }
});
export const getAllCategory = asyncErrorHandler(async (req, res) => {

  try {
    const getallCategory = await Category.find();
    res.json(getallCategory);
  } catch (error) {
    throw new Error(error);
  }
});
