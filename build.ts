import { toSSG } from 'hono/ssg';
import fs from 'fs/promises';
import app from './src/index';

toSSG(app, fs);
