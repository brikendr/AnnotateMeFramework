"use strict"

module.exports = function(sequelize, DataTypes) {
    var PerformanceHistory = sequelize.define('PerformanceHistory', {
        value: DataTypes.INTEGER,
        isactive: { type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        classMethods: {
            associate: function(models) {
                //Relationship with Player 
                PerformanceHistory.belongsTo(models.Player);

                //Relationship with PerformanceHistoryType
                PerformanceHistory.belongsTo(models.PerformanceHistoryTypes);
            }
        }
    });

    return PerformanceHistory;
}