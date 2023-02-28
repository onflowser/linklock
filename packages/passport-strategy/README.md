# passport-membership

[Passport](http://passportjs.org/) strategy for authenticating with membership protocol.

## Usage

#### Configure Strategy

The custom authentication strategy authenticates users by custom logic of your choosing.
The strategy requires a `verify` callback, which is where the custom logic goes and calls
`done` providing a user. Note that, req is always passed as the first parameter to the 
`verify` callback.

Here is the pseudo code:

```javascript
import passportCustom from 'passport-custom';
const CustomStrategy = passportCustom.Strategy;

passport.use('strategy-name', new CustomStrategy(
  function(req, callback) {
    // Do your custom user finding logic here, or set to false based on req object
    callback(null, user);
  }
));
```

And a basic example:

```javascript
passport.use(new CustomStrategy(
  function(req, done) {
    User.findOne({
      username: req.body.username
    }, function (err, user) {
      done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'custom'` strategy (or whatever you named the strategy upon registration), to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.post('/login',
  passport.authenticate('custom', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);
```

## Tests

    $ npm install
    $ npm test

## Credits

  - [Mike Bell](http://github.com/mbell8903)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014-2015 Mike Bell
