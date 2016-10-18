const errors = {};

errors.get = (error) => {
  console.log(error);
  if (error.errors && error.errors[0] && error.errors[0].message) {
    return { msg: error.errors[0].message };
  }
  return { msg: (error.message) ? error.message : 'Something went wrong' };
};

module.exports = errors;
