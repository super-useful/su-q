var SuQError = require('./SuQError');

function ProxyError( message, ssf ) {
  SuQError.call( this, message, ssf );
}

ProxyError.prototype             = Object.create( SuQError.prototype );
ProxyError.prototype.constructor = ProxyError;
ProxyError.prototype.name        = 'ProxyError';

module.exports = ProxyError;
