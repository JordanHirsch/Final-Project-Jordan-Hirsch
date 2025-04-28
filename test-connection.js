import { sequelize } from './models/index.js';
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to MySQL successful!');
  } catch (err) {
    console.error('❌ Unable to connect:', err);
  } finally {
    process.exit();
  }
})();
