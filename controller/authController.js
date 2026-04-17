import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

// REGISTER
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // validation
        if (!name) return res.send({ success: false, message: "Name is Required" });
        if (!email) return res.send({ success: false, message: "Email is Required" });
        if (!password) return res.send({ success: false, message: "Password is Required" });
        if (!phone) return res.send({ success: false, message: "Phone is Required" });
        if (!address) return res.send({ success: false, message: "Address is Required" });

        // check existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Registered, Please Login",
            });
        }

        // hash password
        const hashedPassword = await hashPassword(password);

        // save user
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
        }).save();

        res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error,
        });
    }
};

// LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email not registered",
            });
        }

        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }

        const token = JWT.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error,
        });
    }
};
export const testController = (req, res) => {
    res.send("Protected Routes");
};