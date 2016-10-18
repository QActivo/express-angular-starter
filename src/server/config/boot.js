import fs from 'fs';
import path from 'path';

import db from './db';
import app from './express';

export default function () {
  loadModelRelationships()
    .then(syncDb)
    .then(runFixtures)
    .then(createServer);

  function loadModelRelationships() {
    const modelsPath = path.join(__dirname, '../models');
    const models = [];

    fs.readdirSync(modelsPath).forEach(file => {
      const modelPath = path.join(modelsPath, file);
      const model = require(modelPath).default;
      models[model.name] = model;
    });

    Object.keys(models).forEach(key => {
      models[key].associate(models);
    });

    return Promise.resolve('ok');
  }

  function syncDb() {
    return db.sequelize.sync();
  }

  function runFixtures() {
    const fixturesPath = path.join(__dirname, '../fixtures');
    const fixtures = fs.readdirSync(fixturesPath).map(file => {
      const fixturePath = path.join(fixturesPath, file);
      const fixtureModule = require(fixturePath);
      return fixtureModule();
    });

    return Promise.all(fixtures);
  }

  function createServer() {
    app.listen(app.get('port'), () => {
      const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
      console.log('Node Environment', env);
      console.log(`MEAN API - Port ${app.get('port')}`);
    });
  }

  return app;
}
