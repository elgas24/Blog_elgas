'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize)=> {
      return queryInterface.bulkInsert('Users', [{
        firstName:"Admin",
        lastName:"Admin",
        email:"admin@blog.com",
        password: 'hashedPassword',
        isAdmin:true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName:"Admin2",
        lastName:"Admin2",
        email:"admin2@blog.com",
        password: 'hashedPassword',
        isAdmin:true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName:"Admin3",
        lastName:"Admin3",
        email:"admin3@blog.com",
        password: 'hashedPassword',
        isAdmin:true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    
    ], {});
  },

  down: async (queryInterface, Sequelize)=> {
   
    return await queryInterface.bulkDelete('User', null, {});
    
  }
};
