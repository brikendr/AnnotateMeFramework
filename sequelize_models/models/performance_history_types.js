"use strict"

module.exports = function(sequelize, DataTypes) {
    var PerformanceHistoryTypes = sequelize.define('PerformanceHistoryTypes', {
        label: { type: DataTypes.STRING, allowNull: false},
        color: DataTypes.STRING,
        isactive: { type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        classMethods: {
            associate: function(models) {
                PerformanceHistoryTypes.hasMany(models.PerformanceHistory)                
            }
        }
    });

    return PerformanceHistoryTypes;
}