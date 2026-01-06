const oracledb = require('oracledb');
const config = require('../config');
const logger = require('../utils/logger');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function initialize() {
  try {
    await oracledb.createPool({
      user: config.oracle.user,
      password: config.oracle.password,
      connectString: config.oracle.connectString,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 2
    });
    logger.info('Oracle Database pool created');
  } catch (err) {
    logger.error('Error creating Oracle pool', err);
    process.exit(1);
  }
}

async function execute(sql, binds = [], opts = {}) {
  let connection;
  try {
    connection = await oracledb.getConnection();

    if (config.oracle.schema) {
      await connection.execute(`ALTER SESSION SET CURRENT_SCHEMA = ${config.oracle.schema}`);
    }

    const result = await connection.execute(sql, binds, opts);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection', err);
      }
    }
  }
}

module.exports = { initialize, execute };