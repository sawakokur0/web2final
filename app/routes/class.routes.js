const { authJwt } = require("../middlewares");
const controller = require("../controllers/class.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create a new Class (Admin only)
  app.post(
    "/api/classes",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );

  // Retrieve all Classes (Public)
  app.get("/api/classes", controller.findAll);

  // Retrieve a single Class with id
  app.get("/api/classes/:id", controller.findOne);

  // Update a Class with id (Admin only)
  app.put(
    "/api/classes/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );

  // Delete a Class with id (Admin only)
  app.delete(
    "/api/classes/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};