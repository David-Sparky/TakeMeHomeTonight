angular.module('tmht')
.factory('AuthService', ['$http', '$cookies', '$window',  function ($http, $cookies, $window) { // this does all of the authentication with cas

    var notifications = []; // no notifications - is adjusted

    function getUserStatus() { // gets the users status and informaiton
      return $cookies.get('user');
    }

    function checkSessionStatus(){ // checks the users status to ensure they are in the cookie and session
      return $http({
        method: 'GET',
        url: '/user/checkSessionStatus'
      });
    };

    function removeUser(){ // remove the user and delete the session id
      $cookies.remove('user');
      $cookies.remove('connect.sid');
    }
    
    function getNotifications(){ // return notifications
      return notifications;
    }

    function setNotifications(input){ // set the notifications based on the input
      notifications = input;
    }

    function logout(){ // does the basic logout - deletes the user cookie and session id cookie then sets the user back to the login
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
      getNotifications: getNotifications,
      setNotifications: setNotifications
    });
}]);