import { Router } from 'express';

// controllers
import { createDossier } from '../controllers/dossiers/create';
import { allDossiers } from '../controllers/dossiers/all';
import { deleteDossier } from '../controllers/dossiers/delete';

export const dossiers = Router();

dossiers.post('/create', createDossier);
dossiers.delete('/delete/:id', deleteDossier);
dossiers.get('/all', allDossiers);
