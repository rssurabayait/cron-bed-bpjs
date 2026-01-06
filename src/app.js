const express = require('express');
const morgan = require('morgan');
const db = require('./db/oracle');
const config = require('./config');
const apiRoutes = require('./routes/api');
const logger = require('./utils/logger');
const { initScheduledJobs } = require('./cron/scheduler');

const app = express();

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());

app.use('/api', apiRoutes);

async function startServer() {
  try {
    await db.initialize();
    logger.info('Database connected successfully.');

    initScheduledJobs();

    app.listen(config.app.port, () => {
      logger.info(`Server Application running on port ${config.app.port}`);
      // console.log(`Server Application running on port ${config.app.port}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
  }
}

startServer();