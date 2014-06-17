var mocha  = require( 'mocha' );
var chai   = require( 'chai' );

var co     = require( 'co' );

var proxyConnections = require( '../../lib/proxy/connections' );

var CONFIG = require( 'config' );

var expect = chai.expect;

suite( 'suq.proxy.connections', function() {
	test( 'takes an Array of database connection configurations and returns a Proxy for each available database as a getter property', function( done ) {
		co( function* () {
			var dbs = yield proxyConnections( CONFIG.dbs );

			var empty = require( '../../lib/proxy/empty' );

			expect( dbs.accounting ).to.be.an.object;
			expect( dbs.random ).to.be.an.object;
			expect( dbs.simonisawesome ).to.equal( empty.object );
		} )( done );
	} );
} );
