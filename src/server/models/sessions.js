import Sequelize from 'sequelize';
import jwt from 'jwt-simple';
import _ from 'lodash';
import db from './../config/db';
import config from './../config/config';

const toJSON = function () {
  const privateAttributes = ['updatedOn', 'user_id'];
  this.dataValues.authToken = jwt.encode(this.authToken, config.jwtSecret);
  return _.omit(this.dataValues, privateAttributes);
};

const Sessions = db.sequelize.define('Sessions', {
  authToken: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  expiresOn: {
    type: Sequelize.DATE,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
}, {
  createdAt: 'issuedOn',
  updatedAt: 'updatedOn',
  classMethods: {
    associate: models => {
      Sessions.belongsTo(models.Users);
    },
  },
  instanceMethods: {
    toJSON,
  },
});

export default Sessions;
