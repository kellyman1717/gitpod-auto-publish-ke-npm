const fs = require('fs');
const { exec } = require('child_process');

let publishCount = 0;

const fruitVegetableWords = ["apple", "banana", "orange", "grape", "strawberry", "pineapple", "kiwi", "mango", "pear", "watermelon", "avocado", "blueberry", "cherry", "coconut", "peach", "plum", "pomegranate", "raspberry", "lemon", "lime", "apricot", "blackberry", "cantaloupe", "fig", "grapefruit", "honeydew", "nectarine"];
function generateRandomFruitVegetableWord() {
  return fruitVegetableWords[Math.floor(Math.random() * fruitVegetableWords.length)];
}

function generateRandomString(length) {
  const randomWord = generateRandomFruitVegetableWord();
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = randomWord;
  for (let i = randomWord.length; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateRandomDelay() {
  return Math.floor(Math.random() * (5 * 60 * 1000 - 1 * 60 * 1000 + 1)) + 1 * 60 * 1000; // set delay
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
  let randomString = generateRandomString(10);
  packageData.name = `${randomString}-notthedevs`; //bisa ganti "-notthedevs" dengan apapun

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
    console.log(`Publish selanjutnya dalam ${delay / 1000} detik`);
    setTimeout(publishWithDelay, delay);
  });
}

publishWithDelay();
