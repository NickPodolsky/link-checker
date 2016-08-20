angular.module('app.services.$apiApp',[
    //'app.config.$appConfig' // общие настройки приложения
])
//
// Node.js app api service
//
.factory('$apiApp', ['$http', '$rootScope',
function($http, $rootScope) {

    //** service name
    var serviceName = '$apiApp';

    var api = {};

    // Send form data (without file) on server
    api.sendForm = function(form){
        return $http({
            method: 'POST',
            url: '/check',
            data: form
        });
    };


    //
    //** Public service interface **
    // 
    var service = {};
        
    service.sendForm = function(form){
        return api.sendForm(form);
    };

    return service;
    
}]);





