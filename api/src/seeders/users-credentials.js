'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_credentials', [
      {
        id: 1,
        userId: '1',
        email: 'manelcaimari1@gmail.com',
        password: '$2a$08$gL3I97b47Nwn3h43ZZPgh.weKLYsgK2dDohMxGyrMW1PPZez.dPY6',
        lastPasswordChange: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_credentials', null, {})
  }
}
