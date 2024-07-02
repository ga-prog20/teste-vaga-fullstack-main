import { Request, Response } from "express";

// models
import { Import } from "../../../models/form/imports";

const basicStatsOfImports = async (req: Request, res: Response) => {
  try {
    const q = await Import.aggregate([
      {
        $group: {
          _id: null,
          avgTime: { $avg: "$elapsedTime" },
          total: { $sum: '$total' }
        },
      },
    ]).exec();
    return res.status(201).json({
      success: true,
      message: {
        avgTime: q[0].avgTime || 0,
        total: q[0].total || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: {
        avgTime: 0,
        total: 0,
      },
    });
  }
};

export { basicStatsOfImports };
