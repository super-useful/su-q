# su-q

is a wrapper around — currently only a few — existing **standard** database connection modules, `mongodb`, `postgresql` and `mssql`, providing a single configuration style for creating connections and a single API for querying databases — **designed for use with [su-apiserver](https://github.com/super-useful/su-apiserver)**.

su-q was designed to enable switching out the underlying database without requiring you to go through all your code to refactor.

**su-q is still a major work in progress, a minimal amount of work has been done, as per the requirements for the project(s), it was designed to be used with.**

## defining database configurations:

database configurations are defined in `yaml` format.

```yaml

    dbs:
      - # type of database you want to connect to; these are directories found in su-q/lib/connection/*
        type: postgres
        connection:
          # safeguard against the potential for changing DB names, especially across environments, by using an alias
          alias: foo
          # the POSTGRES_PORT_5432_TCP_PORT environment variable will take precedence over this
          port: 5432
          # the PG_PASS environment variable will take precedence over this
          pwd: admin
          # the POSTGRES_PORT_5432_TCP_ADDR environment variable will take precedence over this
          server: 127.0.0.1
          # the PG_DB_NAME environment variable will take precedence over this
          name: example_db_1
          # the PG_USER environment variable will take precedence over this
          user: admin
        # collections can be an associative Array defining queries, for relational database connections
        collections:
          my_query_alias_1:
            name: "schema.stored_procedure_1"
            query: "SELECT * FROM {__name__}();"
          my_query_alias_2:
            name: "schema.stored_procedure_2"
            query: "SELECT * FROM {__name__}({param});"
          ...
          my_query_alias_N:
            name: "table_name"
            query: "INSERT INTO {__name__}(col_1, col_2, ..., col_N) VALUES {items};"
      -
        type: mongodb
        connection:
          alias: bar
          port: 27017
          server: 127.0.0.1
          name: example_db_2
          user: admin
        # alternatively, collections can be a regular Array defining mongodb collections
        collections:
          - collection_1
          - collection_2
          ...
          - collection_N

```

## use within su-apiserver

within a [specific version of your API](https://github.com/super-useful/su-apiserver/blob/master/docs/configuring_apis.md) you can include your database configuration — e.g. in a file called `dbs.yaml` — you can then use su-q in your [API specific bootstrap/initialisation](https://github.com/super-useful/su-apiserver/blob/master/docs/configuring_apis.md#api-specific-bootstrapinitialisation) file to create your database connection(s).

```javascript

    var suq = require('su-q');

    // get database configuration as a JavaScript Object
    var CONFIG = require('su-apiserver/lib/utils/config')(__dirname, 'dbs.yaml');

    module.exports = function* app() {
        // create connections
        var db = yield suq(CONFIG.dbs);

        // return connections
        return {
            db : db
        };
    };

```

now you can access the database connections from an incoming request's [koa context](http://koajs.com/#context), via `this.su.api.db.*`.

## executing database queries

based on the [configurations defined above](#defining-database-configurations), you could execute a db query like this:

```javascript

    module.exports = function* query() {
        var su = this.su;
        var db = su.api.db;

        if (su.req.query.db == 'foo') {
            return yield db.foo.my_query_alias_1.query({...});
        }
        else {
            return yield db.bar.collection_2.query({...});
        }
    };

```

**notice** how, if at any time you wanted to change the underlying database, or query, you could do so without the need to also change your code.

### SQL injection attacks

su-q is designed to be used within [su-apiserver](https://github.com/super-useful/su-apiserver). [su-apiserver](https://github.com/super-useful/su-apiserver) uses [su-define-object](https://github.com/super-useful/su-define-object) to [define its endpoint requests](https://github.com/super-useful/su-apiserver/blob/master/docs/defining_endpoints.md#defining-the-endpoint-request). [su-define-object](https://github.com/super-useful/su-define-object) handles all the individual REST and query string parameter type coercion(s), as well as any validation/sanitisation you wish to perform — the freedom and the power is yours.

this will reduce the possibilities for SQL injection attacks — which is why su-q only does simple template interpolation for parsing the SQL statements you have defined — at the same time, since you are responsible for [defining endpoint requests](https://github.com/super-useful/su-apiserver/blob/master/docs/defining_endpoints.md#defining-the-endpoint-request), you should ensure that you are performing the correct level of sanitisation.

**when dealing with `String` types in your [endpoint request definitions](https://github.com/super-useful/su-apiserver/blob/master/docs/defining_endpoints.md#defining-the-endpoint-request) it is always a good idea to remove any unwanted/dangerous characters.** other types like, `Number`, `Date`, etc, will simply not validate correctly or have any extra characters removed when coerced to their correct type.

**alternatively, you can always include an [endpoint interceptor](https://github.com/super-useful/su-apiserver/blob/master/docs/defining_endpoints.md#endpoint-interceptors) that sanitises your parameters after the request is created and before the database query is performed.**

