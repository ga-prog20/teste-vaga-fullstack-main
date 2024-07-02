import { Request, Response } from "express";
import mongoose from "mongoose";

// models
import { Dossier } from "../../models/dossier";

const deleteDossier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { slug } = req.query;

    if (!id || !slug) {
      return res.status(422).json({
        success: false,
        message: "O campo id e slug é obrigatório",
      });
    }

    // try delete dossier
    await Dossier.findByIdAndDelete(id);

    return res
      .status(201)
      .json({ success: true, message: "Dossiê excluído com sucesso." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export { deleteDossier };
