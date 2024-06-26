const passport = require("passport");
const userModel = require("../model/user.model");
const { createHash, isValidatePassword } = require("../utils/index");
const GitHubStrategy = require("passport-github2").Strategy;

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.9996e3c363fed191",
        clientSecret: "c91b4e9ca00d80ff98ced4b6c6da871a2f3f5ec7",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const user = await userModel.findOne({ email: profile._json.email });
          const fullname = profile._json.name.split(' ');
          console.log(fullname)
          
          if (!user) {
            let newUser = {
              first_name: fullname[0],
              last_name: fullname[1],
              perfil: profile._json.type.toLowerCase() || "admin",
              password: "",
            };
            let result = await userModel.create(newUser);

            return done(null, result);
          } else{
            return done(null, user);
          }
        } catch (error) {
          return done(`Erro ao obter user ${error}`);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(`Erro ao obter user ${error}`);
    }
  });
};

module.exports = initializePassport;
