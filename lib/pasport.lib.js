import bcrypt from "bcrypt";
import LocalStrategy from "passport-local";
import { User } from "../models/user.model.js";

const hashPasword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const validatePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

const loginStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (!user || !validatePassword(password, user.password)) {
      return done(null, false);
    }

    done(null, user);
  } catch (err) {
    done(null, false);
  }
});

const registerStrategy = new LocalStrategy(
  { passReqToCallback: true },
  async (req, username, password, done) => {
    try {
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return done(null, false);
      }

      const newUser = {
        username,
        password: hashPasword(password),
      };
      const createdUser = await User.create(newUser);

      req.user = createdUser;

      done(null, createdUser);
    } catch (err) {
      done(null, false);
    }
  }
);

export const passportStrategies = { loginStrategy, registerStrategy };