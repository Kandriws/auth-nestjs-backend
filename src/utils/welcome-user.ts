import { envs } from 'src/common/config';

export const generateWelcomeUserEmail = (
  name: string,
  otpToken: string,
): string => {
  const { OTP_EXPIRATION_MINUTES } = envs;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Service</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #f9f9f9;
            }
            h1 {
                color: #007BFF;
            }
            p {
                margin: 10px 0;
            }
            .otp {
                font-size: 1.2em;
                font-weight: bold;
                color: #d9534f;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Our Service, ${name}!</h1>
            <p>Thank you for signing up. Please verify your email address using the OTP below:</p>
            <p class="otp">Your OTP: ${otpToken}</p>
            <p>This OTP is valid for ${OTP_EXPIRATION_MINUTES} minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>Your Service Team</p>
        </div>
    </body>
    </html>
  `;
};

export const requestNewOtpEmail = (name: string, otpToken: string): string => {
  const { OTP_EXPIRATION_MINUTES } = envs;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Request New OTP</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #f9f9f9;
            }
            h1 {
                color: #007BFF;
            }
            p {
                margin: 10px 0;
            }
            .otp {
                font-size: 1.2em;
                font-weight: bold;
                color: #d9534f;
            }
            .footer {
                margin-top: 20px;
                font-size: 0.9em;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Request New OTP</h1>
            <p>Hello ${name},</p>
            <p>We received a request to send you a new OTP. Please use the OTP below to verify your email address:</p>
            <p class="otp">Your OTP: ${otpToken}</p>
            <p>This OTP is valid for ${OTP_EXPIRATION_MINUTES} minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p class="footer">Best regards,<br>Your Service Team</p>
        </div>
    </body>
    </html>
  `;
};
