var co = require( 'co' );

module.exports = function* () {
	return yield function( done ) {
		done( null, { bills : {
			findOne : function() {
				return { value : 1 };
			}
		} } );
	};
};
