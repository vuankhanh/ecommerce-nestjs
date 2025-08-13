import admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(path.join(process.cwd(), 'config-firebase', 'bep4than-c176a-firebase-adminsdk-fbsvc-5cb80cfca4.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;