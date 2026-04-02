import mangoose from 'mangoose'

const connectDB = async () => {
    try {
        const conn = await mangoose.connect(process.env.MONGO_URL)
        console.log(`Server Connected to MongoDB Database ${conn.connection.host}`.bgGreen.white);

    }
    catch (error) {
        console.log(`Error in mongodb ${error}`.bgRed.white);
    }
}
export default connectDB;