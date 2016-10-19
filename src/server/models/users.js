import Sequelize from 'sequelize';
import bcrypt from 'bcrypt-nodejs';

import db from './../config/db';

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
    },
    isPassword: (encodedPassword, password) => {
      return bcrypt.compareSync(password, encodedPassword);
    },
  },
});

export default Users;
