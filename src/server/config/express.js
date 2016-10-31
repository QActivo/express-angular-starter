import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jwt-simple';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import config from './../config/config';
import routes from './../routes';
import logger from './logger';
import Auth from './auth';

const app = express();
const environment = process.env.NODE_ENV;
const port = process.env.PORT;

app.set('port', port || 3000);
app.set('json spaces', 4);
app.use(morgan('common', {
  stream: {
    write: (message) => {
      logger.info(message);
    },
  },
}));
app.use(helmet());
app.use(cors({}));
app.use(bodyParser.json());

app.use(Auth.initialize());

app.use((req, res, next) => {
  Auth.authenticate((authErr, data, info) => {
    if (data && data.User && data.Session) {
      req.User = data.User;
      req.Session = data.Session;

      res.setHeader('Authorization', jwt.encode(data.Session.authToken, config.jwtSecret));
      res.setHeader('Expiration', data.Session.expiresOn);
    }
    next(authErr);
  })(req, res, next);
});

app.use('/', routes);

function send404(req, res, description) {
  const data = {
    status: 404,
    message: 'Not Found',
    description,
    url: req.url,
  };
  res.status(404)
    .send(data)
    .end();
}

switch (environment) {
  case 'production':
    app.use(express.static('./build/'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', (req, res, next) => {
      send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./build/index.html'));
    break;
  default:
    app.use(express.static('./src/client/'));
    app.use(express.static('./'));
    app.use(express.static('./tmp'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', (req, res, next) => {
      send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./src/client/index.html'));
    break;
}

export default app;
