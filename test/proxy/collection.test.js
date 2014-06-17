var mocha  = require( 'mocha' );
var chai   = require( 'chai' );

var co      = require( 'co' );
var comongo = require( 'co-mongo' );

var proxyCollection = require( '../../lib/proxy/collection' );

var CONFIG = require( 'config' );

var expect = chai.expect;

suite( 'suq.proxy.collection', function() {
	var db, col;

	suiteSetup( function( done ) {
		co( function* () {
			db = yield comongo.connect( 'mongodb://127.0.0.1:27017/suq_test' );

			col = yield db.collection( 'test' );

			col.methods = {
				count   : true,
				findOne : true
			};

  			yield col.insert( [
  				{ name : 'simon jefford',         fault : true },
  				{ name : 'christos constandinou', fault : false }
  			] );
		} )( done );
	} );

	suiteTeardown( function( done ) {
		co( function* () {
			yield db.dropDatabase();
			yield db.close();
		} )( done );
	} );

	suite( 'takes an database collection/table, a query parse function and returns a Proxy wrapper to it', function() {
		test( 'connection/mongodb', function( done ) {
			co( function* () {
				var collection = proxyCollection( col, require( '../../lib/connection/mongodb/query' ) );

				expect( yield collection.count() ).to.equal( 2 );
				expect( ( yield collection.findOne( { $where : 'this.fault === true' } ) ).name ).to.equal( 'simon jefford' );
				expect( ( yield collection.findOne( { $where : 'this.fault === false' } ) ).name ).to.equal( 'christos constandinou' );
			} )( done );
		} );
	} );
} );
