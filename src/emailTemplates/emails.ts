export const createHiredEmailTemplate = (gigTitle: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .email-container {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #4CAF50;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 5px;
    }
    .content {
      padding: 20px;
      line-height: 1.6;
    }
    .button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Congratulations! 🎉</h1>
    </div>
    <div class="content">
      <h2>You've Been Hired!</h2>
      <p>We're excited to inform you that you've been selected for the gig:</p>
      <h3>${gigTitle}</h3>
      <p>The client has chosen you for this opportunity and looks forward to working with you.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Details</a>
      <p>Best regards,<br>The GigX Team</p>
    </div>
  </div>
</body>
</html>
`;

export const createRejectionEmailTemplate = (gigTitle: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .email-container {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #666;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 5px;
    }
    .content {
      padding: 20px;
      line-height: 1.6;
    }
    .button {
      background-color: #666;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Application Update</h1>
    </div>
    <div class="content">
      <h2>Thank You for Your Interest</h2>
      <p>We appreciate your application for the position:</p>
      <h3>${gigTitle}</h3>
      <p>After careful consideration, we regret to inform you that we've decided to move forward with another candidate.</p>
      <p>We encourage you to continue applying for other opportunities on our platform.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/gigs" class="button">Browse More Gigs</a>
      <p>Best regards,<br>The GigX Team</p>
    </div>
  </div>
</body>
</html>
`;