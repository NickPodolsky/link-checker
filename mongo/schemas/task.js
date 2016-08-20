var Mongo = require('mongoose');

var schema = new Mongo.Schema({
    requestedSiteUrl:    {
                    type: String,
                    required: true
                },
    destinationSiteUrl:    {
                type: String
                },
    pageBody:   { type: String },
    links:      [{
                    url:        String,
                    rawUrl:     String,
                    xpath:      String,
                    position:   Object,
                    httpCode:   String,
                    broken:     Boolean
                }],
    result:     {
                    total:      {type: Number, default: 0},
                    checked:    {type: Number, default: 0},
                    broken:     {type: Number, default: 0}
                },
    created:    {type: Date, default: Date.now},
    finished:   {type: Date, default: null},
});


// Создаем пользователя из данных от сервиса авторизации
schema.statics.createFromOAuthProfile = function(profile, oauthService){
    var record = {
        name:       profile.name,
        email:      profile.email,
        avatar:     profile.avatar,
        sex:        profile.sex,
        birthday:   profile.birthday,
        oauth:      {}
    };
    record.oauth[oauthService.name] = {
        id:         oauthService.id,
        token:      oauthService.token,
        expires:    oauthService.expires
    };
    newPerson = new this(record);
    return newPerson.save().then(function(person){return person});
};

// Ищем пользователя по названию сервиса авторизации и номеру его учетной записи в нем
schema.statics.findByOAuthId = function(serviceName, userId) {
    var query = {};
    var fieldName = 'oauth.' + serviceName + '.id';
    query[fieldName] = userId;
    console.log('===QUERY');
    console.log(query);
    return this.findOne(query)
        .then(function(person){
            console.log('===PERSON BY OAUTH ID: ');
            console.log(person);
            return person;
        });
};

// Обновляем реквизиты доступа к сервису авторизации в профиле пользователя
schema.statics.updateOAuthCredentials = function(  recordId, oauthService){
    var value = {};
    value['oauth.'+oauthService.name] = {
        id:         oauthService.id,
        token:      oauthService.token,
        expires:    oauthService.expires
    };
    console.log('===UPDATE OAUTH: ');
    console.log(value);
    return this.findOneAndUpdate({_id: recordId}, {$set: value}, {new: true})
        .then(function(updatedRecord){
            return updatedRecord;
        });
};

module.exports = schema; 

