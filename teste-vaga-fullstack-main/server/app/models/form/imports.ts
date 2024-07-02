import mongoose, { Schema, Model, Document } from "mongoose";

type ImportDoc = Document & {
  madeBy: string;
  type: string;
  saveds: number;
  warnings: number;
  total: number;
  elapsedTime: number;
};

type ImportInput = {
  madeBy: ImportDoc["madeBy"];
  type: ImportDoc["type"];
  saveds: ImportDoc["saveds"];
  warnings: ImportDoc["warnings"];
  total: ImportDoc["total"];
  elapsedTime: ImportDoc["elapsedTime"];
};

const importSchema = new Schema(
  {
    madeBy: {
      type: Schema.Types.String,
      required: true,
    },
    type: {
      type: Schema.Types.String,
      default: "finished",
    },
    saveds: {
      type: Schema.Types.Number,
      required: true,
      default: 0,
    },
    warnings: {
      type: Schema.Types.Number,
      required: true,
      default: 0,
    },
    total: {
      type: Schema.Types.Number,
      required: true,
      default: 0,
    },
    elapsedTime: {
      type: Schema.Types.Number,
      required: true,
      default: 5,
    },
  },
  {
    collection: "imports",
    timestamps: true,
  }
);

const Import: Model<ImportDoc> = mongoose.model<ImportDoc>(
  "Import",
  importSchema
);

export { Import, ImportInput, ImportDoc };
