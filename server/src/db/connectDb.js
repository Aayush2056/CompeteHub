import mongoose from "mongoose";
async function connectdb(params) {
    try {
        mongoose.connect(`${process.env.MONGO_DB_URL}`)
        console.log("mongo connected successfully");
    } catch (error) {
        console.log(error);
    }
}
export default connectdb