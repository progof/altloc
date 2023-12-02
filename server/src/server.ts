import express from "express";
import bcrypt from "bcrypt";
import { config } from 'dotenv';
import session from "express-session";
import { pool, saveRefreshToken, getRefreshToken } from './dbConfig.ts';
import flash from "express-flash";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import ejs from "ejs";
import { z } from "zod";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const envSchema = z.object({
  SESSION_SECRET: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  // JWT_SECRET: z.string(),
  APP_PORT: z.string()
});
const env = envSchema.parse(config().parsed);

app.set("view engine", "ejs");

// Custom authentication function
const authenticateUser = async (email, password) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

  if (result.rows.length > 0) {
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

// Middleware
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());

// Custom middleware for authentication
app.use((req, res, next) => {
  if (req.session) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.session.username;
  }
  next();
});


// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/users/dashboard", checkNotAuthenticated, async (req, res) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (accessToken) {
    jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.error(err);

        // Try using the refresh token on access token verification failure
        if (refreshToken) {
          const userId = decodedToken ? decodedToken.userId : null;
          const storedRefreshToken = await getRefreshToken(userId);

          if (refreshToken === storedRefreshToken) {
            // If refresh token matches, create a new access token
            const newAccessToken = generateAccessToken({ userId });
            res.cookie("access_token", newAccessToken, { httpOnly: true, path: "/" });

            // Continue with rendering the dashboard
            const user = await getUserById(userId);
            res.render("dashboard", { user: user ? user.username : null });
          } else {
            // If refresh token does not match, redirect the user to the login page
            res.redirect("/users/login");
          }
        } else {
          // Handle the case when refreshToken is not defined
          res.redirect("/users/login");
        }
      } else {
        // Everything is fine with the access token, continue with rendering the dashboard
        const user = await getUserById(decodedToken.userId);
        res.render("dashboard", { user: user ? user.username : null });
      }
    });
  } else {
    res.redirect("/users/login");
  }
});




// Function to get user information by ID from the database
const getUserById = async (userId) => {
  const selectUserQuery = `
    SELECT * FROM users WHERE user_id = $1;
  `;

  try {
    const result = await pool.query(selectUserQuery, [userId]);
    console.log("Debug [getUserById]: ", result);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
};

app.get("/users/logout", async (req, res) => {
  try {
    if (req.session && req.session.user) {
      const userId = req.session.user.user_id;
      console.log("Debun logout [userId]:", userId);

      // Remove refresh token from the database on logout
      await saveRefreshToken(userId, null);

      res.clearCookie("access_token", { path: "/" });
      res.clearCookie("refresh_token", { path: "/" });

      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          req.flash("error_msg", "Error during logout");
          res.redirect("/");
        } else {
          req.flash("success_msg", "You have logged out successfully");
          res.redirect("/");
        }
      });
    } else {
      req.flash("error_msg", "You are not logged in");
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    req.flash("error_msg", "Error during logout");
    res.redirect("/");
  }
});



app.post("/users/register", async (req, res) => {
  let { username, email, password, password2 } = req.body;
  console.log("(Debug) Data for register: ", {username, email, password, password2});
  
  let errors = [];
  if(!username || !email || !password || !password2){
      errors.push({ message: "Please enter all fields" });
  }

  if(password.length < 6){
      errors.push({ message: "Password should be at least 6 characters" });
  }

  if(password != password2){
      errors.push({ message: "Password do not match" });
  }

  if(errors.length > 0){
      res.render('register', { errors });
  }else{
      // Form validation has passed
      let hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);

      pool.query(
          `SELECT * FROM users WHERE email = $1`, 
          [email], (err, results) => {
              if(err){
                  throw err;
              }
              console.log(results.rows);

              if(results.rows.length > 0){
                  errors.push({ message: "Email already registered" });
                  res.render("register", { errors });
              }else{
                  pool.query(
                      `INSERT INTO users (username, email, password)
                          VALUES ($1, $2, $3)
                          RETURNING user_id, password`,
                      [username, email, hashedPassword],
                      (err, results) => {
                        if (err) {
                          throw err;
                        }
                        console.log(results.rows);
                      //   req.flash("success_msg", "You are now registered. Please log in");
                        res.redirect("/users/login");
                      }
                  );
              }
          }
      );
  }
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await authenticateUser(email, password);

  if (user) {
    const accessToken = generateAccessToken({ userId: user.user_id });
    const refreshToken = generateRefreshToken({ userId: user.user_id });

    console.log("accessToken:", accessToken);
    console.log("refreshToken:", refreshToken); 
    
    // Save refresh token in the database
    await saveRefreshToken(user.user_id, refreshToken);

    res.cookie("access_token", accessToken, { httpOnly: true, path: "/" });
    res.cookie("refresh_token", refreshToken, { httpOnly: true, path: "/" });
    
    req.session.user = user;
    res.redirect("/users/dashboard");
  } else {
    req.flash("error_msg", "Invalid email or password");
    res.redirect("/users/login");
  }
});

function checkAuthenticated(req, res, next) {
  if (req.session && (req.session.user || req.cookies.access_token)) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.session && (req.session.user || req.cookies.access_token)) {
    return next();
  }
  res.redirect("/users/login");
}


app.listen(env.APP_PORT, () => {
  console.log(`Server running on port ${env.APP_PORT}`);
});

// Helper functions to generate tokens
function generateAccessToken(payload) {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}



