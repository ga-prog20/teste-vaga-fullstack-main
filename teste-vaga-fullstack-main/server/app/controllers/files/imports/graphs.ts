import { Request, Response } from "express";

// models
import { Import } from "../../../models/form/imports";

const polarChartLogImports = async (req: Request, res: Response) => {
  try {
    const q = await Import.aggregate([
      {
        $group: {
          _id: null,
          saved: { $sum: '$saveds' },
          warning: { $sum: '$warnings' },
          total: { $sum: '$total' }
        },
      },
    ]).exec();
    return res.status(201).json({
      success: true,
      message: {
        saveds: q[0].saved || 0,
        warnings: q[0].warning || 0,
        total: q[0].total || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: {
        saveds: 0,
        warnings: 0,
        total: 0,
      },
    });
  }
};

export { polarChartLogImports };
