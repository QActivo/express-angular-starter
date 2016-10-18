import Users from './../models/users';

module.exports = () => {
  return Users.findOrCreate({
    where: {
      role: 'admin',
    },
    defaults: {
      name: 'Admin',
      password: 'admin',
      email: 'admin@admin.com',
      role: 'admin',
      emailValidate: 1,
    },
  });
};
