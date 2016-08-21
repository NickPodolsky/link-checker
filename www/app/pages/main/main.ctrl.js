angular.module('app.controllers')

.controller('main.ctrl', [
    //зависимости
    '$scope', '$state', '$apiApp',
    //контроллер
    function ($scope, $state, $apiApp) {

        $scope.form = {
            url: "https://np-app-sample.herokuapp.com/test.html"
        };


        $scope.sendForm = function () {
            $apiApp.sendForm($scope.form).then(
                function (response) {
                    $state.go('progress', {taskId: response.data});
                    //$scope.response = 'Your task id: ' + response.data;
                },
                function (error) {
                    $scope.response = 'Error: ' + error.data;
                    console.log('error: ');
                    console.log(error);
                }
            );
        };

    }]);