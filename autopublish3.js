const fs = require('fs');
const { exec } = require('child_process');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');  //jangan lupa tambahin/ganti dictionariesnya

let publishCount = 0;

function generateRandomName() {
  const randomName = uniqueNamesGenerator(
    { dictionaries: [adjectives, animals, colors] 
    });  //disini bisa di tambahin lagi dictionariesnya. buat nambahin/ganti bisa ambil dari sini https://www.npmjs.com/package/unique-names-generator#dictionaries-available
  const randomNumber = Math.floor(Math.random() * 100) + 1;

  return `${randomName}-${randomNumber}`;
}

function generateRandomDelay() {
  return 30000; // set delay 30 dtk
}

function checkAndRemovePrivate() {
  const animation = ['Sedang memeriksa package...   ', 'Sedang memeriksa package.  ', 'Sedang memeriksa package.. ', 'Sedang memeriksa package...'];
  let currentFrame = 0;
  const animationInterval = setInterval(() => {
    process.stdout.write('\r' + animation[currentFrame]);
    currentFrame = (currentFrame + 1) % animation.length;
  }, 250);

  setTimeout(() => {
    clearInterval(animationInterval);
    process.stdout.write('\r');
    let packageJson = fs.readFileSync('package.json');
    let packageData = JSON.parse(packageJson);
    if (packageData.private === true) {
      console.log('Sedang mengubah package menjadi public...');
      delete packageData.private;
      fs.writeFileSync('package.json', JSON.stringify(packageData, null, 2));
      console.log('Package berhasil diubah menjadi public');
      const animationDelay = ['.', '..', '...', '....', '.....'];
      let currentFrame = 0;
      const animationInterval = setInterval(() => {
        process.stdout.write(animationDelay[currentFrame]);
        currentFrame = (currentFrame + 1) % animationDelay.length;
      }, 1000);
      setTimeout(() => {
        clearInterval(animationInterval);
        console.log('');
        checkAndRemovePrivate();
      }, 2000);
    } else {
      console.log('Tidak ada lagi private: true dalam package.json. Lanjut ke langkah berikutnya.');
      const animationDelay = ['.', '..', '...', '....', '.....'];
      let currentFrame = 0;
      const animationInterval = setInterval(() => {
        process.stdout.write(animationDelay[currentFrame]);
        currentFrame = (currentFrame + 1) % animationDelay.length;
      }, 1000);
      setTimeout(() => {
        clearInterval(animationInterval);
        console.log('');
        changePackageVersion();
      }, 2000);
    }
  }, 2000);
}

function changePackageVersion() {
  const animation = ['Sedang mengubah versi package...   ', 'Sedang mengubah versi package.  ', 'Sedang mengubah versi package.. ', 'Sedang mengubah versi package...'];
  let currentFrame = 0;
  const animationInterval = setInterval(() => {
    process.stdout.write('\r' + animation[currentFrame]);
    currentFrame = (currentFrame + 1) % animation.length;
  }, 250);

  setTimeout(() => {
    clearInterval(animationInterval);
    process.stdout.write('\r');
    let packageJson = fs.readFileSync('package.json');
    let packageData = JSON.parse(packageJson);
    const newVersion = `${Math.floor(Math.random() * 4) + 1}.${Math.floor(Math.random() * 4) + 1}.${Math.floor(Math.random() * 4) + 1}`;
    packageData.version = newVersion;
    fs.writeFileSync('package.json', JSON.stringify(packageData, null, 2));
    console.log(`Versi package telah diubah ke ${newVersion}`);
    publishWithDelay();
  }, 2000);
}

function publishWithDelay() {
  const animation = ['Sabar lagi di proses   ', 'Sabar lagi di proses.  ', 'Sabar lagi di proses.. ', 'Sabar lagi di proses...'];
  let currentFrame = 0;
  const animationInterval = setInterval(() => {
    process.stdout.write('\r' + animation[currentFrame]);
    currentFrame = (currentFrame + 1) % animation.length;
  }, 250);

  let packageJson = fs.readFileSync('package.json');
  let packageData = JSON.parse(packageJson);
  let randomName = generateRandomName();
  packageData.name = `${randomName}`;

  fs.writeFileSync('package.json', JSON.stringify(packageData, null, 2));

  let packageLockJson = fs.readFileSync('package-lock.json');
  let packageLockData = JSON.parse(packageLockJson);
  packageLockData.name = packageData.name;

  fs.writeFileSync('package-lock.json', JSON.stringify(packageLockData, null, 2));

  exec('npm publish --access public', (error, stdout, stderr) => {
    clearInterval(animationInterval);
    process.stdout.write('\r');
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    if (stdout.includes("Sedang mem-publish harap tunggu") && stdout.includes("Sukses mem-publish!")) {
      publishCount++;
      console.log(`Sukses mem-publish! Total publish: ${publishCount}`);
    } else if (stdout.includes("429 Too Many Requests")) {
      console.error("Error: Limit publish! Coba lagi nanti.");
      return;
    }
    const delay = generateRandomDelay();
    console.log(`Publish selanjutnya ${delay / 1000} detik`);
    setTimeout(checkAndRemovePrivate, delay);
  });
}
checkAndRemovePrivate();
