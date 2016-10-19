import bcrypt from 'bcrypt-nodejs';
import request from 'request';
import Q from 'q';
import jwt from 'jwt-simple';
import qs from 'querystring';

import config from './../config/config';
import Users from './../models/users';

const service = {};

function createJWT(user) {
  const payload = { id: user.id };
  return jwt.encode(payload, config.jwtSecret);
}

service.facebook = (code, clientId, redirectUri) => {
  const deferred = Q.defer();
  const fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  const accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  const graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  const params = {
    code,
    client_id: clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: redirectUri,
  };
  request.get({ url: accessTokenUrl, qs: params, json: true }, getAccessTokenCallback);

  function getAccessTokenCallback(errToken, responseToken, accessToken) {
    if (responseToken.statusCode !== 200) {
      deferred.reject({ message: responseToken.body.error.message });
      return null;
    }
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, getGraphCallback);
    return null;
  }

  function getGraphCallback(errAuth, responseAuth, profile) {
    if (responseAuth.statusCode !== 200) {
      deferred.reject({ message: responseAuth.body.error.message });
      return null;
    }
    const query = { where: { facebook: profile.id } };
    return Users.findOne(query)
    .then((existingUser) => {
      if (existingUser) {
        const token = createJWT(existingUser);
        deferred.resolve({
          user: {
            id: existingUser.dataValues.id,
            name: existingUser.name,
          },
          token,
        });
        return null;
      }
      const user = {};
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(salt, salt);
      user.facebook = profile.id;
      user.emailValidate = 1;
      user.email = profile.email;
      user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
      user.name = profile.first_name + ' ' + profile.last_name;
      return Users.create(user)
      .then((data) => {
        const token = createJWT(user);
        deferred.resolve({
          user: {
            id: data.dataValues.id,
            name: user.name,
          },
          token,
        });
        return null;
      });
    });
  }
  return deferred.promise;
};

service.twitter = (reqBody) => {
  const deferred = Q.defer();
  const accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  const profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';
  const accessTokenOauth = {
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    token: reqBody.oauth_token,
    verifier: reqBody.oauth_verifier,
  };

  request.post({ url: accessTokenUrl, oauth: accessTokenOauth },
  (errToken, responseToken, accessTokenParam) => {
    const accessToken = qs.parse(accessTokenParam);
    const profileOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      oauth_token: accessToken.oauth_token,
    };

    request.get({
      url: profileUrl + accessToken.screen_name,
      oauth: profileOauth,
      json: true,
    }, (errAuth, responseAuth, profile) => {
      Users.findOne({ twitter: profile.id })
      .then((existingUser) => {
        if (existingUser) {
          deferred.resolve({
            user: {
              id: existingUser.id,
              name: existingUser.name,
            },
            token: createJWT(existingUser),
          });
        } else {
          const user = {};
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(salt, salt);
          user.emailValidate = 1;
          user.email = profile.email;
          Users.create(user);
          user.twitter = profile.id;
          user.name = profile.name;
          user.picture = profile.profile_image_url.replace('_normal', '');
          Users.create(user)
          .then((data) => {
            const token = createJWT(user);
            deferred.resolve({
              user: {
                id: data.dataValues.id,
                name: user.name,
              },
              token,
            });
          });
        }
      });
      // end
    });
  });
  return deferred.promise;
};

service.instagram = (code, clientId, redirectUri) => {
  const deferred = Q.defer();
  const accessTokenUrl = 'https://api.instagram.com/oauth/access_token';
  const params = {
    client_id: clientId,
    redirect_uri: redirectUri,
    client_secret: config.INSTAGRAM_SECRET,
    code,
    grant_type: 'authorization_code',
  };

  request.post({ url: accessTokenUrl, form: params, json: true }, postAccessTokenCallback);

  function postAccessTokenCallback(errToken, responseToken, body) {
    if (body.error_message) {
      deferred.reject({ message: body.error_message });
    }
    const query = { where: { instagram: body.user.id } };
    return Users.findOne(query)
    .then((existingUser) => {
      if (existingUser) {
        const token = createJWT(existingUser);
        deferred.resolve({
          user: {
            id: existingUser.dataValues.id,
            name: existingUser.dataValues.name,
          },
          token,
        });
        return null;
      }
      const user = {};
      const salt = bcrypt.genSaltSync();
      const fullNameArray = body.user.full_name.split(' ');
      user.password = bcrypt.hashSync(salt, salt);
      user.instagram = body.user.id;
      user.emailValidate = 1;
      user.email = body.user.username + '@instagram.com';
      user.picture = body.user.profile_picture;
      user.first_name = fullNameArray.shift();
      user.last_name = fullNameArray.toString();
      user.name = body.user.full_name;
      user.gender = 'hombre';
      user.country = 'Chile';
      user.city = 'Arica';
      user.birthday = new Date();
      return Users.create(user)
      .then((data) => {
        const token = createJWT(data.dataValues);
        deferred.resolve({
          user: {
            id: data.dataValues.id,
            name: data.dataValues.name,
          },
          token,
        });
        return null;
      })
      .catch((err) => {
        deferred.reject({ message: err.message });
        return null;
      });
    })
    .catch((err) => {
      deferred.reject({ message: err.message });
      return null;
    });
  }
  return deferred.promise;
};

service.google = (code, clientId, redirectUri) => {
  const deferred = Q.defer();
  const accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  const peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  const params = {
    code,
    client_id: clientId,
    client_secret: config.GOOGLE_SECRET,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  };

  request.post(accessTokenUrl, { form: params, json: true }, postCallback);

  function postCallback(errToken, responseToken, tokenReturn) {
    if (responseToken.body.error) {
      deferred.reject({ message: responseToken.body.error });
      return null;
    }

    const accessToken = tokenReturn.access_token;
    const headers = { Authorization: 'Bearer ' + accessToken };

    request.get({ url: peopleApiUrl, headers, json: true }, getCallback);
    return null;
  }

  function getCallback(errAuth, responseAuth, profile) {
    if (profile.error) {
      deferred.reject({ message: profile.error.errors[0].message });
      return null;
    }

    const query = { where: { email: profile.email } };
    return Users.findOne(query)
      .then(existingUser => {
        if (existingUser) { // Update existing user
          const id = existingUser.id;
          const queryId = { where: { id } };

          existingUser.google = profile.sub;

          return Users.update(existingUser.dataValues, queryId)
            .then(() => {
              const token = createJWT(existingUser);
              deferred.resolve({
                user: {
                  id: existingUser.dataValues.id,
                  first_name: existingUser.dataValues.first_name,
                  last_name: existingUser.dataValues.last_name,
                  email: existingUser.dataValues.email,
                  role: existingUser.dataValues.role,
                  birthday: existingUser.dataValues.birthday,
                  gender: existingUser.dataValues.gender,
                  country: existingUser.dataValues.country,
                  city: existingUser.dataValues.city,
                  newsletter: existingUser.dataValues.newsletter,
                  picture: existingUser.dataValues.picture,
                },
                token,
              });
            })
            .catch(err => {
              deferred.reject({ message: err.message });
            });
        }
        // Create new user
        const user = {};
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(salt, salt);
        user.google = profile.sub;
        user.emailValidate = 1;
        user.email = profile.email;
        user.picture = profile.picture;
        user.first_name = profile.given_name;
        user.last_name = profile.family_name;
        user.gender = 'hombre';
        user.country = 'Chile';
        user.city = 'Arica';
        user.birthday = new Date();
        return Users.create(user)
          .then(data => {
            const token = createJWT(data.dataValues);
            deferred.resolve({
              user: {
                id: data.dataValues.id,
                first_name: data.dataValues.first_name,
                last_name: data.dataValues.last_name,
                email: data.dataValues.email,
                role: data.dataValues.role,
                birthday: data.dataValues.birthday,
                gender: data.dataValues.gender,
                country: data.dataValues.country,
                city: data.dataValues.city,
                newsletter: data.dataValues.newsletter,
                picture: data.dataValues.picture,
              },
              token,
            });
          })
          .catch(err => {
            deferred.reject({ message: err.message });
          });
      })
      .catch(err => {
        deferred.reject({ message: err.message });
      });
  }

  return deferred.promise;
};

service.pinterest = (code, clientId, redirectUri) => {
  const deferred = Q.defer();
  const accessTokenUrl = 'https://api.pinterest.com/v1/oauth/token';
  const fields = ['id', 'first_name', 'last_name', 'username', 'image'];
  const peopleApiUrl = 'https://api.pinterest.com/v1/me?fields=' + fields.join(',');
  const params = {
    code,
    client_id: config.PINTEREST_KEY,
    client_secret: config.PINTEREST_SECRET,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  };
  request.post(accessTokenUrl, { form: params, json: true },
  (errToken, responseToken, tokenReturn) => {
    if (tokenReturn.status === 'failure') {
      deferred.reject({ message: tokenReturn.message });
    } else {
      const accessToken = tokenReturn.access_token;
      const headers = { Authorization: 'Bearer ' + accessToken };
      request.get({ url: peopleApiUrl, headers, json: true },
      (errAuth, responseAuth, profile) => {
        if (profile.message) {
          deferred.reject({ message: profile.message });
        } else {
          const query = { where: { pinterest: profile.data.id } };
          Users.findOne(query)
          .then((existingUser) => {
            if (existingUser) {
              const token = createJWT(existingUser);
              deferred.resolve({
                user: {
                  id: existingUser.dataValues.id,
                  name: existingUser.name,
                },
                token,
              });
            } else {
              const user = {};
              const salt = bcrypt.genSaltSync();
              user.password = bcrypt.hashSync(salt, salt);
              user.pinterest = profile.data.id;
              user.emailValidate = 1;
              user.email = profile.data.username + '@pinterest.com';
              user.picture = profile.data.image['60x60'].url;
              user.name = profile.data.first_name + ' ' + profile.data.last_name;
              Users.create(user)
              .then((data) => {
                const token = createJWT(user);
                deferred.resolve({
                  user: {
                    id: data.dataValues.id,
                    name: user.name,
                  },
                  token,
                });
              });
            }
          });
        }
      });
    }
  });
  return deferred.promise;
};

module.exports = service;
