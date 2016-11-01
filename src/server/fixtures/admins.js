import Users from './../models/users';

module.exports = () => {
  return Users.findOrCreate({
    where: {
      role: 'admin',
    },
    defaults: {
      firstName: 'Admin',
      lastName: 'Admin',
      password: 'admin',
      username: 'admin',
      email: 'admin@admin.com',
      role: 'admin',
      emailValidate: 1,
      status: 'active',
    },
  });
};
