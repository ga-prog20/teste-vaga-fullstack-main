import { Request, Response } from "express";

// models
import { Dossier } from "../../models/dossier";

const allDossiers = async (req: Request, res: Response) => {
  try {
    const { getTheLastThree } = req.query;

    if (
      getTheLastThree === null ||
      getTheLastThree === undefined ||
      getTheLastThree === ""
    ) {
      return res.status(422).json({
        success: false,
        message: "Query getTheLastThree é obrigatória",
      });
    }

    // verify is need last results
    if (getTheLastThree === "true") {
      const dataLimited =
        (await Dossier.find().sort("-createdAt").limit(3).exec()) || [];
      return res.status(201).json({
        success: true,
        message: dataLimited,
      });
    }

    if (getTheLastThree === "false") {
      const data = (await Dossier.find().sort("-createdAt").exec()) || [];
      return res.status(201).json({
        success: true,
        message: data,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export { allDossiers };
