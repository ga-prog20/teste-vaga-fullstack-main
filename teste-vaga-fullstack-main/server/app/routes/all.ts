import { Router } from "express";

// routes
import { logs } from "./logs";
import { dossiers } from "./dossiers";
import { forms } from "./forms";
import { imports } from "./imports";

export const routes = Router();

routes.use("/logs", logs);
routes.use("/dossiers", dossiers);
routes.use("/forms", forms);
routes.use("/imports", imports);
