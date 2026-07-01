const myLogger = function (req, res, next) {
  console.log('Incoming request', new Date().toISOString());
  next();
};