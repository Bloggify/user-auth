"use strict";

const Bloggify = require("bloggify");

/**
 * bloggifyUserAuth
 * User management for Bloggify.
 *
 * @name bloggifyUserAuth
 * @function
 * @param {Number} a Param descrpition.
 * @param {Number} b Param descrpition.
 * @return {Number} Return description.
 */
module.exports = (conf, Bloggify, ready) => {
    const passportConfig = Bloggify.options.pluginConfigs["bloggify-passport"] || {};
    passportConfig.login_url = conf.signin_url;
    Bloggify.options.pluginConfigs["bloggify-passport"] = passportConfig;

    const User = Bloggify.models.User;
    if (!User) {
        return ready(new Error("Please define an Sequelize model called 'User'"));
    }

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
    const Passport = Bloggify.pluginLoader.getPlugin("bloggify-passport");
    Passport.init(err => {
        if (err) { return ready(err); }
        ready();
    });
};
