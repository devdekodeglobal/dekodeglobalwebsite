import { normalizeVisitorMessage } from './messageNormalization.js';

const ACCOUNT_INTRUSION = /\b(can|could|would|will)\s+you\b.{0,24}\b(hack|break into|take over|bypass)\b.{0,32}\b(account|login|authentication|website|system)\b|^(?:please\s+)?\b(hack|break into|take over|bypass)\b.{0,32}\b(account|login|authentication|website|system)\b|\b(help|teach|show|tell)\b.{0,24}\b(hack|break into|steal|phish)\b.{0,30}\b(account|credentials?|passwords?)\b/i;
const SECRET_DISCLOSURE = /\b(reveal|show|share|give|send|leak|expose|tell)\b.{0,32}\b(api[ -]?keys?|access tokens?|refresh tokens?|passwords?|credentials?|private keys?|secrets?)\b|\b(what is|can i have|i need|i want)\b.{0,24}\b(your\s+)?(api[ -]?key|access token|password|credential|private key|secret)\b/i;
const PRIVATE_DATA = /\b(reveal|find|steal|share|expose|leak)\b.{0,32}\b(private|personal|confidential|customer|user)\b.{0,20}\b(data|information|records?|details?)\b/i;

export function getSensitiveRequestRefusal(message) {
  const text = normalizeVisitorMessage(message);

  if (SECRET_DISCLOSURE.test(text)) {
    return "I can’t reveal or help obtain API keys, passwords, access tokens, private keys, or other secrets. DEKODE keeps credentials server-side and limits access to authorised systems and people.";
  }
  if (ACCOUNT_INTRUSION.test(text)) {
    return "I can’t help hack an account, steal credentials, bypass authentication, or gain unauthorised access. I can help with defensive security, account recovery, access-control design, or reporting a suspected compromise.";
  }
  if (PRIVATE_DATA.test(text)) {
    return "I can’t help obtain or expose private, confidential, or personal data. I can help with authorised data protection, privacy controls, secure access, or incident-response planning.";
  }

  return null;
}
