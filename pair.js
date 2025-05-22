
const twilio = require('twilio');

const sessions = {};
const platforms = ['Chrome', 'Ubuntu', 'Linux'];

function generateSessionId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'Mark' + randomPart;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Only POST allowed');
    return;
  }

  const phone = req.body.From;
  const message = req.body.Body.trim().toLowerCase();
  const twiml = new twilio.twiml.MessagingResponse();

  if (!sessions[phone]) {
    const sessionId = generateSessionId();
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    sessions[phone] = { sessionId, platform };
    twiml.message(`✅ Your number has been linked to ${platform}.\nSession ID: ${sessionId}`);
  } else {
    const { sessionId, platform } = sessions[phone];
    if (message === '.info') {
      twiml.message(`Linked to ${platform}\nSession ID: ${sessionId}`);
    } else {
      twiml.message(`You are already linked with ${platform}.\nUse .info to see your session.`);
    }
  }

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(twiml.toString());
};
