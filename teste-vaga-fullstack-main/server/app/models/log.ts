import mongoose, { Schema, Model, Document } from 'mongoose';

type LogDoc = Document & {
  browser: string;
  message: string | null;
};

type LogInput = {
  browser: LogDoc['browser'];
  message: LogDoc['message'];
};

const logSchema = new Schema(
  {
    browser: {
      type: Schema.Types.String,
      required: true,
      default: "Unknown",
    },
    message: {
      type: Schema.Types.String,
      default: null,
    },
  },
  {
    collection: 'logs',
    timestamps: true,
  },
);

const Log: Model<LogDoc> = mongoose.model<LogDoc>('Log', logSchema);

export { Log, LogInput, LogDoc };