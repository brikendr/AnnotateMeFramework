"use strict"

module.exports = function(sequelize, DataTypes) {
    var Challenge = sequelize.define('Challenge', {
        p1_wps: DataTypes.INTEGER,
        p2_wps: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        challenged_points: DataTypes.INTEGER,
    }, {
        classMethods: {
            associate: function(models) {
                //Relationship with Player (Challenger)
                Challenge.belongsTo(models.Player, {as: 'challenger'});
                
                //Relationship with Player (Challengee)
                Challenge.belongsTo(models.Player, {as: 'challengee'});

                //Relationship with Game
                Challenge.belongsTo(models.Game);
            }
        }
    });

    return Challenge;
}