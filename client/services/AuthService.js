angular.module('tmht')
.factory('AuthService', ['$http', '$cookies', '$window',  function ($http, $cookies, $window) {

    var notifications = [];

    function getUserStatus() {
      return $cookies.get('user');
    }

    function checkSessionStatus(){
      return $http({
        method: 'GET',
        url: '/user/checkSessionStatus'
      });
    };

    function removeUser(){
      $cookies.remove('user');
      $cookies.remove('connect.sid');
    }
    
    function getNotifications(){
      return notifications;
    }

    function setNotifications(input){
      notifications = input;
    }

    function logout(){
      $http({
        method: 'GET',
        url: 'logout'
      })
      .then(function(data){
        $cookies.remove('user');
        $cookies.remove('connect.sid');
        $window.location = data.data;
      },
      function(err){
        swal("Oops...", "There was an error! "+err.data, "error");
      });
    };

    // return available functions for use in controllers
    return ({
      getUserStatus: getUserStatus,
      checkSessionStatus: checkSessionStatus,
      removeUser: removeUser,
      logout: logout,
      getNotifications,
      setNotifications
    });
}]);