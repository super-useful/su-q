var fs   = require( 'fs' );

var yaml = require( 'js-yaml' );

module.exports= function defaults( file_path ) {
	var DEFAULTS = yaml.safeLoad( fs.readFileSync( file_path, 'utf-8' ) );

	return DEFAULTS;
};
