import logger from '../logger.js';

module.exports = {
  database: 'mean_relational',
  username: 'root',
  password: 'root',
  params: {
    dialect: 'mysql',
    protocol: 'mysql',
    logging: (sql) => {
      logger.info(`[${new Date()}] ${sql}`);
    },
    define: {
      underscored: true,
    },
  },
  jwtSecret: 'Mean-relational-AP1',
  jwtSession: { session: false },
  sessionExpiration: 800,
  emailService: 'Gmail',
  auth: {
    user: '',
    pass: '',
  },
  mandrillAPIKEY: undefined,
  verifyEmail: true,
  urlBaseClient: 'http://localhost:3000',
  urlBaseApi: 'http://localhost:3000/api/v1',
  FACEBOOK_SECRET: '',
  TWITTER_KEY: '',
  TWITTER_SECRET: '',
  INSTAGRAM_SECRET: '',
  GOOGLE_SECRET: '',
  PINTEREST_SECRET: '',
  PINTEREST_KEY: '',
};
