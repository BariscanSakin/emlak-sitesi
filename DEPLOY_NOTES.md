# 🏠 Emlak Sitesi - Deployment Rehberi

## 📋 İçindekiler

1. [Alan Adı Ayarları](#alan-adı-ayarları)
2. [Hostinger VPS Kurulumu](#hostinger-vps-kurulumu)
3. [Docker ile Yayınlama](#docker-ile-yayınlama)
4. [SSL Sertifikası](#ssl-sertifikası)
5. [Geliştirme Ortamı](#geliştirme-ortamı)
6. [Varsayılan Giriş Bilgileri](#varsayılan-giriş-bilgileri)

---

## 🌐 Alan Adı Ayarları

### Alan adınızı değiştirmeniz gereken yerler:

#### 1. Nginx Konfigürasyonu (ZORUNLU)

📁 `frontend/nginx.conf` dosyasında **satır 3**:

```nginx
server_name localhost;  # <--- ALAN ADINIZI BURAYA YAZIN
```

Değiştirin:

```nginx
server_name emlaksitesi.com www.emlaksitesi.com;
```

#### 2. Frontend API URL (Opsiyonel - Production'da gerekli değil)

Frontend, Nginx proxy sayesinde aynı domain üzerinden API'ye erişir.
Eğer API ayrı bir domain/port'tan sunulacaksa:
📁 `frontend/src/services/api.js` dosyasında baseURL'i güncelleyin.

---

## 🖥️ Hostinger VPS Kurulumu

### 1. SSH ile Bağlanma

```bash
ssh root@SUNUCU_IP_ADRESINIZ
```

### 2. Yeni Kullanıcı Oluşturma (Güvenlik için önerilir)

```bash
# Yeni kullanıcı oluştur
adduser emlakadmin

# Sudo yetkisi ver
usermod -aG sudo emlakadmin

# Docker grubu oluştur ve kullanıcıyı ekle
groupadd docker
usermod -aG docker emlakadmin

# Yeni kullanıcıya geç
su - emlakadmin
```

### 3. Docker Kurulumu

```bash
# Docker kur
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose kur (v2 Docker ile birlikte gelir)
docker compose version

# Docker'ı başlat ve otomatik başlatmayı ayarla
sudo systemctl start docker
sudo systemctl enable docker
```

### 4. Proje Dosyalarını Sunucuya Yükleme

```bash
# Yerel bilgisayardan sunucuya kopyala (yerel bilgisayardan çalıştırın)
scp -r ./emlak-sitesi emlakadmin@SUNUCU_IP_ADRESINIZ:~/emlak-sitesi
```

Veya Git kullanarak:

```bash
# Sunucuda
cd ~
git clone REPO_URL emlak-sitesi
```

---

## 🐳 Docker ile Yayınlama (Tek Tuş)

### Production Deployment

```bash
# Proje klasörüne git
cd ~/emlak-sitesi

# .env dosyasını oluştur
cp .env.example .env

# ⚠️ JWT_SECRET değerini mutlaka değiştirin!
nano .env

# Tek komutla yayınla! 🚀
docker compose up -d --build
```

### Veritabanını Seed'le (İlk kurulumda)

```bash
# Admin kullanıcısı ve varsayılan verileri oluştur
docker compose exec backend node src/seeders/seed.js
```

### Yararlı Docker Komutları

```bash
# Durumu kontrol et
docker compose ps

# Logları izle
docker compose logs -f

# Sadece backend logları
docker compose logs -f backend

# Durdur
docker compose down

# Yeniden başlat
docker compose restart

# Güncelleme sonrası yeniden build et
docker compose up -d --build

# Veritabanı ve uploadlar dahil tamamen sil (DİKKAT!)
docker compose down -v
```

---

## 🔒 SSL Sertifikası (HTTPS)

### Let's Encrypt ile Ücretsiz SSL

#### 1. Certbot Kurulumu

```bash
sudo apt update
sudo apt install certbot
```

#### 2. SSL Sertifikası Al (Docker'ı durdurarak)

```bash
# Docker'ı geçici olarak durdur
docker compose down

# Sertifika al
sudo certbot certonly --standalone -d emlaksitesi.com -d www.emlaksitesi.com

# Sertifikalar burada oluşur:
# /etc/letsencrypt/live/emlaksitesi.com/fullchain.pem
# /etc/letsencrypt/live/emlaksitesi.com/privkey.pem
```

#### 3. Nginx SSL Konfigürasyonu

📁 `frontend/nginx.conf` dosyasını güncelleyin:

```nginx
server {
    listen 80;
    server_name emlaksitesi.com www.emlaksitesi.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name emlaksitesi.com www.emlaksitesi.com;

    ssl_certificate /etc/letsencrypt/live/emlaksitesi.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/emlaksitesi.com/privkey.pem;

    client_max_body_size 20M;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
    }
}
```

#### 4. Docker Compose SSL Volume Ekle

📁 `docker-compose.yml` → frontend servisi altına ekleyin:

```yaml
volumes:
  - /etc/letsencrypt:/etc/letsencrypt:ro
ports:
  - "80:80"
  - "443:443"
```

#### 5. Otomatik Yenileme

```bash
# Crontab'a ekle (her gün kontrol eder, gerekirse yeniler)
sudo crontab -e
# Aşağıdaki satırı ekleyin:
0 3 * * * certbot renew --quiet && docker compose -f /home/emlakadmin/emlak-sitesi/docker-compose.yml restart frontend
```

#### 6. Docker'ı Yeniden Başlat

```bash
docker compose up -d --build
```

---

## 💻 Geliştirme Ortamı

### Docker ile Geliştirme

```bash
# Geliştirme ortamını başlat
docker compose -f docker-compose.dev.yml up -d --build

# Seed çalıştır
docker compose -f docker-compose.dev.yml exec backend node src/seeders/seed.js

# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
```

### Docker'sız Geliştirme (Lokal)

```bash
# Backend
cd backend
npm install
node src/seeders/seed.js    # İlk kurulumda çalıştırın
npm run dev                  # http://localhost:3001

# Yeni terminal açın
# Frontend
cd frontend
npm install
npm run dev                  # http://localhost:5173
```

---

## 🔑 Varsayılan Giriş Bilgileri

| Alan          | Değer      |
| ------------- | ---------- |
| Admin Panel   | `/admin`   |
| Kullanıcı Adı | `admin`    |
| Şifre         | `admin123` |

> ⚠️ **ÖNEMLİ:** Production ortamında ilk girişten sonra şifrenizi mutlaka değiştirin!

---

## 📁 Proje Yapısı

```
emlak-sitesi/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── index.js
│       ├── config/database.js
│       ├── models/index.js
│       ├── middleware/
│       ├── routes/
│       └── seeders/
├── frontend/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── .dockerignore
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── services/api.js
│       ├── context/AuthContext.jsx
│       ├── components/
│       └── pages/
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
└── DEPLOY_NOTES.md
```

---

## ❓ Sık Karşılaşılan Sorunlar

### Port 80 kullanımda hatası

```bash
sudo lsof -i :80
sudo kill -9 <PID>
```

### Veritabanı hatası

```bash
# Volume'u sil ve yeniden oluştur
docker compose down
docker volume rm emlak-sitesi_backend-data
docker compose up -d --build
docker compose exec backend node src/seeders/seed.js
```

### Upload dosyaları kayboldu

Upload'lar `backend-uploads` volume'unda saklanır. `docker compose down -v` komutu volume'ları da siler, dikkatli olun!

### Container logları

```bash
docker compose logs -f --tail=100
```
