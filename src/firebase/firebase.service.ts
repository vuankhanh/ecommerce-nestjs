import admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

const serviceAccountPath = path.join(
  process.cwd(),
  'config-firebase',
  'bep4than-c176a-firebase-adminsdk-fbsvc-5cb80cfca4.json',
);

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
