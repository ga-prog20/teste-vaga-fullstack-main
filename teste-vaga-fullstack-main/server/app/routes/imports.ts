import { Router } from 'express';

// controllers
import { createImportLog } from '../controllers/files/imports/logs';
import { allImportsLog } from '../controllers/files/imports/all';
import { basicStatsOfImports } from '../controllers/files/imports/stats';
import { polarChartLogImports } from '../controllers/files/imports/graphs';

export const imports = Router();

imports.post('/logs/create', createImportLog);
imports.get('/logs/all', allImportsLog);
imports.get('/logs/stats/basic', basicStatsOfImports);
imports.get('/logs/graphs/polar', polarChartLogImports);
