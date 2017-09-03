
# bloggify-user-auth

 [![Version](https://img.shields.io/npm/v/bloggify-user-auth.svg)](https://www.npmjs.com/package/bloggify-user-auth) [![Downloads](https://img.shields.io/npm/dt/bloggify-user-auth.svg)](https://www.npmjs.com/package/bloggify-user-auth)

> User management for Bloggify.

## :cloud: Installation

```sh
$ npm i --save bloggify-user-auth
```


## :memo: Documentation


### bloggify:init

#### Params
- **Object** `config`:
  - `signin_url` (String): The sign in url.
  - `signout_url` (String): The sign out url.
  - `signup_url` (String): The sign in url.
  - `success_url` (String): The url to redirect to after signout/signin.
  - `require_confirmation` (String): If `false`, the users will be confirmed by default.
  - `passport` (Object): The `bloggify-passport` configuration.

This module comes with the `User` Sequelize model which you have to expose in your models.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].



## :scroll: License

[MIT][license] © [Bloggify][website]

[license]: http://showalicense.com/?fullname=Bloggify%20%3Csupport%40bloggify.org%3E%20(https%3A%2F%2Fbloggify.org)&year=2017#license-mit
[website]: https://bloggify.org
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
