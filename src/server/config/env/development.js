import logger from '../logger.js';

module.exports = {
  database: 'mean_relational',
  username: 'postgres',
  password: 'postgres',
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
  jwtSecret: 'Mean-relational-AP1',
  jwtSession: { session: false },
  emailService: 'Gmail',
  auth: {
    user: '',
    pass: '',
  },
  verifyEmail: false,
  urlBaseClient: 'https://localhost:9000',
  urlBaseApi: 'https://localhost:3000',
  FACEBOOK_SECRET: 'cc5f57a04c594783bc513460718d164d', // Facebook secret API
  TWITTER_KEY: '',
  TWITTER_SECRET: '',
  INSTAGRAM_SECRET: 'fd9cb1ec4581434f89d1dbe4d44669e1',
  GOOGLE_SECRET: '',
  PINTEREST_SECRET: '',
  PINTEREST_KEY: '',
};
