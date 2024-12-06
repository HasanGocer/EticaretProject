const Sequelize = require("sequelize");
const sequelize = new Sequelize("productDB", "root", "123456789", {
  host: "localhost",
  dialect: "mysql",
});

const User = require("./models/user")(sequelize, Sequelize.DataTypes);

(async () => {
  try {
    // Veritabanı bağlantısını test et
    await sequelize.authenticate();
    console.log("Veritabanına bağlanıldı!");

    // Veritabanı tablolarını senkronize et
    await sequelize.sync({ force: true });
    console.log("Model senkronize edildi.");

    // Yeni bir kullanıcı oluştur
    const newUser = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    console.log("Kullanıcı oluşturuldu:", newUser.toJSON());
  } catch (error) {
    console.error("Hata oluştu:", error);
  } finally {
    // Bağlantıyı kapat
    await sequelize.close();
  }
})();
