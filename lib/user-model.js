const Sequelize = Bloggify.sequelize
    , md5 = require("md5")
    , idy = require("idy")

module.exports = (UserRoles, additionalFields = {}) => {
    UserRoles = UserRoles || {
        USER: "USER",
        ADMIN: "ADMIN"
    }
    const defaultFields = {
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate:  {
                isEmail: {
                    args: [true],
                    msg: "Please provide a valid email address."
                }
            },
            unique: {
                args: true,
                msg: "Email address already in use!"
            }
        },
        confirmed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        password_forgot_token: {
            type: Sequelize.STRING,
            defaultValue () {
                return idy(20)
            }
        },
        confirmation_token: {
            type: Sequelize.STRING,
            defaultValue () {
                return idy(20)
            }
        },
        first_name: {
            type: Sequelize.STRING,
            validate: {
                len: {
                    args: [1, 30],
                    msg: "The first name is invalid."
                }
            }
        },
        last_name: {
            type: Sequelize.STRING,
            validate: {
                len: {
                    args: [1, 30],
                    msg: "The last name is invalid."
                }
            }
        },
        full_name: {
            type: Sequelize.VIRTUAL,
            get () {
                return `${this.first_name} ${this.last_name}`
            }
        },
        phone: Sequelize.STRING,
        country: Sequelize.STRING,
        address_street_line_1: Sequelize.STRING,
        address_street_line_2: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        postal_code: Sequelize.STRING,
        password: {
            type: Sequelize.STRING,
            set (value, key) {
                this.setDataValue(key, md5(value))
            }
        },
        profile_photo: Sequelize.STRING,
        role: {
            type: Sequelize.ENUM(Object.keys(UserRoles).map(c => UserRoles[c])),
        },
        is_admin: {
            type: Sequelize.VIRTUAL,
            get () {
                return this.role === UserRoles.ADMIN
            }
        },
        registration_confirmation_url: {
            type: Sequelize.VIRTUAL,
            get () {
                return `${Bloggify.options.domain}/user/signup?confirmation_code=${this.confirmation_token}`
            }
        }
    }

    Object.keys(additionalFields).forEach(colName => {
        defaultFields[colName] = additionalFields[colName]
    })

    console.log(defaultFields);

    const User = Sequelize.db.define("user", defaultFields, {
        charset: "utf8mb4",
    })
    User.prototype.validPassword = function (pass) {
        return this.password === md5(pass)
    }
    return User
}
