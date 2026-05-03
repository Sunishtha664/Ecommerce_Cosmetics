import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";



export const createCategoryController = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(401).send({
                success: false,
                message: "Name and description are required"
            })
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "Category already exists"
            })
        }
        const category = await new categoryModel({ name, description, slug: slugify(name) }).save();
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