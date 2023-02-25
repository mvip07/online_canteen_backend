const getDb = require("../util/db").getDb;
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class User {
    constructor(job, rol, block, image, username, password, lastname, firstname, confirmPassword) {
        this.rol = rol,
        this.job = job;
        this.block = block;
        this.image = image;
        this.username = username;
        this.password = password;
        this.lastname = lastname;
        this.firstname = firstname;
        this.confirmPassword = confirmPassword;
        this.create_date = new Date()
    }

    save() {
        const db = getDb();
        return db.collection("Users").findOne({ username: this.username }).then(user => {
            if (user) console.log("User with this email already exsits!")
            else {
                const hashedPassword = bcrypt.hashSync(this.password, 12);
                return db.collection("Users").insertOne({
                    _id: this._id,
                    rol: this.rol,
                    job: this.job,
                    image: this.image,
                    block: this.block,
                    lastname: this.lastname,
                    username: this.username,
                    password: hashedPassword,
                    firstname: this.firstname,
                    create_date: this.create_date,
                    confirmPassword: this.confirmPassword,
                });
            }
        });
    };

    static getUserDetail(id) {
        const db = getDb();
        return db.collection("Users").findOne({ _id: ObjectId(id) })
            .then(user => {
                return {
                    _id: user._id,
                    rol: user.rol,
                    job: user.job,
                    image: user.image,
                    block: user.block,
                    lastname: user.lastname,
                    username: user.username,
                    firstname: user.firstname,
                    create_date: user.create_date,
                    password: user.confirmPassword,
                }
            }).catch(err => res.status(400).json({ message: "You did Wrong !" }))
    }

    static findUser(username) {
        const db = getDb();
        return db.collection("Users").findOne({ username: username })
            .then(user => user)
    }

    static getUsers() {
        const db = getDb();
        return db.collection("Users").find({}).toArray()
            .then(users => {
                return users.map(user => {
                    return {
                        job: user.job,
                        _id: user._id,
                        rol: user.rol,
                        block: user.block,
                        image: user.image,
                        lastname: user.lastname,
                        username: user.username,
                        firstname: user.firstname,
                        create_date: user.create_date,
                        password: user.confirmPassword,
                    }
                })
            })
            .catch(err =>
                res.status(400).json({ message: "You did Wrong !" }))
    };
}

module.exports = User;