var fs   = require( 'fs' );
var path = require( 'path' );

var re = /\.[Jj][Ss](?:[Oo][Nn]){0,1}$/;

function requireall( root_path ) {
	var modules = {};

	fs.readdirSync( root_path ).reduce( function( acc, file ) {
		var file_path = path.resolve( root_path, file );

		if ( fs.statSync( file_path ).isDirectory() ) {
			acc[file] = requireall( file_path );
		}
		else if ( re.test( file ) ) {
			acc[path.basename( file_path ).split( '.' ).slice( 0, -1 ).join( '.' )] = require( file_path );
		}

		return acc;
	}, modules );


	return modules;
};

module.exports = requireall;
