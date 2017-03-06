"use strict"

module.exports = function(sequelize, DataTypes) {
    var Candidate = sequelize.define('Candidate', {
        candidate_name: { type: DataTypes.STRING, allowNull: false},
        description: { type: DataTypes.TEXT('long'), allowNull: false},
        schema_type: DataTypes.STRING,
        dbpediaURL: { type: DataTypes.STRING, allowNull: false},
        score: {type: DataTypes.FLOAT, allowNull: false},
        rank: DataTypes.INTEGER,
        total_rank: DataTypes.INTEGER,
        is_correct: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false}
    }, {
        classMethods: {
            associate: function(models) {
                //Relation with EntityType
                Candidate.belongsTo(models.EntityType);

                //Relation with Entity EntityMention
                Candidate.belongsTo(models.EntityMention);

                //Relation with Annotation
                Candidate.hasMany(models.Annotation);
            }
        }
    });

    return Candidate;
}