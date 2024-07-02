import { Request, Response } from "express";

// models
import { Log } from "../../models/log";

const allLogs = async (req: Request, res: Response) => {
  try {
    const data = await Log.find().sort("-createdAt").exec();
    return res.status(201).json({ success: true, message: data || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export { allLogs };
