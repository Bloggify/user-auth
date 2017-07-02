## Documentation

You can see below the API reference of this module.

### Plugin Configuration

- **Object** `config`:
  - `signin_url` (String): The sign in url.
  - `signout_url` (String): The sign out url.
  - `signup_url` (String): The sign in url.
  - `success_url` (String): The url to redirect to after signout/signin.
  - `require_confirmation` (String): If `false`, the users will be confirmed by default.

This module comes with the `User` Sequelize model which you have to expose in your models.

