import { createCat } from './cat/createCat';
import { startServer } from './cat/server';

const cat = createCat();
startServer(cat, { port: 3005 });
