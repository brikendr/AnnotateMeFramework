"use strict"

module.exports = function(sequelize, DataTypes) {
    var Game = sequelize.define('Game', {
        wps: DataTypes.INTEGER,
        accuracy: DataTypes.INTEGER,
        typing_paragraph: { type: DataTypes.TEXT('long'), allowNull: false},
        betscore: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                //Relatioship with EntitMention
                Game.belongsTo(models.EntityMention);

                //Relationship with Candidate
                Game.belongsTo(models.Candidate);

                //Relationship with Playerbets 
                Game.hasOne(models.Betstats);

                //Relationship with player 
                Game.belongsTo(models.Player);

            }
        }
    });

    return Game;
}