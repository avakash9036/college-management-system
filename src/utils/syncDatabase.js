import { sequelize } from '../config/database.js';
import { seedDefaults } from './seedDefaults.js';
import '../models/index.js';

async function syncDatabase() {
  await sequelize.authenticate();
  await sequelize.sync();
  await seedDefaults();

  console.log('Database synced and roles seeded.');
  await sequelize.close();
}

syncDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
