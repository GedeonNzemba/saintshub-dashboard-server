import express, { Request, Response } from "express";
import { ChurchDoc, ChurchModel } from "../models/Space";
import authMiddleware from "../middlewares/authMiddleware";
import dashboardController from "../controllers/dashboardController";

interface AuthRequest extends Request {
  userId?: string;
  body: ChurchDoc;
}

interface ChurchParams {
  id: string;
  field: string;
}

const router = express.Router();

// Create a new church
router.post("/create-church", async (req: AuthRequest, res: Response) => {
  try {
    const churchData = req.body;
    const newChurch = await ChurchModel.create(churchData);
    res.status(201).json(newChurch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a specific field in the church document
router.patch("/churches/:id/:field", async (req, res) => {
  try {
    const { id, field }: ChurchParams = req.params;
    const updateData = { [field]: req.body[field] };
    const updatedChurch = await ChurchModel.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedChurch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/churches", authMiddleware, dashboardController.getAllChurch);


export default router;
