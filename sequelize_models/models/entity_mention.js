"use strict"

module.exports = function(sequelize, DataTypes) {
    var EntityMention = sequelize.define('EntityMention', {
        description: { type: DataTypes.STRING, allowNull: false},
        start_index: DataTypes.INTEGER,
        end_index: DataTypes.INTEGER,
        is_resolved: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
        is_coreferent: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
        coreferent_entity_id: DataTypes.INTEGER,
        ambiguity_threshold: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {

                //Relation with Document
                EntityMention.belongsTo(models.Document);

                //Relation with EntityType
                EntityMention.belongsTo(models.EntityType);
                
                //Relation with Category
                EntityMention.belongsTo(models.Category);

                //Relation with Sentance 
                EntityMention.belongsTo(models.Sentance);

                //Mentions' Candidates 
                EntityMention.hasMany(models.Candidate);

                //Mentions' Annotations
                EntityMention.hasMany(models.Annotation);

                //Mentions' Collocations
                EntityMention.hasMany(models.Collocation);
            }
        }
    });

    return EntityMention;
}