require('dotenv').config();
const db = require('../src/db/oracle');
const bedService = require('../src/services/bedService');
const bpjsService = require('../src/services/bpjsService');

async function runTest() {
  console.log('\n🚀 MEMULAI MANUAL TEST...\n');
  console.time('Total Waktu');

  try {
    console.log('1️⃣  Connecting to Oracle Database...');
    await db.initialize();
    console.log('✅  Database Connected!\n');

    console.log('2️⃣  Fetching Data from Local Database (Query SQL)...');
    const localBeds = await bedService.getLocalBeds();
    const localTotal = await bedService.getTotalCapacity(localBeds);

    console.log(`✅  Success! Ditemukan: ${localBeds.length} records.`);
    console.log(`📊  Total Kapasitas Lokal: ${localTotal}`);

    if (localBeds.length > 0) {
      console.log('--- Sampel 5 Data Pertama (Lokal) ---');
      console.table(localBeds.slice(0, 5));
    }
    console.log('');

    console.log('3️⃣  Fetching Data from BPJS API...');
    const remoteBeds = await bpjsService.readBeds();

    const remoteTotal = remoteBeds.reduce((acc, curr) => acc + parseInt(curr.kapasitas || 0), 0);

    console.log(`✅  Success! Ditemukan: ${remoteBeds.length} records di Cloud BPJS.`);
    console.log(`📊  Total Kapasitas BPJS: ${remoteTotal}`);

    if (remoteBeds.length > 0) {
      console.log('--- Sampel 5 Data Pertama (BPJS) ---');
      console.table(remoteBeds.slice(0, 5));
    }
    console.log('');

    console.log('4️⃣  KESIMPULAN SYNC:');
    if (localTotal === remoteTotal) {
      console.log('🟢  DATA MATCH (SAMA). System akan melakukan UPDATE.');
    } else {
      console.log('🔴  DATA MISMATCH (BEDA). System akan melakukan DELETE ALL -> CREATE.');
      console.log(`    Selisih: ${Math.abs(localTotal - remoteTotal)} bed.`);
    }

  } catch (error) {
    console.error('\n❌  TEST GAGAL!');
    console.error('Pesan Error:', error.message);
  } finally {
    console.timeEnd('Total Waktu');
    console.log('\n🏁 Test Selesai. Tekan Ctrl+C untuk keluar jika tidak close otomatis.');
    process.exit(0);
  }
}

runTest();