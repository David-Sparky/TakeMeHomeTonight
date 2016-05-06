//Service to interact with the socket library
angular.module('tmht')
.factory('socket', function (socketFactory) { // this is the basic socket information for the app - this is where it emits all of the notifications to.
    var myIoSocket = io.connect('https://takemehometonight.herokuapp.com',{secure:true});

    var socket = socketFactory({
        ioSocket: myIoSocket
    });

    return socket;
});