import { Request, Response } from "express";

// models
import { Dossier, DossierInput } from "../../models/dossier";
import { Log, LogInput } from "../../models/log";

const createDossier = async (req: Request, res: Response) => {
  try {
    const { slug } = req.body;
    const browser = req.useragent?.browser || "Unknown";

    if (!slug) {
      return res.status(422).json({
        success: false,
        message: "O campo slug é obrigatório.",
      });
    }

    const dossierData: DossierInput = {
      slug,
      files: []
    };
    Dossier.create(dossierData);

    // create a new log
    const logData: LogInput = {
      browser,
      message: `adicionou um novo dossiê: ${slug}`,
    };
    Log.create(logData);

    return res.status(201).json({ success: true, message: "Dossiê adicionado com sucesso." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export { createDossier };
