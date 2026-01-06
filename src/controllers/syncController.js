const bedService = require('../services/bedService');
const bpjsService = require('../services/bpjsService');
const logger = require('../utils/logger');
const notifier = require('../utils/notifier');

const runSync = async (req, res) => {
  const source = req ? 'MANUAL-API' : 'CRON-SCHEDULER';
  const startTime = Date.now();
  let logSummary = '';

  logger.info(`--- START SYNC [${source}] ---`);

  try {
    const localBeds = await bedService.getLocalBeds();
    const localTotal = bedService.getTotalCapacity(localBeds);

    const remoteBeds = await bpjsService.readBeds();
    const remoteTotal = remoteBeds.reduce((acc, curr) => acc + parseInt(curr.kapasitas || 0), 0);

    logger.info(`Comparison -> Local: ${localTotal} | BPJS: ${remoteTotal}`);

    if (localTotal !== remoteTotal) {
      logSummary = `⚠️ *Mismatch Detected* (RS: ${localTotal} vs BPJS: ${remoteTotal}). Performing Full Reset.`;
      logger.warn('Capacity Mismatch! Deleting all remote beds...');

      await bpjsService.deleteAllBeds();

      let success = 0;
      let fail = 0;
      for (const bed of localBeds) {
        try {
          await bpjsService.createBed(bed);
          success++;
        } catch (e) { fail++; }
      }
      logSummary += `\n✅ Re-created: ${success}\n❌ Failed: ${fail}`;
    } else {
      logSummary = `✅ *Capacity Match* (${localTotal}). Performing Update.`;
      logger.info('Capacity Match. Updating existing beds...');

      for (const bed of localBeds) {
        await bpjsService.updateBed(bed);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.info(`--- SYNC COMPLETED in ${duration}s ---`);

    await notifier.sendTelegram(`${logSummary}\n⏱ Duration: ${duration}s`);

    if (res) res.json({ status: 'success', summary: logSummary });

  } catch (error) {
    const errorMsg = `🔥 *SYNC FAILED*\nError: ${error.message}`;
    logger.error(errorMsg);
    logger.error(error.stack);

    await notifier.sendTelegram(errorMsg);

    if (res) res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { runSync };