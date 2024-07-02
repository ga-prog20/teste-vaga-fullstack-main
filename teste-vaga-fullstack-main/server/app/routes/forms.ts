import { Router } from "express";
import multer from "multer";

// controllers
import {
  allDocsOfForm,
  uploadTmpFileForForm,
  deleteTmpFileOfForm,
  startImportInForm,
} from "../controllers/forms/docs";

export const forms = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    console.log("arquivo", file, req.query.fileUid);
    const fileName = req.query.fileUid + ".csv";
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

forms.get("/docs", allDocsOfForm);
forms.post("/docs/import", upload.single("file"), uploadTmpFileForForm);
forms.delete("/docs/file/delete", deleteTmpFileOfForm);
forms.get("/queue/start", startImportInForm);
