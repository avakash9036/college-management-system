import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import methodOverride from 'method-override';
import authRoutes from './routes/authRoutes.js';
import crudRoutes from './routes/crudRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  res.locals.currentPath_ = req.baseUrl + req.path;
  next();
});
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(authRoutes);
app.use(pageRoutes);
app.use('/api', crudRoutes);

app.use(notFound);
app.use(errorHandler);
