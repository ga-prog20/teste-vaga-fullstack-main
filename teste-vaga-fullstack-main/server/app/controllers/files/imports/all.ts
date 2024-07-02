import { Request, Response } from "express";

// models
import { Import } from "../../../models/form/imports";

const allImportsLog = async (req: Request, res: Response) => {
  try {
    const data = await Import.find().sort("-createdAt").exec();
    return res.status(201).json({ success: true, message: data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export { allImportsLog };