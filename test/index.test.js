var mocha  = require( 'mocha' );
var chai   = require( 'chai' );

var co     = require( 'co' );

var suq    = require( '../' );

var CONFIG = require( 'config' );

var expect = chai.expect;

suite( 'suq', function() {
	test( 'takes an Array of database connection configurations and returns a Proxy for each available database as a getter property', function( done ) {
		co( function* () {
			var dbs = yield suq( CONFIG.dbs );

			var empty = require( '../lib/proxy/empty' );

			expect( dbs.accounting ).to.be.an.object;
			expect( dbs.random ).to.be.an.object;
			expect( dbs.simonisawesome ).to.equal( empty.object );

			expect( dbs.accounting.server ).to.equal( '127.0.0.1' );
			expect( dbs.accounting.port ).to.equal( 1234 );

			expect( dbs.random.server ).to.equal( 'localhost' );
			expect( dbs.random.port ).to.equal( 7890 );

			expect( dbs.simonisawesome.server ).to.be.undefined;
			expect( dbs.simonisawesome.port ).to.be.undefined;
		} )( done );
	} );
} );
