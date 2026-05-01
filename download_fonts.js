const fs = require('fs');
const https = require('https');
const path = require('path');

const fonts = {
  'Manrope-Regular.ttf': 'https://github.com/google/fonts/raw/main/ofl/manrope/Manrope%5Bwght%5D.ttf',
  'Manrope-Medium.ttf': 'https://github.com/google/fonts/raw/main/ofl/manrope/Manrope%5Bwght%5D.ttf',
  'Manrope-SemiBold.ttf': 'https://github.com/google/fonts/raw/main/ofl/manrope/Manrope%5Bwght%5D.ttf',
  'Manrope-Bold.ttf': 'https://github.com/google/fonts/raw/main/ofl/manrope/Manrope%5Bwght%5D.ttf'
};

const targetDir = path.join(__dirname, 'assets', 'fonts');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

Object.entries(fonts).forEach(([filename, url]) => {
  const filePath = path.join(targetDir, filename);
  https.get(url, (res) => {
    if (res.statusCode === 302) {
      https.get(res.headers.location, (redirectRes) => {
        const fileStream = fs.createWriteStream(filePath);
        redirectRes.pipe(fileStream);
      });
    } else {
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
    }
  });
});
