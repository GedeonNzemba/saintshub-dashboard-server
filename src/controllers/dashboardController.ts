import { Request, Response } from "express";
import User, { UserDocument } from "../models/User";
import mongoose from "mongoose";
import { logoutMiddleware } from "../middlewares/authMiddleware";
import bcrypt from "bcrypt";
import { ChurchModel } from "../models/Space";

interface AuthRequest extends Request {
    userId?: string;
    body: {
      name: string;
      surname: string;
      email: string;
      password: string;
      confirmPassword: string;
      avatar: string;
      // Add other properties as needed
    };
  }

const getAllChurch = async (req: Request, res: Response) => {
    try {
        const churches = await ChurchModel.find();
        res.json(churches);
    } catch (error) {
        res.status(500).json({ error: 'ERROR GETTING ALL CHURCHES' });
    }
};

const getChurch = async (req: AuthRequest, res: Response) => {
    try {
      const user = await User.findById(new mongoose.Types.ObjectId(req.userId));
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
};
  
export default {getAllChurch, getChurch};