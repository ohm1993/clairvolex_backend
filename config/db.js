const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err.message);
    });

module.exports = sequelize;
