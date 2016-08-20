var Mongo   = require('mongoose');
var UUID    = require('node-uuid');

var schema = new Mongo.Schema({
    personId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true,
    }
});

schema.statics.create = function(personId){
    var item = {
        personId: personId,
        token: UUID.v1().replace(/-/g, ''),
        expires: null
    };
    var token = new this(item);
    return token.save().then(function(record){return record;})
};

module.exports = schema;
