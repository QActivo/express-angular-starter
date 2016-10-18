import logger from '../logger.js';

module.exports = {
  database: 'mean_relational',
  username: 'facundo',
  password: 'Kioscoel24.',
  params: {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: (sql) => {
      logger.info(`[${new Date()}] ${sql}`);
    },
    define: {
      underscored: true,
    },
  },
  jwtSecret: 'Mean-relational-AP1-prod',
  jwtSession: { session: false },
  emailService: 'Gmail',
  auth: {
    user: '',
    pass: '',
  },
  verifyEmail: true,
  urlBaseClient: '',
  urlBaseApi: '',
};
