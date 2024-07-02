// models
import { Import, ImportInput } from "../../../models/form/imports";

export function genImportLog(
  madeBy: string,
  type: string,
  saveds: number,
  warnings: number,
  total: number,
  elapsedTime: number
) {
  const importLog: ImportInput = {
    madeBy: madeBy,
    type: type,
    saveds: saveds,
    warnings: warnings,
    total: total,
    elapsedTime: elapsedTime,
  };
  Import.create(importLog);
}
