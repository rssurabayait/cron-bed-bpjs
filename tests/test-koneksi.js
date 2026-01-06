require('dotenv').config();
const crypto = require('crypto');
const axios = require('axios');

async function testConnection() {
  console.log("🔍 SEDANG MENGECEK KONEKSI KE BPJS...");

  const baseUrl = process.env.BPJS_BASE_URL;
  const consId = process.env.BPJS_CONS_ID;
  const secretKey = process.env.BPJS_SECRET_KEY;
  const userKey = process.env.BPJS_USER_KEY;
  const ppk = process.env.BPJS_KODE_PPK;

  const timestamp = Math.floor(Date.now() / 1000);
  const dataSignature = consId + "&" + timestamp;
  const signature = crypto.createHmac('sha256', secretKey)
    .update(dataSignature)
    .digest('base64');

  const headers = {
    'X-cons-id': consId,
    'X-timestamp': timestamp,
    'X-signature': signature,
    'user_key': userKey,
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  const fullUrl = `${baseUrl}/aplicaresws/rest/bed/read/${ppk}/1/100`;
  console.log(`URL: ${fullUrl}`);
  console.log(`Headers:`, headers);

  try {
    const response = await axios.get(fullUrl, { headers });
    console.log("\n✅ BERHASIL! (200 OK)");
    console.log("Data diterima:", JSON.stringify(response.data).substring(0, 100) + "...");
  } catch (error) {
    console.log("\n❌ GAGAL");
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Response:`, JSON.stringify(error.response.data));

      if (error.response.status === 401) {
        console.log("\n💡 ANALISA: URL Benar, tapi ConsID/SecretKey SALAH untuk server ini.");
      }
    } else {
      console.log(`Error: ${error.message}`);
    }
  }
}

testConnection();