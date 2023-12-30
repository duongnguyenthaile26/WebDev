function test(req, res, next) {
  res.json({
    status: "success",
    statusCode: 200,
    message: "Test success",
  });
}

exports.test = test;
