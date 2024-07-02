import { Request, Response } from "express";

// models
import { Import, ImportInput } from "../../../models/form/imports";

const createImportLog = async (req: Request, res: Response) => {
  try {
    const { madeBy, type, saveds, warnings, total, elapsedTime } =
      req.body;

    if (
      madeBy === null ||
      type === null ||
      saveds === null ||
      warnings === null ||
      total === null ||
      elapsedTime === null
    ) {
      return res.status(422).json({
        success: false,
        message: "O campo madeBy, type e elapsedTime é obrigatório",
      });
    }

    const importLog: ImportInput = {
      madeBy: madeBy,
      type: type,
      saveds: saveds,
      warnings: warnings,
      total: total,
      elapsedTime: elapsedTime,
    };
    const importCreated = Import.create(importLog);

    return res.status(201).json({ success: true, message: importCreated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export { createImportLog };
