const db = require('../db/oracle');
const fs = require('fs');
const path = require('path');

const QUERY_PATH = path.join(__dirname, '../db/queries/get_beds.sql');
let QUERY_BEDS = '';

try {
  QUERY_BEDS = fs.readFileSync(QUERY_PATH, 'utf8');
} catch (err) {
  console.error('CRITICAL: File get_beds.sql tidak ditemukan!');
  process.exit(1);
}

const getLocalBeds = async () => {
  try {
    const rows = await db.execute(QUERY_BEDS);

    return rows.map(row => {
      const cleanInt = (val) => Math.max(0, parseInt(val || 0));

      return {
        kodekelas: row.KODEKELAS,
        koderuang: row.KODERUANG,
        namaruang: row.NAMARUANG,
        kapasitas: cleanInt(row.KAPASITAS).toString(),
        tersedia: cleanInt(row.TERSEDIA).toString(),
        tersediapria: cleanInt(row.TERSEDIAPRIA).toString(),
        tersediawanita: cleanInt(row.TERSEDIAWANITA).toString(),
        tersediapriawanita: cleanInt(row.TERSEDIAPRIAWANITA).toString()
      };
    });
  } catch (error) {
    throw new Error(`Oracle Query Failed: ${error.message}`);
  }
};

const getTotalCapacity = (beds) => {
  return beds.reduce((acc, curr) => acc + parseInt(curr.kapasitas), 0);
};

module.exports = { getLocalBeds, getTotalCapacity };