//angular.module('app.templates', []);  // объявляем модуль-контейнер содержащий шаблоны страниц
angular.module('app.controllers', []);  // объявляем модуль-контейнер содержащий контроллеры 
angular.module('app.routes', []); // объявляем модуль-контейнер содержащий пути к элементам приложения

// ПРИЛОЖЕНИЕ
angular.module('form.app',[

    'angularFileUpload',
    'btford.socket-io',
    
    //'app.config.$appConfig',        // общие параметры приложения,
    
    'app.littleHelpers.httpErrorsCatcher', // перехват ошибок протокола,
    
    //'app.directives.appAlert',      // всплывающие сообщения
    //'app.directives.formHelpers',   // вспомогательные директивы дляя форм
    //'app.directives.appPlupload',   // загрузчик файлов
    
    // REST API
    'app.services.$apiApp',
    //'app.services.$oAuth',
    //'app.services.$apiCourses',
    //'app.services.$apiFiles',
    
    // Контроллеры 
    'app.controllers',
    // Маршруты
    'app.routes'   
    ])

// обработчики запросов ===================================================================================
.config(['$httpProvider',function($httpProvider){
    $httpProvider.interceptors.push('httpErrorsCatcher');
}])

// Socket.io ==============================================================================================
.factory('$socketIoSpectatorsCounter', function (socketFactory) {
    return socketFactory({
        ioSocket: io.connect('/spectators-counter', {transports:['websocket']})
    });
});
