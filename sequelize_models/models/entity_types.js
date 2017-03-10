"use strict";

module.exports = function(sequelize, DataTypes) {
    var EntityType = sequelize.define("EntityType", {
        entity_type: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                //Entity Mentions of the type
                EntityType.hasMany(models.EntityMention);

                //Candidate Entities of the type
                EntityType.hasMany(models.Candidate)
            }
        }
    });

    return EntityType;
};