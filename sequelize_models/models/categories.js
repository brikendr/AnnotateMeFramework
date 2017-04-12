"use strict"

module.exports = function(sequelize, DataTypes) {
    var Category = sequelize.define('Category', {
        name: { type: DataTypes.STRING, allowNull: false},
        logo_path: DataTypes.STRING(200),
        isactive: { type: DataTypes.BOOLEAN, defaultValue: true},
        total_entities: {type: DataTypes.INTEGER, defaultValue: 0}
    }, {
        classMethods: {
            associate: function(models) {
                //Category Entity Mentions
                Category.hasMany(models.EntityMention);
            }
        }
    });

    return Category;
}