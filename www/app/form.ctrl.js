angular.module('app.controllers')

    .controller('form.ctrl', [
        //зависимости
        '$scope', '$rootScope', '$apiApp',
        //контроллер
        function ($scope, $rootScope, $apiApp) {

            $scope.form = {
                url: "https://dighub.ru"
            };

            $scope.response = "";

            $scope.sendForm = function () {
                $apiApp.sendForm($scope.form).then(
                    function (response) {
                        $scope.response = 'Your task id: ' + response.data;
                        console.log(response.data);
                    },
                    function (error) {
                        $scope.response = 'Error: ' + error.data;
                        console.log('error: ');
                        console.log(error);
                    }
                );
                ;
            };


        }]);