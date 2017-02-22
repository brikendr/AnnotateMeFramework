"use strict"

module.exports = function(sequelize, DataTypes) {
    var Keyword = sequelize.define('Keyword', {
        keyword: { type: DataTypes.STRING, allowNull: false}
    }, {
        classMethods: {
            associate: function(models) {
                //Relations with Document 
                Keyword.belongsTo(models.Document);
            }
        }
    });

    return Keyword;
}