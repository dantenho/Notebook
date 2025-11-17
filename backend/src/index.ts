import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import spacesRouter from './routes/spaces';
import stacksRouter from './routes/stacks';
import notebooksRouter from './routes/notebooks';
import notesRouter from './routes/notes';
import aiRouter from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/spaces', spacesRouter);
app.use('/api/stacks', stacksRouter);
app.use('/api/notebooks', notebooksRouter);
app.use('/api/notes', notesRouter);
app.use('/api/ai', aiRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
});

export default app;
