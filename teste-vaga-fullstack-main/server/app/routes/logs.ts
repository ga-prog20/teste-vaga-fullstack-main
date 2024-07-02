import { Router } from 'express';

// controllers
import { createLog } from '../controllers/logs/create';
import { deleteLog } from '../controllers/logs/delete';
import { allLogs } from '../controllers/logs/all';

export const logs = Router();

logs.post('/create', createLog);
logs.delete('/delete/:id', deleteLog);
logs.get('/all', allLogs);
