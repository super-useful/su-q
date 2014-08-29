var path = require( 'path' );

var mocha = require( 'mocha' );
var chai  = require( 'chai' );

var requireall = require( '../../lib/helpers/requireall' );

var expect = chai.expect;

suite( 'suq.helpers.requireall', function() {
	test( 'returns a the object of a the all a the modules in a the directory, recursively', function( done ) {
		var modules = requireall( path.resolve( process.cwd(), 'lib', 'connection' ) );

		expect( Object.keys( modules ) ).to.deep.equal( ['mongodb', 'mssql', 'postgres', 'test'] );
		expect( Object.keys( modules.mongodb ) ).to.deep.equal( ['collection', 'db', 'query'] );
		expect( Object.keys( modules.test ) ).to.deep.equal( ['collection', 'db', 'query'] );

		done();
	} );
} );
