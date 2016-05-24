/**
 * Created by Zell on 19/05/2016.
 */

app.controller('cryptoController', ['$scope', 'FileUploader', function ($scope, FileUploader) {
    $scope.uploader = new FileUploader();
    $scope.f = 'hello';
}]);