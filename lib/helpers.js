const encode = message => {
  return { ...message, headers: JSON.stringify(message.headers) };
};

const decode = message => {
  return { ...message, headers: JSON.parse(message.headers) };
};

const isDuplicatedDocumentMongoError = error => {
  return error.name === 'MongoError' && error.code === 11000;
};

module.exports = {
  encode,
  decode,
  isDuplicatedDocumentMongoError,
};
