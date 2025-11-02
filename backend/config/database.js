const { Sequelize , DataTypes} = require('sequelize');
const logger = require('../logs/logging');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging:false
  });

  try {
    sequelize.authenticate();
    logger.info({action:"connect_db_success"},'Connection has been established successfully.');
  } catch (error) {
    logger.error({action:"error_connect_db",error:error.message},'Unable to connect to the database:');
  }

  const db={}
db.Sequelize=Sequelize
db.sequelize=sequelize

db.user=require('../models/user.model')(sequelize,DataTypes)
db.notes=require('../models/note.model')(sequelize,DataTypes)


Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});


db.sequelize.sync({force: false}).then(() => {
  logger.info({ action: 'db_sync_success' }, 'Database synchronized successfully.');
}) .catch((err) => {
  logger.error({ action: 'db_sync_failed', error: err.message, stack: err.stack }, 'Database sync failed.');
});



module.exports=db;
