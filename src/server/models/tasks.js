import Sequelize from 'sequelize';
import db from './../config/db';

const Tasks = db.sequelize.define('Tasks', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  done: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  classMethods: {
    associate: (models) => {
      Tasks.belongsTo(models.Users);
    },
  },
});

export default Tasks;
