import express from "express"
import {register , login} from "../controllers/authController.js"
import multer from "multer"
const router = express.Router();
const upload = multer({
  dest: "uploads/",
});

router.post( "/register",upload.single("profileImage"),register);

router.post("/login", login);



export default router