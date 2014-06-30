var mssql  = require( 'mssql' );
var moment = require( 'moment-timezone' );
var func   = require( 'super-func' );

var CONFIG = require( 'config' );

function Schema( config ) {
	this.properties = [];

	var k, p;

	for ( k in config ) {
		if ( Object.prototype.hasOwnProperty.call( config, k ) ) {
			p = {
				id : k
			};

			if ( typeof config[k] === 'string' ) {
				p.type = mssql[config[k]];

				if ( config[k] === 'Date' ) {
					p.format = moment;
				}
			}
			else {
				p.type = mssql[config[k].type]( mssql[config[k].value] );

				if ( config[k].type === 'Date' ) {
					p.format = moment;
				}
			}

			if ( typeof p.format !== 'function' ) {
				p.format = func.identity;
			}

			this.properties.push( p );
		}
	}
}

module.exports   = Schema;
Schema.prototype = {
	constructor : Schema,
	input       : function( request, params ) {
		if ( params && typeof params === 'object' && Object.keys( params ).length ) {
			this.properties.forEach( function( prop ) {
				request.input( prop.id, prop.type, prop.format( params[prop.id] ) );
			} );
		}

		return this;
	}
};
