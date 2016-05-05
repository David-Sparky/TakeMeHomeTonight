//Service to interact with the socket library
angular.module('tmht')
.factory('socket', function (socketFactory) {
    var myIoSocket = io.connect('https://takemehometonight.herokuapp.com',{secure:true});

    var socket = socketFactory({
        ioSocket: myIoSocket
    });

    return socket;
});