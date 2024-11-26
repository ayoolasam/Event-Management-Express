exports.createEmailTemplate = ({ title, message, buttonText, buttonLink }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #4CAF50;
      color: white;
      text-align: center;
      padding: 20px 0;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      color: #333;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      font-size: 16px;
      border-radius: 5px;
    }
    .button:hover {
      background-color: #45a049;
    }
    .footer {
      background-color: #f1f1f1;
      padding: 10px 20px;
      text-align: center;
      font-size: 14px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
    </div>
    <div class="content">
      <p>${message}</p>
      ${buttonText && buttonLink ? `<a href="${buttonLink}" class="button">${buttonText}</a>` : ''}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// module.exports = createEmailTemplate;

