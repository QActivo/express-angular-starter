import Sequelize from 'sequelize';

import config from './config';

const db = {
  sequelize: null,
  Sequelize,
};

if (!db.sequelize) {
  // bluebird promises
  Sequelize.Promise.config({
    // Enable warnings
    warnings: false,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: true,
  });

  if (process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
    db.sequelize = new Sequelize(process.env.DATABASE_URL, config.params);
  } else {
    db.sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config.params
    );
  }
}

module.exports = db;
