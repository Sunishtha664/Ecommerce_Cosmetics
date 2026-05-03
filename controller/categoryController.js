import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";


export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({
                success: false,
                message: "Name is required"
            })
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "Category already exists"
            })
        }
        const category = await new categoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({
            success: true,
            message: "New category created",
            category
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating category",
            error
        })
    }
};

//update category
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
        res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in updating category",
            error
        })
    }
};