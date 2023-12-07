module.exports = function (req, res, next) {
  console.log('验证通过');
  next()
}