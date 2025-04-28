import { TEMP_FILE_DIR, UPLOAD_FILE_DIR } from './constants/index.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';

await initMongoConnection();
await createDirIfNotExists(TEMP_FILE_DIR);
await createDirIfNotExists(UPLOAD_FILE_DIR);
setupServer();
