"use strict"

module.exports = function(sequelize, DataTypes) {
    var Bonuswins = sequelize.define('Bonuswins', {
        bonus_label: { type: DataTypes.STRING, allowNull: false},
        points: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                //Relationship with Player
                Bonuswins.belongsTo(models.Player);
            }
        }
    });

    return Bonuswins;
}