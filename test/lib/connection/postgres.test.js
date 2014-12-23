var path   = require( 'path' );
var mocha  = require( 'mocha' );
var chai   = require( 'chai' );

var co      = require( 'co' );
var comongo = require( 'co-mongo' );

var CONFIG = require( 'config' );
var DEFAULTS = require( '../../../lib/helpers/defaults' )( path.resolve( 'config/postgres.yaml' ) );

var expect = chai.expect;

suite.skip( 'suq.connection.postgres', function() {
	var db, col;

//	suiteSetup( function( done ) {
//		co( function* () {
//			db = yield comongo.connect( 'mongodb://127.0.0.1:27017/suq_test' );
//
//			col = yield db.collection( 'test' );
//
//			col.methods = {
//				count   : true,
//				findOne : true
//			};
//
//  			yield col.insert( [
//  				{ name : 'simon jefford',         fault : true },
//  				{ name : 'christos constandinou', fault : false }
//  			] );
//		} )( done );
//	} );
//
//	suiteTeardown( function( done ) {
//		co( function* () {
//			yield db.dropDatabase();
//			yield db.close();
//		} )( done );
//	} );

	suite( 'takes an database collection/table, a query parse function and returns a Proxy wrapper to it', function() {
		test( 'connection/postgres', function( done ) {
			co.wrap( function* () {
				var db = yield require( '../../../' )( DEFAULTS.dbs );

				var res = yield db.nipple.data_range.query( { premise_id : '2286834006' } );

				res.forEach( function( d ) {
					delete d.date_from;
					delete d.date_to;
				} );

				expect( res ).to.deep.equal( [ {
					account_id: '850042461346',
    				fuel_type: 'G'
    			}, {
    				account_id: '850042461346',
    				fuel_type: 'E'
    			} ] );

				done();
			} )();
		} );
	} );

	suite( 'takes a query requiring a json object, then parses, jsonifies and interpolates it correctly , and returns expected results', function() {
		test( 'connection/postgres', function( done ) {
			co.wrap( function* () {
				var db = yield require( '../../../' )( DEFAULTS.dbs );

				var an_object = {
					s: "string",
					n: 42,
					o: { 'foo': 'bar' },
					a: [1,2,3]
				};

				var res = yield db.nipple.json_column.query( { an_object: an_object } );

				expect( res.length ).to.equal( 1 );
				expect( typeof res[0].col1  ).to.equal( "string" );
				expect( function() { JSON.parse(res[0].col1); }).to.not.throw();
				expect( JSON.parse(res[0].col1) ).to.deep.equal( an_object );

				done();
			} )();
		} );
	} );
} );
