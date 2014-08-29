var path   = require( 'path' );
var mocha  = require( 'mocha' );
var chai   = require( 'chai' );

var co      = require( 'co' );
var comongo = require( 'co-mongo' );

var CONFIG = require( 'config' );
var DEFAULTS = require( '../../../lib/helpers/defaults' )( path.resolve( 'config/postgres.yaml' ) );

var expect = chai.expect;

suite( 'suq.connection.postgres', function() {
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
			co( function* () {
				var db = yield require( '../../../' )( DEFAULTS.dbs );

				var res = yield db.nipple.data_range.query( { premise_id : '2286834006' } );

				res.forEach( function( d ) {
					delete d.date_from;
					delete d.date_to;
				} );

				expect( res ).to.deep.equal( [ {
					account_id: '850042461346',
    				fuelttype: 'G'
    			}, {
    				account_id: '850042461346',
    				fuelttype: 'E'
    			} ] );
			} )( done );
		} );
	} );
} );
