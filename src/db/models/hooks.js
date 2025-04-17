export const handleSaveError = (error, doc, next) => {
  console.log(error.name);

  const { code, name } = error;
  error.status = code === 11000 && name === 'MongoServerError' ? 409 : 400;

  next();
};

export const setUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
