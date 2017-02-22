"use strict"

module.exports = function(sequelize, DataTypes) {
    var Annotation = sequelize.define('Annotation', {
        is_nil: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
        timespan: DataTypes.DATE
    }, {
        classMethods: {
            associate: function(models) {

                //Relation with Entity Mention
                Annotation.belongsTo(models.EntityMention);

                //Relation with Participant
                Annotation.belongsTo(models.Participant);

                //Relation with Candidate
                Annotation.belongsTo(models.Candidate);
            }
        }
    });

    return Annotation;
}