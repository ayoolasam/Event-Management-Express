// utils/payment.js
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const https = require("https");

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

function initializePayment(email, amount) {
  return new Promise((resolve, reject) => {
    const params = JSON.stringify({
      email: email,
      amount: amount * 100,
    });

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      // Collect response data
      res.on("data", (chunk) => {
        data += chunk;
      });

      // Once we have the full response
      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode === 200) {
            resolve(jsonData);
          } else {
            reject(new Error(`Paystack error: ${JSON.stringify(jsonData)}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    // If an error occurs with the request itself
    req.on("error", (error) => {
      reject(error);
    });

    // Write the parameters
    req.write(params);
    req.end();
  });
}

module.exports = {
  initializePayment,
};
