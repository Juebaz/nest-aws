import 'dotenv/config';

export type GoogleInfo = {
  familyName: string;
  givenName: string;
  email: string;
  picture: string;
};
const validateGoogleToken = async (tokenId: string): Promise<GoogleInfo> => {
  const { OAuth2Client } = require('google-auth-library');
  const client = new OAuth2Client(process.env.GOOGLE_ID);

  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.CLIENT_ID,
  });

  const info = ticket.getPayload();
  return {
    familyName: info.family_name,
    givenName: info.given_name,
    email: info.email,
    picture: info.picture,
  };
};

export { validateGoogleToken };
