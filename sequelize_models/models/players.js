"use strict"

module.exports = function(sequelize, DataTypes) {
    var Player = sequelize.define('Player', {
        username: { type: DataTypes.STRING, allowNull: false},
        password: { type: DataTypes.STRING, allowNull: false},
        email: DataTypes.STRING,
        points: {type: DataTypes.INTEGER, defaultValue: 0},
        isactive: { type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        classMethods: {
            associate: function(models) {
                //Player Level
                Player.belongsTo(models.Level);

                //Relationship with stats 
                Player.hasOne(models.Playerstats);

                //Relationship with PerformanceHistory 
                Player.hasMany(models.PerformanceHistory);

                //Relationship with shoutouts 
                Player.hasMany(models.Shoutout);

                //Many to many Relationship with Badges
                Player.belongsToMany(models.Badge, {through: 'PlayerBadges'});
            }
        }
    });

    return Player;
}