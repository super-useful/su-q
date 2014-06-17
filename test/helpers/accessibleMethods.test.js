var mocha  = require( 'mocha' );
var chai   = require( 'chai' );

var accessibleMethods = require( '../../lib/helpers/accessibleMethods' );

var expect = chai.expect;

suite( 'suq.helpers.accessibleMethods', function() {
	test( 'connection/mongodb', function( done ) {
		var methods = accessibleMethods( 'foo', {
			create  : false,
			read    : true,
			update  : { foo : true },
			destroy : { customers : true }
		}, {
			admin   : ['oneAdmin', 'twoAdmin', 'threeAdmin'],
			create  : ['oneCreate', 'twoCreate', 'threeCreate'],
			read    : ['oneRead', 'twoRead', 'threeRead'],
			update  : ['oneUpdate', 'twoUpdate', 'threeUpdate'],
			destroy : ['oneDestroy', 'twoDestroy', 'threeDestroy']
		} );

		expect( methods ).to.deep.equal( {
			oneRead     : true,
			twoRead     : true,
			threeRead   : true,
			oneUpdate   : true,
			twoUpdate   : true,
			threeUpdate : true
		} );

		done();
	} );
} );
