import JWT from "jsonwebtoken";

//Protect Routes token based
export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Invalid Token",
        })
    }
}
