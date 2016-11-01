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
  username: {
    type: Sequelize.STRING,
    unique: { msg: 'Username alredy in use' },
    allowNull: false,
    validate: {
      notEmpty: { msg: 'The username can\'t be empty' },
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
    unique: { msg: 'Email alredy in use' },
    allowNull: false,
    validate: {
      notEmpty: { msg: 'The email address can\'t be empty' },
    },
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'user',
    validate: {
      notEmpty: true,
    },
  },
  status: {
    type: Sequelize.ENUM('not_validated', 'validated', 'not_active', 'active'),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    defaultValue: 'not_validated',
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
    beforeValidate: (model, options, cb) => { // Workarround to change not null validation message
      model.email = model.email || '';
      model.username = model.username || '';
      cb(null, model);
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
