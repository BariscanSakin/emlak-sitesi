const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');

const createStorage = (subfolder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(uploadDir, subfolder);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    }
  });
};

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg\+xml|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase().replace('.', ''));
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname || mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir (jpg, png, gif, webp, svg).'), false);
  }
};

const logoFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg|ico|bmp|tiff/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowedTypes.test(ext) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Geçersiz dosya türü.'), false);
  }
};

const uploadListingImages = multer({
  storage: createStorage('listings'),
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).array('images', 20);

const uploadBlogCover = multer({
  storage: createStorage('blog'),
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
}).single('coverImage');

const uploadLogo = multer({
  storage: createStorage('logo'),
  fileFilter: logoFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('logo');

module.exports = {
  uploadListingImages,
  uploadBlogCover,
  uploadLogo
};
