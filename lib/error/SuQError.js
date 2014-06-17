var copy = require('useful-copy');

function SuQError( message, _props, ssf ) {
	if ( message instanceof Error ) {
		ssf     = _props;
		_props  = {
			stackTrace : Array.isArray( message.stack ) ? message.stack : String( message.stack ).split( '\n' )
		};
		message = message.message;
	}
	else if ( typeof message !== 'string' ) {
		ssf     = _props;
		_props  = message;
		message = '';
	}

	var extend = exclude( 'name', 'message', 'stack', 'constructor', 'toJSON' );
	var props  = extend( _props || {} );

// default values
	if ( typeof message === 'string' ) {
		this.message = message;
	}

// copy from properties
	for (var key in props) {
		this[key] = props[key];
	}

// capture stack trace
	ssf = ssf || arguments.callee;
	if ( ssf && Error.captureStackTrace ) {
		Error.captureStackTrace( this, ssf );
	}
}

SuQError.prototype             = Object.create( Error.prototype );
SuQError.prototype.constructor = SuQError;
SuQError.prototype.name        = 'SuQError';

SuQError.prototype.toJSON = function( stack ) {
	var extend = exclude( 'constructor', 'toJSON', 'stack' );
	var props  = extend( { name : this.name }, this );

	if ( !props.message ) {
		delete props.message;
	}

// include stack if exists and not turned off
	if ( false !== stack && this.stack ) {
		props.stack = this.stack.split('\n');
	}

	return props;
};

function exclude() {
	var excludes = Array.prototype.slice.call( arguments );

	function excludeProps(res, obj) {
		Object.keys( obj ).forEach( function( key ) {
			if ( !~excludes.indexOf( key ) ) {
				res[key] = obj[key];
			}
		} );
	}

	return function extendExclude() {
		var args = Array.prototype.slice.call( arguments );
		var i    = 0;
		var res  = {};

		for ( ; i < args.length; i++ ) {
			excludeProps( res, args[i] );
		}

		return res;
	};
}

module.exports = SuQError;
