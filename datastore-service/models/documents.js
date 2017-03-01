"use strict"

module.exports = function(sequelize, DataTypes) {
    var Document = sequelize.define('Document', {
        path:  { type: DataTypes.STRING, allowNull: false},
        content: { type: DataTypes.TEXT('long'), allowNull: false},
        dataset: DataTypes.STRING(45),
        total_entries: {type: DataTypes.INTEGER, defaultValue: 0},
        total_linked_entities: {type: DataTypes.INTEGER, defaultValue: 0},
        total_nil_entities: {type: DataTypes.INTEGER, defaultValue: 0},
        total_non_entities: {type: DataTypes.INTEGER, defaultValue: 0},
        length_index: DataTypes.INTEGER,
        nr_characters: DataTypes.INTEGER,
        is_resolved: DataTypes.BOOLEAN  
    }, {
        classMethods: {
            associate: function(models) {
                //Documents' Keywords
                Document.hasMany(models.Keyword);

                //Documents' Sentances
                Document.hasMany(models.Sentance);

                //Documents' EntityMentions
                Document.hasMany(models.EntityMention)
            }
        }
    });

    return Document;
}