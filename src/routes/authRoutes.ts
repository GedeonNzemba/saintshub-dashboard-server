// src/routes/authRoutes.ts
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/User";
import authMiddleware from "../middlewares/authMiddleware";
import userController from "../controllers/userController";
import uuid from "react-native-uuid";
import fileControllers from "../controllers/fileControllers";
import formidable from "formidable";
import path from "path";
import fileParser from "../middlewares/fileParser";
import cloudinary from "../utils/cloudinary";

interface MulterRequest extends Request {
  file: any;
}

const router = express.Router();

const JWT_SECRET = "8b4061ff56160f352be1233f6138b39824a026de71dc75cfd347e7f9b33450be9a9f0d7d865ab903177879ae8629e7458d7a405195149a0c0b5f22a95d0852d1";

// router.post("/create-note", (req, res) => {
//   res.send("<h1>Welcome to file upload</h1>");
// });

// ******************************************** FILE UPLOADER ************************************************

router.post("/upload-file", async (req, res) => {
  const form = formidable({
    uploadDir: path.join(__dirname, "public"),
    filename(name, ext, part) {
      const uniqueFileName = Date.now() + "_" + (part.originalFilename || name + ".jpg");
      return uniqueFileName;
    },
  });

  await form.parse(req);
  res.json({ ok: true });
});

router.post("/upload-file-to-cloud", fileParser, async (req, res) => {
  const { files } = req;
  const myFile = files?.profileImage;

  if (Array.isArray(myFile)) {
    // Multiple files upload
  } else {
    if (myFile) {
      const cloudRes = await cloudinary.uploader.upload(myFile.filepath);
      res.json({ ...cloudRes });
    }
  }
});

// ******************************************** FILE UPLOADER ENDS ************************************************

// SIGN UP
router.post("/signup", async (req, res) => {
  try {
    const { name, surname, email, password, confirmPassword, avatar } = req.body;

    if (!name || !surname || !email || !password || !confirmPassword || !avatar) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser: UserDocument = new User({
      name,
      surname,
      email,
      password: hashedPassword,
      avatar: {
        public_id: uuid.v4(),
        url: avatar,
      },
    });

    await newUser.save();

    // Create and sign a JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Server error." });
  }
});

// SIGN IN
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password credentials." });
    } else {
      console.log("USER: ", user);
    }

    // Create and sign a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the JWT token as a cookie
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// SIGN OUT
router.post("/signout", (req, res) => {
  res.clearCookie("token"); // Clear the JWT token cookie
  res.status(200).json({ message: "Sign-out successful." });
});

router.get("/user", authMiddleware, userController.getUser);
router.get('/user/logout', authMiddleware, userController.logoutUser); // New route for logout

router.put("/user/update-user", authMiddleware, userController.updateUser);
router.put("/user/update-avatar", authMiddleware, userController.updateUserImage);
router.put("/user/update-password", authMiddleware, userController.updatePassword);



router.get("/documents", authMiddleware, fileControllers.getDocuments);

export default router;
