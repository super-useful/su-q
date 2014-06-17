var iter = require( 'super-iter' );

module.exports = function accessibleMethods( collection_name, operations, defaults ) {
	return iter.reduce( operations, function( acc, val, operation ) {
		if ( val === true || typeof val === 'object' && val[collection_name] ) {
			defaults[operation].forEach( function( method ) {
				this[method] = true;
			}, acc );
		}

		return acc;
	}, {} );
};
