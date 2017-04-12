"use strict"

module.exports = function(sequelize, DataTypes) {
    var Shoutout = sequelize.define('Shoutout', {
        acknoledged: {type: DataTypes.BOOLEAN, defaultValue: false},
        isactive: { type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        classMethods: {
            associate: function(models) {
                //Relationship with Player (Challenger)
                Shoutout.belongsTo(models.Player, {as: 'from'});
                
                //Relationship with Player (Challengee)
                Shoutout.belongsTo(models.Player, {as: 'to'});

            }
        }
    });

    return Shoutout;
}