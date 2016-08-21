//angular.module('app.templates', []);  // объявляем модуль-контейнер содержащий шаблоны страниц
angular.module('app.controllers', []);  // объявляем модуль-контейнер содержащий контроллеры 
angular.module('app.routes', []); // объявляем модуль-контейнер содержащий пути к элементам приложения

// ПРИЛОЖЕНИЕ
angular.module('linkChecker.app',[

    'btford.socket-io',
    'ui.router',
    
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
.factory('$socketIoConnectToRoom', function (socketFactory) {
    return function(room) {
        this.room = room;
        console.log(this.room);
        return socketFactory({
            ioSocket: io.connect('/'+this.room, {transports: ['websocket']})
        });
    };
})

// Маршрутизация ==========================================================================================
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('main', {
            url: '/',
            templateUrl: 'app/pages/main/main.html',
            controller: 'main.ctrl'
        })
        .state('progress', {
            url: '/progress',
            params: {taskId: null},
            templateUrl: 'app/pages/progress/progress.html',
            controller: 'progress.ctrl',
            onEnter: function($state, $stateParams){if($stateParams.taskId === null){$state.go('main');}}
        });
});