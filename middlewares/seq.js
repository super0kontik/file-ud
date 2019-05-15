const Sequelize = require('sequelize');
exports.Sequelize = Sequelize
// Option 1: Passing parameters separately
const sequelize = new Sequelize("test_database", "test_user", "qwerty", {
  host: 'localhost',
  dialect: 'postgres'
});
exports.sequelize = sequelize

  const Model = Sequelize.Model;
  class Pic extends Model {}
  Pic.init({
    // attributes
    picId: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    sequelize

    // options
  });

exports.Pic=Pic
