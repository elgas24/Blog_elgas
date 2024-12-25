'use strict';
const User = require('./user');
const Articles = require('./articles');
const Images = require('./images');
const Comments = require('./comments');

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
// const articles = require('./articles');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User(sequelize, Sequelize.DataTypes);
db.Article = Articles(sequelize, Sequelize.DataTypes);
db.Image = Images(sequelize, Sequelize.DataTypes);
db.Comment = Comments(sequelize, Sequelize.DataTypes);

db.Article.belongsTo(db.User, { foreignKey: 'authorId' });
db.User.hasMany(db.Article, { foreignKey: 'authorId' });

db.Article.hasMany(db.Image, { foreignKey: 'articleId' });
db.Image.belongsTo(db.Article, { foreignKey: 'articleId' });

db.Article.hasMany(db.Comment, { foreignKey: 'articleId' }); 
db.Comment.belongsTo(db.Article, { foreignKey: 'articleId' });

db.Comment.belongsTo(db.User, { foreignKey: 'userId' }); 
db.User.hasMany(db.Comment, { foreignKey: 'userId' });


module.exports = db;
