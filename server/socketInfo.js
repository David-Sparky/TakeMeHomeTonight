module.exports = function (io) {
  io.sockets.on('connection', function(socket) {
     socket.on('logged in', function(data){
	    if(req.session && req.session.cas_user){
	      socket.join(req.session.cas_user);
	      db.get().collection('users').find({rcs: req.session.cas_user}).toArray(function(err, docs){
	        socket.emit('notifications', {
	          notifications: docs[0].notifications;
	        });
	      });
	    }
	 });
  }
}