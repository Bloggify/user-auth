"use strict";

/**
 * @name bloggify:init
 * @param {Object} config
 *
 *   - `signin_url` (String): The sign in url.
 *   - `signout_url` (String): The sign out url.
 *   - `signup_url` (String): The sign in url.
 *   - `success_url` (String): The url to redirect to after signout/signin.
 *   - `require_confirmation` (String): If `false`, the users will be confirmed by default.
 *   - `passport` (Object): The `bloggify-passport` configuration.
 *
 * This module comes with the `User` Sequelize model which you have to expose in your models.
 */
module.exports = conf => {
    const passportConfig = conf.passport || {};
    passportConfig.login_url = conf.signin_url;

    const User = Bloggify.models.User;
    if (!User) {
        return Promise.reject(new Error("Please define an Sequelize model called 'User'"));
    }

    passportConfig.verify_callback = (email, password, cb) => {
	User.findOne({
	    where: {
		email
	    }
	}).then(user => {
	    if (!user || !user.validPassword(password)) {
		return cb(new Error("Invalid username or password."));
	    }
	    if (!user.confirmed) {
		return cb(new Error("The registration of this user is not confirmed."));
	    }
	    process.nextTick(() => {
		cb(null, user);
	    });
	}).catch(err => cb(err));
    };

    // Init bloggify passport
    return Bloggify.initPlugin("bloggify-passport", passportConfig).then(() => {
        // Set up the endpoints
        Bloggify.server.before(conf.signout_url, (ctx, cb) => {
            if (!ctx.user) {
                return ctx.redirect(conf.signin_url);
            }
            cb();
        });

        Bloggify.server.before(conf.signout_url, "post", (ctx, cb) => {
            ctx.destroySession();
            ctx.redirect(conf.success_url);
        });

        // Check for already authenticated
        Bloggify.server.before(conf.signup_url, (ctx, cb) => {
            if (ctx.user) {
                return ctx.redirect(conf.success_url);
            }
            cb();
        });

        // Confirmation code
        Bloggify.server.before(conf.signup_url, (ctx, cb) => {
            const code = ctx.query.confirmation_code;
            if (code) {
                return users.activateUserByCode(code).then(() => {
                    ctx.redirect("/user/signin");
                });
            }
            cb();
        });

        Bloggify.server.before(conf.signup_url, "post", (ctx, cb) => {
            if (!conf.require_confirmation) {
                ctx.data.confirmed = true;
            }
            User.create(ctx.data).then(newUser => {
                ctx.redirect(conf.signin_url);
            }).catch(err => {
                ctx.signupError = err;
                cb();
            });
        });
    })
};
