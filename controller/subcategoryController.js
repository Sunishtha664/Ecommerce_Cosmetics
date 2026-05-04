import subcategoryModel from "../models/subcategoryModel.js";
import slugify from "slugify";


export const createSubcategoryController = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;
        if (!name) {
            return res.status(401).send({
                success: false,
                message: "Name is required"
            })
        }
        const existingSubcategory = await subcategoryModel.findOne({ name });
        if (existingSubcategory) {
            return res.status(200).send({
                success: true,
                message: "Subcategory already exists"
            })
        }
        const subcategory = await new subcategoryModel({ name, slug: slugify(name), parentCategory }).save();
        res.status(201).send({
            success: true,
            message: "New subcategory created",
            subcategory
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating subcategory",
            error
        })
    }
};

//update subcategory
export const updateSubcategoryController = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;
        const { id } = req.params;
        const subcategory = await subcategoryModel.findByIdAndUpdate(id, { name, slug: slugify(name), parentCategory }, { new: true });
        res.status(200).send({
            success: true,
            message: "Subcategory updated successfully",
            subcategory
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in updating subcategory",
            error
        })
    }
};

//get all subcategory
export const subcategoryController = async (req, res) => {
    try {
        const subcategory = await subcategoryModel.find({}).populate("parentCategory");
        res.status(200).send({
            success: true,
            message: "All subcategory list",
            subcategory
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting subcategory",
            error
        })
    }
}

//single subcategory
export const singleSubcategoryController = async (req, res) => {
    try {

        const subcategory = await subcategoryModel.findOne({ slug: req.params.slug }).populate("parentCategory");
        res.status(200).send({
            success: true,
            message: "Get single subcategory successfully",
            subcategory
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting single subcategory",
            error
        })
    }
}

//delete subcategory
export const deleteSubcategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await subcategoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Subcategory deleted successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in deleting subcategory",
            error
        })
    }
}