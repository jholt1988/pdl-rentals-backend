import { OAuth2Client } from 'google-auth-library';
import http from 'http';
import open from 'open';
import destroyer from 'server-destroy';
import 'dotenv/config';

/**
 * Create a new OAuth2Client, and go through the OAuth2
 * workflow. Return the full client when resolved.
 */
export function getAuthenticatedClient() {
  return new Promise((resolve, reject) => {
    const oAuth2Client = new OAuth2Client(
      process.env.OAUTHWEB.web.client_id,
      process.env.OAUTHWEB.web.client_secret,
      process.env.OAUTHWEB.web.redirect_uris
    );

    // Generate the URL that will be used for the consent dialog
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'online',
      scope: ['https://www.googleapis.com/auth/gmail.send'],
    });

    // Start an HTTP server to capture Google's OAuth callback
    const server = http.createServer(async (req, res) => {
      if (req.url && req.url.includes('/oauth2callback')) {
        const qs = new URL(req.url, `http://${req.headers.host}`).searchParams;
        const code = qs.get('code');
        res.end('Authentication successful! Please return to the console.');
        server.destroy();

        try {
          const r = await oAuth2Client.getToken(code);
          oAuth2Client.setCredentials(r.tokens);
          console.info('Tokens acquired.');
          resolve(oAuth2Client);
        } catch (error) {
          reject(error);
        }
      }
    });
    server.listen(3001, () => {
      open(authorizeUrl, { wait: false }).then(cp => cp.unref()
      );
    });
    destroyer(server);
  });
}

/**
 * Acquire a pre-authenticated OAuth2 client and make a test request.
 */
export async function main() {
  const oAuth2Client = await getAuthenticatedClient();
  const apiUrl = 'https://people.googleapis.com/v1/people/me?personFields=names';
  const res = await oAuth2Client.request({ url: apiUrl });
  console.log(res.data);

  // Optionally, get token info:
  const tokenInfo = await oAuth2Client.getTokenInfo(
    oAuth2Client.credentials.access_token
  );
  console.log(tokenInfo);
}