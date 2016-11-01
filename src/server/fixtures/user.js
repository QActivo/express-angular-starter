import Users from './../models/users';

module.exports = () => {
  return Users.findOrCreate({
    where: {
      role: 'user',
    },
    defaults: {
      firstName: 'Jhon',
      lastName: 'Doe',
      password: 'user',
      username: 'user',
      email: 'user@user.com',
      role: 'user',
      emailValidate: 1,
      status: 'active',
    },
  });
};
