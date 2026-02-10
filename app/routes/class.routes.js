const { verifyToken, isAdmin } = require("../middlewares/authJwt");
const controller = require("../controllers/class.controller");

module.exports = function(app) {
  app.get("/api/classes", controller.findAll);
  
  app.post("/api/classes", [verifyToken, isAdmin], controller.create);
  app.delete("/api/classes/:id", [verifyToken, isAdmin], controller.delete);
};