import sectionModel from '../models/sectionModel.js';
import slugify from 'slugify';

export const createSectionController = async (req, res) => {
    try {
        const { name, parentSubcategory } = req.body;

        if (!name) {
            return res.status(400).send({
                success: false,
                message: 'Name is required'
            });
        }

        if (!parentSubcategory) {
            return res.status(400).send({
                success: false,
                message: 'Parent subcategory is required'
            });
        }

        const existingSection = await sectionModel.findOne({ name });
        if (existingSection) {
            return res.status(200).send({
                success: true,
                message: 'Section already exists'
            });
        }

        const section = await new sectionModel({
            name,
            slug: slugify(name),
            parentSubcategory
        }).save();

        res.status(201).send({
            success: true,
            message: 'New section created',
            section
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in creating section',
            error
        });
    }
};

export const updateSectionController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, parentSubcategory } = req.body;

        if (!name) {
            return res.status(400).send({
                success: false,
                message: 'Name is required'
            });
        }

        if (!parentSubcategory) {
            return res.status(400).send({
                success: false,
                message: 'Parent subcategory is required'
            });
        }

        const section = await sectionModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name), parentSubcategory },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: 'Section updated successfully',
            section
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in updating section',
            error
        });
    }
};

export const sectionController = async (req, res) => {
    try {
        const section = await sectionModel.find({}).populate({ path: 'parentSubcategory', populate: 'parentCategory' });
        res.status(200).send({
            success: true,
            message: 'All section list',
            section
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting section',
            error
        });
    }
};

export const getSectionsBySubcategoryController = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const sections = await sectionModel.find({ parentSubcategory: subcategoryId });
        res.status(200).send({
            success: true,
            message: 'Sections fetched successfully',
            sections
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting sections',
            error
        });
    }
};

export const singleSectionController = async (req, res) => {
    try {
        const section = await sectionModel.findOne({ slug: req.params.slug }).populate({ path: 'parentSubcategory', populate: 'parentCategory' });
        res.status(200).send({
            success: true,
            message: 'Get single section successfully',
            section
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting single section',
            error
        });
    }
};

export const deleteSectionController = async (req, res) => {
    try {
        const { id } = req.params;
        await sectionModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: 'Section deleted successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in deleting section',
            error
        });
    }
};