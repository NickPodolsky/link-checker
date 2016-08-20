
var controllersFactory = function(AppConfig, MongoDB){
    return {
        task:    require('./task.js')(MongoDB)
    };
};

module.exports = controllersFactory;