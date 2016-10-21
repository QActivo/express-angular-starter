import Users from './../models/users';

module.exports = () => {
  return Users.findOrCreate({
    where: {
      role: 'user',
    },
    defaults: {
      name: 'User',
      password: 'user',
      email: 'user@user.com',
      role: 'user',
      emailValidate: 1,
    },
  });
};
