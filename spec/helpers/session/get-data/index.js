module.exports = function (app) {
  return function (session, callback) {
    var r = /\:([A-Za-z0-9\_\-]*)\./;
    sessionId = session.cookies[0]['connect.sid'];
    sessionId = r.exec(sessionId)[1];
    app.routing.sessionStore.get(sessionId, function (err, data) {
      callback(err, data);
    });
  };
};