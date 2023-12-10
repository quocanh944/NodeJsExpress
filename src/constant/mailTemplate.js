export const getMailTemplate = (username, password, activateLink) => {
  return `
      <!DOCTYPE html>
    <html>
    <head>
        <title>Your Account Details</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                background-color: #ffffff;
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
            }
            .header {
                background-color: #333;
                color: #ffffff;
                padding: 10px;
                text-align: center;
            }
            .content {
                margin: 20px 0;
                line-height: 1.6;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 0.8em;
                color: #777;
            }
            .button {
                background-color: #333;
                color: #ffffff;
                font-weight: bold;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to Our Service</h1>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>Here are your login details:</p>
                <ul>
                    <li>Username: <strong>${username}</strong></li>
                    <li>Password: <strong>${password}</strong></li>
                </ul>
                <p>Please click the button below to activate your account:</p>
                <a href="${activateLink}" class="button">Activate Account</a>
            </div>
            <div class="footer">
                <p>Thank you for using our service.</p>
            </div>
        </div>
    </body>
    </html>

    `
} 
