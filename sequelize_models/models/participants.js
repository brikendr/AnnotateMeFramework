"use strict"

module.exports = function(sequelize, DataTypes) {
    var Participant = sequelize.define('Participant', {
        name: { type: DataTypes.STRING, allowNull: false},
        start_timespan: DataTypes.DATE,
        end_timespan: DataTypes.DATE
    }, {
        classMethods: {
            associate: function(models) {
                //Participants' annotations
                Participant.hasMany(models.Annotation);
            }
        }
    });

    return Participant;
}