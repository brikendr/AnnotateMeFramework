"use strict"

module.exports = function(sequelize, DataTypes) {
    var Sentance = sequelize.define('Sentance', {
        description: { type: DataTypes.TEXT('long'), allowNull: false},
        start_index: DataTypes.INTEGER,
        end_index: DataTypes.INTEGER,
        tokens: DataTypes.STRING(500)
    }, {
        classMethods: {
            associate: function(models) {
                //Relation with Document
                Sentance.belongsTo(models.Document);

                //Sentances' entity mentions
                Sentance.hasMany(models.EntityMention);
            }
        }
    });

    return Sentance;
}