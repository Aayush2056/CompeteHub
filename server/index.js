import  express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectdb from "./src/db/connectDb.js";
import authRoutes from "./src/routes/authRoutes.js"
import competeRoutes from "./src/routes/competitionRoutes.js"
import submissionRoutes from "./src/routes/submissionRoutes.js"
const app = express();
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use("/api/auth", authRoutes);
app.use("/api/competitions", competeRoutes);
app.use("/api/submissions", submissionRoutes);
app.listen(PORT,async()=>{
    await connectdb()
    console.log(`server is running on port ${PORT}`);
})
