import nodemailer from 'nodemailer';
import { google, gmail_v1 } from 'googleapis';
import { GoogleAuth, Impersonated, OAuth2Client} from 'google-auth-library';
import { authenticate } from '@google-cloud/local-auth';
import fs from 'fs/promises';
import process from 'process';
import path from 'path';
import"dotenv/config"
import mime from "mime";

export function sendPaymentStatement() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
  })
}

export async function sendReceipt(to, filePath) { }
export async function authSend(to, filePath) { }
export async function sendMailPaymentStatement(to, filePath) { }

import { getAuthenticatedClient, main } from './oAuthService.js';import { GoogleOAuthProvider } from '@react-oauth/google';


const TOKEN_PATH = path.join(process.cwd(), 'token.json');




const REDIRECT_URI = "http://localhost:3000/dashboard";
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose",  
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.insert",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://www.googleapis.com/auth/gmail.metadata",
  "https://www.googleapis.com/auth/gmail.settings.basic",
  "https://www.googleapis.com/auth/gmail.settings.sharing",
  
];


const { client_id, client_secret } = process.env;
const oauth2Client = new OAuth2Client(client_id, client_secret, REDIRECT_URI);

function getAuthorizationUrl(state) {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    state,
    prompt: "consent",
  });
}

async function exchangeCode() {
  try {
    const authorizationCode = await authenticate({
      keyfilePath: process.env.CREDENTIALS_PATH,
      scopes: SCOPES,
    })
    const { tokens } = await oauth2Client.getToken(authorizationCode);
    oauth2Client.setCredentials(tokens);
    return tokens;
  } catch (error) {
    console.error("An error occurred during code exchange:", error);
    throw new Error("CodeExchangeError");
  }
}

async function getUserInfo() {
  try {
  
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    return data;
  } catch (error) {
    console.error("An error occurred while retrieving user info:", error);
    throw new Error("NoUserIdException");
  }
}




/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  
  const keys = JSON.parse(content);
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    refresh_token: process.env.refresh_token
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  try{
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
    client = await authenticate({
      keyfilePath: process.env.CREDENTIALS_PATH,
      scopes: SCOPES,
    });
    await saveCredentials(client);
    return client;
  
    
  } catch (error) {
    console.error("An error occurred during authorization:", error);
    throw new Error("AuthorizationError");
  }
}
    
  

export async function gmailCreateDraftWithAttachment(sender, email, filePath) {
  try {
    // Load pre-authorized user credentials from the environme
   

    const auth = await authorize();
    const gmail = google.gmail({ version: "v1", auth });



      
    

    // Create email headers
    const to = `${sender}`;
    const from = `${email}`;
    const subject = "Rental Payment Statement";
    const body = "Attached is your payment statement.\n\nThanks, PDL Rentals, LLC \n\nPlease do not reply.";
    const attachmentPath = filePath;

    // Read attachment file
    const attachmentData = await fs.readFile(attachmentPath);
    const attachmentBase64 = attachmentData.toString("base64");
    const mimeType = mime.getType(attachmentPath) || "application/octet-stream";

    // Construct raw email message
    const emailLines = [];
    emailLines.push(`To: ${to}`);
    emailLines.push(`From: ${from}`);
    emailLines.push(`Subject: ${subject}`);
    emailLines.push("MIME-Version: 1.0");
    emailLines.push("Content-Type: multipart/mixed; boundary=boundary");
    emailLines.push("");

    // Email body
    emailLines.push("--boundary");
    emailLines.push("Content-Type: message/rfc822; charset=UTF-8");
    emailLines.push("");
    emailLines.push(body);
    emailLines.push("");

    // Attachment
    emailLines.push("--boundary");
    emailLines.push(`Content-Type: ${mimeType}; name="${path.basename(attachmentPath)}"`);
    emailLines.push("Content-Transfer-Encoding: base64");
    emailLines.push(`Content-Disposition: attachment; filename="${path.basename(attachmentPath)}"`);
    emailLines.push("");
    emailLines.push(attachmentBase64);
    emailLines.push("--boundary--");

    const rawMessage = Buffer.from(emailLines.join("\r\n")).toString("base64");

    // Create draft
    const draft = await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: {
          raw: rawMessage,
        },
      },
    });
    gmail.users.drafts.send({
      userId: "me",
      requestBody: {
        id: draft.data.id,
      },
    });
  }
    
  catch (error) {
    console.error("An error occurred while creating draft:", error);
    throw new Error("DraftCreationError");
  }
}
  // ...existing message parts...
//   // const gmail = google.gmail({ version: 'v1', auth });
//   // const messageParts = [
//   //   "From: PDL Rentals, LLC <jholt316@gmail.com>",
//   //   `To: ${to} <${email}>`,
//   //   'Content-Type: text/html; charset=utf-8',
//   //   'MIME-Version: 1.0',
//   //   "Subject: Your Payment Statement",
//   //   '',
//   //   'Attached is your payment statement.',
//   //   "Thanks, PDL Rentals, LLC"
//   // ];
//   // const message = messageParts.join('\n');
//   // const encodedMessage = Buffer.from(message)
//   //   .toString('base64')
//   //   .replace(/\+/g, '-')
//   //   .replace(/\//g, '_')
//   //   .replace(/=+$/, '');
    
//   // const { size: fileSize } = await fs.stat(filePath);
//   // const media = {
//   //   mimeType: 'application/pdf',
//   //   fileSize,
//   //   fileName: 'Payment_Statement.pdf',
//   //   body: fs.createReadStream(filePath)
//   // };
  
//   const res = await gmail.users.messages.send({
//     userId: 'me',
//     requestBody: { raw: encodedMessage },
//     media,
//   }, {
//     onUploadProgress: evt => {
//       const progress = (evt.bytesRead / fileSize) * 100;
//       process.stdout.write(`\r${Math.round(progress)}% complete`);
//     },
//   });
//   console.log('\nMessage sent:', res.data);
//   return res.data;
// }

  // const res = await gmail.users.messages.send({
  //   userId: 'me',
  //   requestBody: { raw: encodedMessage },
  // });
      


      // clientId: tokens.client_id,
      // clientSecret: tokens.client_secret,
      // refreshToken: tokens.refresh_token,
      // accessToken: tokens.access_token,
    // },
  // });
  // return oauth2Transporter;
// }

// export const authSend = () => authorize().then(sendMailPaymentStatement).catch(console.error);
// export const sendReceipt = async (email, amount, date) => {
// 
  // const oAuth2Transporter = await createOAuth2Transporter();
// 
  // const mailOptions = {
    // from: process.env.EMAIL_USER,
    // to: email,
    // subject: 'Rental Payment Receipt',
    // text: `Your rent payment of $${amount} on ${date} has been received.`,
  // };
// 
  // try {
    // await oAuth2Transporter.sendMail(mailOptions);
  // } catch (error) {
    // console.error('Email sending failed:', error);
  // }
// };
// 
// export const sendPaymentStatement = async (to, filePath) => {
  // try {
    
    // const oauth2Transporter = await createOAuth2Transporter();
// 
    // const mailOptions = {
      // from: 'jordanh316@gmail.com',
      // to,
      // subject: 'Your Payment Statement',
      // text: 'Attached is your payment statement.',
      // attachments: [{ filename: 'Payment_Statement.pdf', path: filePath }],
    // };
// 
    // await oauth2Transporter.sendMail(mailOptions);
    // console.log(`Payment statement sent to: ${to}`);
  // } catch (error) {
    // console.error('Email sending failed:', error);
  // }
// };
