//Service to interact with the socket library

angular.module('tmht')
.factory('socket', function (socketFactory) {
    var myIoSocket = io.connect('http://localhost:8005');

    var socket = socketFactory({
        ioSocket: myIoSocket
    });

    return socket;
});