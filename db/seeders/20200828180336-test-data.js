'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Parks', [
      {
        parkName: 'Central Park',
        city: 'New York City',
        provinceState: 'New York',
        country: 'United States',
        opened: new Date('1876'),
        size: '843 acres',
        description: 'The big park in New York City',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Parks');
  }
};
