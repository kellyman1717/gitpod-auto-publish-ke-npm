const fs = require('fs');
const { exec } = require('child_process');

let publishCount = 0;

const fruits = ["apple", "banana", "orange", "pear", "strawberry", "kiwi", "pineapple", "watermelon",
"grape", "blueberry", "mango", "peach", "plum", "cherry", "lemon", "lime", "grapefruit",
"pomegranate", "raspberry", "blackberry", "avocado", "coconut", "apricot", "fig",
"papaya", "cranberry", "guava", "melon", "nectarine", "olive", "tomato", "potato",
"carrot", "cucumber", "pepper", "broccoli", "lettuce", "onion", "garlic", "ginger",
"mushroom", "celery", "zucchini", "spinach", "asparagus", "cabbage", "cauliflower",
"peas", "corn", "bean", "rice", "pasta", "bread", "cake", "cookie", "pie", "donut",
"muffin", "pancake", "waffle", "ice cream", "cheese", "yogurt", "butter", "milk",
"cream", "egg", "bacon", "sausage", "ham", "chicken", "beef", "pork", "fish", "shrimp",
"lobster", "crab", "scallop", "clam", "squid", "octopus", "tuna", "salmon", "trout",
"cod", "haddock", "halibut", "sardine", "anchovy", "hamburger", "pizza", "sandwich",
"hot dog", "taco", "burrito", "sushi", "noodle", "soup", "salad", "stew", "curry",
"rice bowl", "kebab", "wrap", "quesadilla", "gyro", "spring roll", "samosa", "pierogi",
"empanada", "tempura", "sashimi", "teriyaki", "dumpling", "dim sum", "pad thai",
"pho", "ramen", "bibimbap", "paella", "lasagna", "spaghetti", "ravioli", "gnocchi",
"risotto", "casserole", "stir-fry", "enchiladas", "meatball", "fajitas", "kabob",
"carbonara", "chow mein", "sukiyaki", "tikka masala", "goulash", "biryani", "jambalaya",
"borscht", "gumbo", "moussaka", "frittata", "quiche", "croissant", "bagel", "pretzel",
"scone", "biscuit", "wonton", "phyllo", "tart", "crepe", "fritter", "beignet", "blintz",
"pierogi", "panini", "flatbread", "naan", "focaccia", "baguette", "brioche", "ciabatta",
"cornbread", "rye bread", "whole grain bread", "white bread", "pumpernickel", "baguette"];

function generateRandomFruitName() {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

function generateRandomDelay() {
  return 30000; // set delay ke 30 detik
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
      }, 5000);
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
      }, 5000);
    }
  }, 10000);
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
  }, 10000);
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
  let randomFruit = generateRandomFruitName();
  packageData.name = `${randomFruit}-notthedevs`; //ganti "-notthedevs" dengan apapun

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