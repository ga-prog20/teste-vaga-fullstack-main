import mongoose, { Schema, Model, Document } from 'mongoose';

type DossierDoc = Document & {
  slug: string;
  files: Array<string>;
};

type DossierInput = {
  slug: DossierDoc['slug'];
  files: DossierDoc['files'];
};

const dossierSchema = new Schema(
  {
    slug: {
      type: Schema.Types.String,
      required: true,
    },
    files: {
      type: Schema.Types.Mixed,
      default: [],
    },
  },
  {
    collection: 'dossiers',
    timestamps: true,
  },
);

const Dossier: Model<DossierDoc> = mongoose.model<DossierDoc>('Dossier', dossierSchema);

export { Dossier, DossierInput, DossierDoc };