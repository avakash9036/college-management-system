import { app } from './app.js';
import { sequelize } from './config/database.js';
import { env } from './config/env.js';
import { seedDefaults } from './utils/seedDefaults.js';
import './models/index.js';

async function start() {
  await sequelize.authenticate();
  const tables = await sequelize.getQueryInterface().showAllTables();
  if (tables.length === 0) {
    await sequelize.sync();
  }
  await seedDefaults();

  app.listen(env.port, () => {
    console.log(`College Management System running at http://localhost:${env.port}`);
    console.log(`Super admin login: ${env.superAdmin.email}`);
  });
}

start().catch((error) => {
  console.error('Unable to start server:', error);
  process.exit(1);
});
