import productModel from "../models/productModel.js";


export const createProductController = async (req, res) => {
    try {
        const products = await new productModel({ ...req.body }).save();
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

