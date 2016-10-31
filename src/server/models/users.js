import Sequelize from 'sequelize';
import bcrypt from 'bcrypt-nodejs';
import _ from 'lodash';
import db from './../config/db';

const isPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const toJSON = function () {
  const privateAttributes = [
    'password', 'emailValidate', 'tokenValidate', 'tokenPassRecovery', 'tokenPassRecoveryDate',
  ];
  return _.omit(this.dataValues, privateAttributes);
};

const Users = db.sequelize.define('Users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'user',
    validate: {
      notEmpty: true,
    },
  },
  emailValidate: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  picture: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null,
  },
  tokenValidate: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true,
    defaultValue: null,
  },
  tokenPassRecovery: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true,
    defaultValue: null,
  },
  tokenPassRecoveryDate: {
    type: Sequelize.DATE,
    defaultValue: new Date(),
  },
}, {
  hooks: {
    beforeCreate: user => {
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(user.password, salt);
    },
  },
  classMethods: {
    associate: models => {
      Users.hasMany(models.Tasks);
      Users.hasMany(models.Sessions);
    },
  },
  instanceMethods: {
    isPassword,
    toJSON,
  },
});

export default Users;
