var path = require( 'path' );

var mocha = require( 'mocha' );
var chai  = require( 'chai' );

var defaults = require( '../../lib/helpers/defaults' );

var expect = chai.expect;

suite( 'suq.helpers.defaults', function() {
	test( 'loads a the yaml file as a the JSON', function( done ) {
		var DEFAULTS = defaults( path.resolve( process.cwd(), 'lib', 'connection', 'test', 'config.yaml' ) );

		expect( DEFAULTS ).to.deep.equal( {
			connection : {
				port   : 1234,
				server : '127.0.0.1'
			},
			access     : {
				read   : [
					'aggregate',
					'count',
					'distinct',
					'find',
					'findOne',
					'group',
					'geoNear',
					'geoHaystackSearch',
					'mapReduce'
				],
				update : [
					'findAndModify',
					'update'
				]
			}
		} );

		done();
	} );
} );
