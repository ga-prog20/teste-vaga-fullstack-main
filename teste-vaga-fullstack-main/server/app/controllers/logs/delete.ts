import { Request, Response } from "express";

// models
import { Log } from "../../models/log";

const deleteLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(422).json({
        success: false,
        message: "O campo id é obrigatório",
      });
    }

    await Log.findByIdAndDelete(id);

    return res
      .status(201)
      .json({ success: true, message: "Log excluído com sucesso." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export { deleteLog };
