var MongoClient = require('mongodb').MongoClient // this is the basic mongodb connection

var state = {
  db: null,
}

exports.connect = function(url, done) { /// this can be called to open a connection to the database
  if (state.db) return done()

  MongoClient.connect(url, function(err, db) { // does the actual connection
    if (err) return done(err)
    state.db = db //sets the database state
    done()
  })
}

exports.get = function() { // returns the state
  return state.db
}

exports.close = function(done) { // closes out the connection
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}