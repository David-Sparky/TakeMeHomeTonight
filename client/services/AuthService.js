angular.module('tmht')
.factory('AuthService', ['$http', '$cookies', '$window',  function ($http, $cookies, $window) {

    function getUserStatus() {
      return $cookies.get('user');//user;
    }

    function checkSessionStatus(){
      return $http({
        method: 'GET',
        url: '/checkSessionStatus'
      });
    };
    /*
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

    }*/
    function logout(){
      $http({
        method: 'GET',
        url: 'logout'
      })
      .then(function(data){
        console.log(data);
        $cookies.remove('user');
        $window.location = data.data;
      },
      function(err){
        console.log(err);
      });
    };
    /*
    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();
        $cookies.remove('user');
      // return promise object
      return deferred.promise;

    }
*/

    // return available functions for use in controllers
    return ({
      //sLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      //login: login,
      logout: logout
    });
}]);