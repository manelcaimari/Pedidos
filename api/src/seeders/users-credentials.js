'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_credentials', [
      {
        id: 1,
        userId: '1',
        email: 'manelcaimari1@gmail.com', // cambiar el correo por el tuyo
        password: '$2a$08$JOUlTLXziqMGmLRldmpazOai8.1oC1.4WZR4MHsMNJVC4wrOtbHiO', //  <- el de alli  seria el Password1 este nada :'$2a$08$gL3I97b47Nwn3h43ZZPgh.weKLYsgK2dDohMxGyrMW1PPZez.dPY6' '$2a$08$JOUlTLXziqMGmLRldmpazOai8.1oC1.4WZR4MHsMNJVC4wrOtbHiO',
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
