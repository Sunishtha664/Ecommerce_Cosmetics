import productModel from "../models/productModel.js";
import fs from 'fs';
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";


export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, brand, price, category, subcategory, quantity, shipping } = req.fields;
        const { photo } = req.files;

        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" });
            case !description:
                return res.status(500).send({ error: "Description is required" });
            case !brand:
                return res.status(500).send({ error: "Brand is required" });
            case price === undefined || price === null || price === '':
                return res.status(500).send({ error: "Price is required" });
            case !category:
                return res.status(500).send({ error: "Category is required" });
            case quantity === undefined || quantity === null || quantity === '':
                return res.status(500).send({ error: "Quantity is required" });
            case shipping === undefined || shipping === null || shipping === '':
                return res.status(500).send({ error: "Shipping is required" });
            case !photo:
                return res.status(500).send({ error: "Photo is required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "Photo is required and should be less than 1mb in size" });
        }

        const products = new productModel({
            name,
            slug: slugify(name),
            description,
            brand,
            price: Number(price),
            category,
            subcategory,
            quantity: Number(quantity),
            shipping: shipping === '1' || shipping === 1 || shipping === true,
        });

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();

        res.status(201).send({
            success: true,
            message: "New product created",
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating product",
            error
        })
    }
}
//get all products
export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate("category").populate("subcategory").select("-photo").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            totalCount: products.length,
            message: "All products",
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting products",
            error
        })
    }
}

//get single product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category").populate("subcategory");
        res.status(200).send({
            success: true,
            message: "Single product",
            product,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting single product",
            error
        })
    }
}

//get photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting product photo",
            error
        })
    }
}

//delete product
export const deleteProductController = async (req, res) => {
    try {

        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Product deleted successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in deleting product",
            error
        })
    }
};

//update product
export const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, brand, price, category, subcategory, quantity, shipping } = req.fields;
        const { photo } = req.files;

        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" });
            case !description:
                return res.status(500).send({ error: "Description is required" });
            case !brand:
                return res.status(500).send({ error: "Brand is required" });
            case price === undefined || price === null || price === '':
                return res.status(500).send({ error: "Price is required" });
            case !category:
                return res.status(500).send({ error: "Category is required" });
            case quantity === undefined || quantity === null || quantity === '':
                return res.status(500).send({ error: "Quantity is required" });
            case shipping === undefined || shipping === null || shipping === '':
                return res.status(500).send({ error: "Shipping is required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "Photo should be less than 1mb in size" });
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid, {
            name,
            slug: slugify(name),
            description,
            brand,
            price: Number(price),
            category,
            subcategory,
            quantity: Number(quantity),
            shipping: shipping === '1' || shipping === 1 || shipping === true,
        }, { new: true })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();

        res.status(201).send({
            success: true,
            message: "Product updated successfully",
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in updating product",
            error
        })
    }

}
//filter
export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};

        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            message: "Products filtered successfully",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in filtering products",
            error
        })
    }
}

//product count
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            message: "Total products count",
            total
        })
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in counting products",
            error
        })
    }
}


//product per page
export const productListController = async (req, res) => {
    try {
        const perPage = 3;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "Products per page",
            products
        })
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in getting products per page",
            error
        })
    }
}

//search product
export const searchProductController = async (req, res) => {
    try {
        const keyword = (req.params.keyword || '').trim();

        if (!keyword) {
            return res.status(400).send({
                success: false,
                message: "Keyword is required",
                results: []
            });
        }

        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const results = await productModel.find({
            $or: [
                { name: { $regex: escapedKeyword, $options: "i" } },
                { description: { $regex: escapedKeyword, $options: "i" } },
            ]
        }).select("-photo");
        res.status(200).send({
            success: true,
            message: "Search results",
            results
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in searching products",
            error
        })
    }
}

//similar product
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(3).populate("category").populate("subcategory");
        res.status(200).send({
            success: true,
            message: "Related products",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in getting related products",
            error
        })
    }
}

//get products based on category
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found"
            });
        }
        const products = await productModel.find({ category: category._id }).populate("category").populate("subcategory").select("-photo");
        res.status(200).send({
            success: true,
            message: "Products based on category",
            category,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in getting products based on category",
            error
        })
    }
}