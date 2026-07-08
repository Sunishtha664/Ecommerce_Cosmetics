import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

// REGISTER
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;

        // validation
        if (!name) return res.send({ success: false, message: "Name is Required" });
        if (!email) return res.send({ success: false, message: "Email is Required" });
        if (!password) return res.send({ success: false, message: "Password is Required" });
        if (!phone) return res.send({ success: false, message: "Phone is Required" });
        if (!address) return res.send({ success: false, message: "Address is Required" });
        if (!answer) return res.send({ success: false, message: "Answer is Required" });

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
            answer,
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
                _id: user._id,
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

//forgot password controller
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: "Email is required" });
        }
        if (!answer) {
            res.status(400).send({ message: "Answer is required" });
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" });
        }
        //check email and answer
        const user = await userModel.findOne({ email, answer });

        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email Or Answer",
            });
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Forgot Password",
            error,
        });

    }
};
// UPDATE USER PROFILE
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const userId = req.user._id;

        // Validation
        if (!name || !email || !phone || !address) {
            return res.status(400).send({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if email is already taken by another user
        const existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "Email already in use",
            });
        }

        // Update user
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { name, email, phone, address },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating profile",
            error,
        });
    }
};

export const testController = (req, res) => {
    try {
        res.send("Protected Route");
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Test Controller",
            error,
        });
    }
};