// import { nanoid } from "nanoid";
const crypto = require("crypto");

function generateRandomString() {
  // Generate a random value (you can use Date.now or Math.random for uniqueness)
  const randomValue = Date.now().toString() + Math.random().toString();

  // Create a hash using CryptoJS (e.g., SHA256)
  // Create a SHA256 hash
  const hash = crypto.createHash("sha256").update(randomValue).digest("hex");

  // Extract the first 5 characters of the hash
  const randomString = hash.substring(0, 5);

  return randomString;
}

module.exports = generateRandomString;
