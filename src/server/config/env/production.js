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
  sessionExpiration: 800,
  emailService: 'Gmail',
  auth: {
    user: '',
    pass: '',
  },
  mandrillAPIKEY: undefined,
  verifyEmail: true,
  urlBaseClient: '',
  urlBaseApi: '',
  FACEBOOK_SECRET: '',
  TWITTER_KEY: '',
  TWITTER_SECRET: '',
  INSTAGRAM_SECRET: '',
  GOOGLE_SECRET: '',
  PINTEREST_SECRET: '',
  PINTEREST_KEY: '',
};
