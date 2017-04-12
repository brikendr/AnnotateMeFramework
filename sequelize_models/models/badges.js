"use strict"

module.exports = function(sequelize, DataTypes) {
    var Badge = sequelize.define('Badge', {
        name: { type: DataTypes.STRING, allowNull: false},
        description: { type: DataTypes.TEXT('long'), allowNull: false},
        isactive: { type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        classMethods: {
            associate: function(models) {
                //Many to many Relationship with Player
                Badge.belongsToMany(models.Player, {through: 'PlayerBadges'});
            }
        }
    });

    return Badge;
}