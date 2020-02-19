const isDuplicatedDocumentMongoError = error => {
  return error.name === 'MongoError' && error.code === 11000;
};

module.exports = {
  isDuplicatedDocumentMongoError,
};
