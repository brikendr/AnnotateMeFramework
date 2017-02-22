"use strict"

module.exports = function(sequelize, DataTypes) {
    var Collocation = sequelize.define('Collocation', {
        collocation_json: { type: DataTypes.STRING, allowNull: false},
        pos_json: { type: DataTypes.STRING, allowNull: false}
    }, {
        classMethods: {
            associate: function(models) {
                //Relation with EntityMention
                Collocation.belongsTo(models.EntityMention);
            }
        }
    });

    return Collocation;
}