import { dialog } from './cat/dialog';
import { startServer } from './server';

startServer(dialog, { port: 5002 });
