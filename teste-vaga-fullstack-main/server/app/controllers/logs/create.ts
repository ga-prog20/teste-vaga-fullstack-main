import { Request, Response } from "express";

// models
import { Log, LogInput } from "../../models/log";

const createLog = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const browser = req.useragent?.browser || "Unknown";

    if (!message) {
      return res.status(422).json({
        success: false,
        message: "O campo message é obrigatório",
      });
    }

    const logData: LogInput = {
      browser,
      message,
    };
    const logCreated = Log.create(logData);

    return res.status(201).json({ success: true, message: logCreated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export { createLog };
