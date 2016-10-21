class Paginator {
  constructor(entity) {
    this.entity = entity;
  }
  getPaginated(options) {
    const query = {};
    // attributes
    if (options.attributes) {
      query.attributes = options.attributes;
    }
    // condition
    query.where = {};

    if (options.scope) { // scope
      query.where = options.scope;
    }
    if (options.filter) { // filter
      query.where.$or = [];
      options.filterAttributes.forEach((filterAttribute) => {
        const field = {};
        field[filterAttribute] = {
          $like: '%' + options.filter + '%',
        };
        query.where.$or.push(field);
      });
    }
    // relations / associations
    if (options.include) {
      query.include = options.include;
    }

    if (options.order) {
      query.order = options.order;
    }
    // pagination
    if (options.page) {
      const limit = (options.limit) ? options.limit : 10;
      query.offset = (options.page - 1) * limit;
    }
    if (options.limit) {
      query.limit = options.limit;
    }
    return this.entity.findAndCountAll(query);
  }
}
// export the class Paginator
module.exports = Paginator;
