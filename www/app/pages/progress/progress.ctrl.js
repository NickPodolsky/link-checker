angular.module('app.controllers')

.controller('progress.ctrl', [
    //зависимости
    '$scope', '$state', '$stateParams', '$socketIoConnectToRoom',
    //контроллер
    function ($scope, $state, $stateParams, $socketIoConnectToRoom) {

        $scope.form = {
            url: "PROGRESS FORM"
        };
        $scope.status       = '';
        $scope.result       = {total: '-', checked: '-',  broken: '-', percent: 0};
        $scope.brokenLinks  = [];
        $scope.goodLinks    = [];

        $scope.finished = false;

        $scope.taskChannel = new $socketIoConnectToRoom($stateParams.taskId);
        $scope.taskChannel.on('status',function(message){
            console.log('STATUS', message);
            $scope.status = message;
        });
        $scope.taskChannel.on('progress',function(message){
            if($scope.finished)
                return;
            console.log('PROGRESS', message);
            $scope.result = message.total;
            $scope.result.percent = Math.round($scope.result.checked/$scope.result.total*100);
            if(message.item.broken)
                $scope.brokenLinks.unshift(message.item);
            else
                $scope.goodLinks.unshift(message.item);
        });
        $scope.taskChannel.on('result',function(message){
            $scope.finished = true;
            console.log('RESULT', message);
            $scope.result = message.total;
            $scope.result.percent = Math.round($scope.result.checked/$scope.result.total*100);
            $scope.brokenLinks = [];
            $scope.goodLinks = [];
            message.items.forEach(function(item){
                if(item.broken)
                    $scope.brokenLinks.unshift(item);
                else
                    $scope.goodLinks.unshift(item);
            });
        });

    }]);