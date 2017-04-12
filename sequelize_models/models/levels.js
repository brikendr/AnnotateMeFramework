"use strict"

module.exports = function(sequelize, DataTypes) {
    var Level = sequelize.define('Level', {
        name: { type: DataTypes.STRING, allowNull: false},
        lower_limit: DataTypes.INTEGER,
        upper_limit: DataTypes.INTEGER,
        logo_path: DataTypes.STRING(200)
    }, {
        classMethods: {
            associate: function(models) {
                //Levels' players
                Level.hasMany(models.Player);
            }
        }
    });

    return Level;
}