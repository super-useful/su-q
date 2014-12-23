var mocha  = require( 'mocha' );
var chai   = require( 'chai' );

var co      = require( 'co' );
var comongo = require( 'co-mongo' );

var proxyDb = require( '../../lib/proxy/db' );

var CONFIG = require( 'config' );

var expect = chai.expect;

suite.skip( 'suq.proxy.db', function() {
	var db;

	suiteSetup( function( done ) {
		co.wrap( function* () {
			db = yield comongo.connect( 'mongodb://127.0.0.1:27017/suq_test' );

			var col = yield db.collection( 'test' );

  			yield col.insert( [
  				{ name : 'simon jefford',         fault : true },
  				{ name : 'christos constandinou', fault : false }
  			] );

			done();
		} )();
	} );

	suiteTeardown( function( done ) {
		co.wrap( function* () {
			yield db.dropDatabase();
			yield db.close();

			done();
		} )();
	} );

	suite( 'takes an database connection configuration, establishes a connection and returns a Proxy wrapper to it', function() {
		test( 'connection/test', function( done ) {
			co.wrap( function* () {
				var db = yield proxyDb( CONFIG.dbs[0] );

				expect( db.server ).to.equal( '127.0.0.1' );
				expect( db.port ).to.equal( 1234 );

				done();
			} )();
		} );

		test( 'connection/mongodb', function( done ) {
			co.wrap( function* () {
				var db = yield proxyDb( {
						access      : { read : { test : true } },
						connection  : { name : 'suq_test' },
						collections : ['test'],
						type        : 'mongodb'
					} );

				expect( yield db.test.count() ).to.equal( 2 );
				expect( ( yield db.test.findOne( { $where : 'this.fault === true' } ) ).name ).to.equal( 'simon jefford' );
				expect( ( yield db.test.findOne( { $where : 'this.fault === false' } ) ).name ).to.equal( 'christos constandinou' );

				done();
			} )();
		} );
	} );
} );
