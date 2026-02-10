const authJwt = require("../middlewares/authJwt");
const controller = require("../controllers/booking.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/bookings", [authJwt.verifyToken], controller.create);
  app.get("/api/users/bookings", [authJwt.verifyToken], controller.findAll);
  app.delete("/api/bookings/:id", [authJwt.verifyToken], controller.delete);
};