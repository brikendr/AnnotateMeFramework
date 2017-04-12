"use strict"

module.exports = function(sequelize, DataTypes) {
    var Playerstats = sequelize.define('Playerstats', {
        current_wps: DataTypes.INTEGER,
        accuracy_level: DataTypes.INTEGER, //0 - 100 (in percentage)
        agreement_level: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                //Relationship with Player
                Playerstats.belongsTo(models.Player);
            }
        }
    });

    return Playerstats;
}