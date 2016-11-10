import Sequelize from 'sequelize';
import db from './../config/db';

const Notifications = db.sequelize.define('Notifications', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: Sequelize.ENUM('not_delivered', 'delivered', 'read', 'deleted'),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    defaultValue: 'not_delivered',
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'The notification content can not be empty' },
    },
  },
  action: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  parameters: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
  hooks: {
    beforeValidate: (model, options, cb) => { // Workarround to change not null validation message
      model.content = model.content || '';
      cb(null, model);
    },
  },
  classMethods: {
    associate: models => {
      Notifications.belongsTo(models.Users);
    },
  },
});

export default Notifications;
