module.exports = function (req, callback) {
  var DEFAULT_LIMIT = 10;
  var DEFAULT_OFFSET = 0;
  var MAX_LIMIT = 10;
  var limit;
  var offset;
  
  limit = req.query.limit;
  offset = req.query.offset;
  if (!limit) { limit = DEFAULT_LIMIT; }
  if (limit > MAX_LIMIT) { limit = MAX_LIMIT; }
  if (!offset) { offset = DEFAULT_OFFSET; }

  return callback({
    limit: limit,
    offset: offset
  });
};