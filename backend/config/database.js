const { Sequelize , DataTypes} = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging:false
  });

  try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  const db={}
db.Sequelize=Sequelize
db.sequelize=sequelize

db.user=require('../models/user.model')(sequelize,DataTypes)
db.notes=require('../models/note.model')(sequelize,DataTypes)


// if (db.user.associate) {
//   db.user.associate(db);     // User.hasMany(Note)
// }
// if (db.notes.associate) {
//   db.notes.associate(db);    // Note.belongsTo(User)
// }
Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});


db.sequelize.sync({force: true});


module.exports=db;
