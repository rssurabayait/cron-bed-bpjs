const axios = require('axios');
const config = require('../config');
const { generateHeaders } = require('../utils/crypto');

const BASE_URL = `${config.bpjs.baseUrl}/aplicaresws/rest/bed`;
const PPK = config.bpjs.kodePpk;

const getAxiosConfig = () => ({ headers: generateHeaders() });

const readBeds = async () => {
  try {
    const url = `${BASE_URL}/read/${PPK}/1/100`;
    // console.log(`\n🔍 DEBUG URL: ${url}`);
    const response = await axios.get(url, getAxiosConfig());

    if (response.data && response.data.response && response.data.response.list) {
      return response.data.response.list;
    }
    return [];
  } catch (error) {
    console.error('BPJS API Read Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', JSON.stringify(error.response.data));
    }
    return [];
  }
};

const createBed = async (bedData) => {
  try {
    const url = `${BASE_URL}/create/${PPK}`;
    await axios.post(url, bedData, getAxiosConfig());
    process.stdout.write('.');
  } catch (error) {
    console.error(`Error Create ${bedData.koderuang}:`, error.message);
  }
};

const updateBed = async (bedData) => {
  try {
    const url = `${BASE_URL}/update/${PPK}`;
    await axios.post(url, bedData, getAxiosConfig());
    process.stdout.write('.');
  } catch (error) {
    console.error(`Error Update ${bedData.koderuang}:`, error.message);
  }
};

const deleteBed = async (kodeKelas, kodeRuang) => {
  try {
    const url = `${BASE_URL}/delete/${PPK}`;
    const payload = { kodekelas: kodeKelas, koderuang: kodeRuang };
    await axios.post(url, payload, getAxiosConfig());
    process.stdout.write('.');
  } catch (error) {
    console.error(`Error Delete ${kodeRuang}:`, error.message);
  }
};

const deleteAllBeds = async () => {
  const currentBeds = await readBeds();
  console.log(`Deleting ${currentBeds.length} records...`);
  for (const bed of currentBeds) {
    await deleteBed(bed.kodekelas, bed.koderuang);
  }
};

module.exports = { readBeds, createBed, updateBed, deleteBed, deleteAllBeds };