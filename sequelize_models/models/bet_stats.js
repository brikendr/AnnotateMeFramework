"use strict"

module.exports = function(sequelize, DataTypes) {
    var Betstats = sequelize.define('Betstats', {
        agrees_with_majority: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
                //Relatioship with Game
                Betstats.belongsTo(models.Game);
            }
        }
    });

    return Betstats;
}