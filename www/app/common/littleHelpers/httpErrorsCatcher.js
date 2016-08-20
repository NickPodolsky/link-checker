angular.module('app.littleHelpers.httpErrorsCatcher',[])

.factory('httpErrorsCatcher',['$q','$rootScope',function($q,$rootScope){
        return {
            responseError: function(response){
                var message = '';
                // если существует response.data.code, то используем его, так как он точнее указыввает на причину ошибки
                var errorCode = (response.data && response.data.code) ? response.data.code : response.status;
                switch (errorCode){
                    case 0: 
                        message = 'Не удается отправить запрос по адресу <b>"' + response.config.url +'"</b> из-за CORS-ограничений.';
                        break;
                    case 400:
                        message = 'Ошибка в отправленных данных.';
                        break;
                    // специальные коды ошибок
                    case 470:
                        message = 'Переданные значения не валидны';
                        break;
                    case 471:
                        message = 'Неверный логин или пароль';
                        break;
                    case 472:
                        message = 'Нельзя создать дублирующую запись';
                        break; 

                    case 401: 
                        message = 'Вы не аутентифицированы';
                        break;
                    case 403: 
                        message = 'Доступ запрещен';
                        break;                        
                    case 404: 
                        message = 'Запрошенный адрес <b>«' + response.config.url + '» не существует</b>.';
                        break;                       
                    case 500:
                        message = 'Непредвиденная <b>ошибка сервера</b>. Попробуйте повторить запрос чуть позже.';
                        break; 
                    default:
                        message = 'Запрос по адресу <b>«' + response.config.url + '»</b> завершился с ошибкой.';
                        break;                           
                }
                $rootScope.$broadcast('http:error',{code: errorCode, message: message, data: response.data});

                return $q.reject(response);
            }
        };
}]);

