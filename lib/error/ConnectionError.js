var SuQError = require('./SuQError');

function ConnectionError( connection, ssf ) {
  SuQError.call( this, {
    connection : connection
  }, ssf );
}

ConnectionError.prototype             = Object.create( SuQError.prototype );
ConnectionError.prototype.constructor = ConnectionError;
ConnectionError.prototype.name        = 'ConnectionError';

module.exports = ConnectionError;
