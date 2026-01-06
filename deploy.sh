GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}==================================================${NC}"
echo -e "${CYAN}   BED-CRON AUTOMATED DEPLOYMENT SCRIPT           ${NC}"
echo -e "${CYAN}==================================================${NC}"

echo -e "\n${YELLOW}[1/5] Mengecek Environment Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js tidak ditemukan! Harap install Node.js terlebih dahulu.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js terdeteksi: $(node -v)${NC}"

echo -e "\n${YELLOW}[2/5] Memverifikasi File Konfigurasi...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}❌ File .env TIDAK DITEMUKAN!${NC}"
    echo "Silakan buat file .env dan isi konfigurasi DB & BPJS."
    exit 1
fi

if [ ! -f src/db/queries/get_beds.sql ]; then
    echo -e "${RED}❌ File Query SQL (src/db/queries/get_beds.sql) TIDAK DITEMUKAN!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Konfigurasi lengkap.${NC}"

echo -e "\n${YELLOW}[3/5] Mengupdate Library (NPM Install)...${NC}"
npm install --production --silent
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies updated.${NC}"
else
    echo -e "${RED}❌ Gagal menginstall dependencies.${NC}"
    exit 1
fi

echo -e "\n${YELLOW}[4/5] Mengatur Process Manager (PM2)...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo "PM2 belum terinstall. Menginstall PM2 Global..."
    npm install -g pm2
fi

echo -e "\n${YELLOW}[5/5] Menjalankan Service...${NC}"

if [ -f ecosystem.config.js ]; then
    pm2 reload ecosystem.config.js --update-env 2>/dev/null || pm2 start ecosystem.config.js
else
    echo -e "${YELLOW}⚠️  File ecosystem.config.js tidak ada, menjalankan manual...${NC}"
    pm2 start src/app.js --name "aplicares-sync" --update-env
fi

pm2 save --force > /dev/null

echo -e "\n${GREEN}==================================================${NC}"
echo -e "${GREEN}   ✅ DEPLOYMENT SUKSES! SERVICE BERJALAN.       ${NC}"
echo -e "${GREEN}==================================================${NC}"
echo -e "Perintah Bermanfaat:"
echo -e "👉 Cek Status    : ${CYAN}pm2 status aplicares-sync${NC}"
echo -e "👉 Cek Log Realtime : ${CYAN}pm2 logs aplicares-sync${NC}"
echo -e "👉 Stop Service  : ${CYAN}pm2 stop aplicares-sync${NC}"
echo -e ""