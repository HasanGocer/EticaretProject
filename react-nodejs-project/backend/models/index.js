// index.js (Models Loader)

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    // Filter out non-model files (like route files)
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js" && file !== "auth.routes.js";
  })
  .forEach((file) => {
    console.log(`Yükleniyor: ${file}`);
    const modelPath = path.join(__dirname, file);
    const model = require(modelPath);
    if (typeof model !== "function") {
      throw new Error(`${file} doğru bir model döndürmüyor!`);
    }
    db[model(sequelize, Sequelize.DataTypes).name] = model(sequelize, Sequelize.DataTypes);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
