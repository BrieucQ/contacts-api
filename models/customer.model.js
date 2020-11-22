const omitBy = require('lodash/omitBy');
const db = require('../db.js');

module.exports.getFullName = (customer) => {
  return `${customer.first_name} ${customer.last_name}`;
};

module.exports.create = async (newAttributes) => {
  const attributes = omitBy(
    newAttributes,
    (item) => typeof item === 'undefined'
  );

  return db.query('INSERT INTO customers SET ?', attributes).then((res) => {
    return { ...attributes, id: res.insertId };
  });
};

const findById = async (id) => {
  const rows = await db.query(`SELECT * FROM customers WHERE id = ${id}`);
  if (rows.length) {
    return Promise.resolve(rows[0]);
  }
  const err = new Error();
  err.kind = 'not_found';
  return Promise.reject(err);
};
module.exports.findById = findById;

module.exports.emailAlreadyExists = async (email) => {
  const rows = await db.query('SELECT * FROM customers WHERE email = ?', [
    email,
  ]);
  if (rows.length) {
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

module.exports.getAll = async () => {
  return db.query('SELECT id, first_name, last_name, email FROM customers');
};

module.exports.updateById = async (id, newAttributes) => {
  console.log(newAttributes);
  return db
    .query('UPDATE customers SET ? WHERE id = ?', [
      omitBy(newAttributes, (item) => typeof item === 'undefined'),
      id,
    ])
    .then(() => findById(id));
};

module.exports.remove = async (id) => {
  const res = await db.query('DELETE FROM customers WHERE id = ?', id);
  if (res.affectedRows !== 0) {
    return Promise.resolve();
  }
  const err = new Error();
  err.kind = 'not_found';
  return Promise.reject(err);
};

module.exports.removeAll = async () => {
  return db.query('DELETE FROM customers');
};
