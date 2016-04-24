angular.module('tmht')
.factory('AuthService', ['$http', '$cookies',function ($http, $cookies) {

    function getUserStatus() {
      return $cookies.get('Authorization');//user;
    }

    function login(userInput) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/login', userInput)
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            $cookies.put('Authorization', data.access);
            $cookies.put('Location', data.location);
            $cookies.put('user', userInput.username);
            deferred.resolve();
          } else {
            $cookies.put('Authorization', 'none');
            $cookies.remove('user');
            $cookies.remove('Location');
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          //user = false;
          $cookies.remove('Location');
          $cookies.put('Authorization', 'none');
          $cookies.remove('user');
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }
    
    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();
        $cookies.remove('user');
        $cookies.remove('Location');
        $cookies.put('Authorization', 'none');
        //user = false;

      // return promise object
      return deferred.promise;

    }


    // return available functions for use in controllers
    return ({
      //sLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout
    });
}]);