const cron = require('node-cron');
const config = require('../config');
const syncController = require('../controllers/syncController');
const logger = require('../utils/logger');

const initScheduledJobs = () => {
  const scheduleTime = config.cron.schedule;
  const timezone = config.cron.timezone;

  if (!cron.validate(scheduleTime)) {
    logger.error(`CRON Expression Invalid: ${scheduleTime}`);
    return;
  }

  logger.info(`Scheduler initialized. Pattern: [${scheduleTime}] Timezone: [${timezone}]`);

  cron.schedule(scheduleTime, async () => {
    logger.info('⏰ Triggering Scheduled Bed Sync...');
    await syncController.runSync();
  }, {
    scheduled: true,
    timezone: timezone
  });
};

module.exports = { initScheduledJobs };