const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const multer = require('multer');
const app = express();

// MySQL Database Connection
const connection = mysql.createConnection({
  host: 'sql.freedb.tech',
  user: 'freedb_c237_fitfast',
  password: 'JFcx&wB8ZuPGxtc',
  database: 'freedb_fitfast' // Change to your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Enable Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Body Parsing Middleware
app.use(express.urlencoded({ extended: false }));

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/pictures'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Home Route to Display Users, Workout Plans, and Meal Logs
app.get('/', (req, res) => {
  const sqlUsers = 'SELECT * FROM users';
  const sqlWorkoutPlans = 'SELECT * FROM workoutplans';
  const sqlMealLogs = 'SELECT * FROM meallogs';

  connection.query(sqlUsers, (err, users) => {
    if (err) throw err;
    connection.query(sqlWorkoutPlans, (err, workoutPlans) => {
      if (err) throw err;
      connection.query(sqlMealLogs, (err, mealLogs) => {
        if (err) throw err;
        res.render('index', { users, workoutPlans, mealLogs });
      });
    });
  });
});

// Route to Display a Specific User
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  let sqlUser = 'SELECT * FROM users WHERE userId = ?';
  let sqlWorkoutPlans = 'SELECT * FROM workoutplans';
  let sqlUserWorkoutPlans = `
    SELECT wp.* FROM workoutplans wp
    INNER JOIN user_workoutplans uwp ON wp.planId = uwp.planId
    WHERE uwp.userId = ?
  `;

  connection.query(sqlUser, [userId], (err, userResult) => {
    if (err) throw err;
    connection.query(sqlWorkoutPlans, (err, workoutPlansResult) => {
      if (err) throw err;
      connection.query(sqlUserWorkoutPlans, [userId], (err, userWorkoutPlansResult) => {
        if (err) throw err;
        res.render('user', {
          user: userResult[0],
          allWorkoutPlans: workoutPlansResult,
          workoutPlans: userWorkoutPlansResult
        });
      });
    });
  });
});


// Route to Render Add User Form
app.get('/addUser', (req, res) => {
  res.render('addUser');
});


app.post('/addUser', upload.single('image'), (req, res) => {
  let sql = 'INSERT INTO users (name, email, password, phone, address, image) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(sql, [req.body.name, req.body.email, req.body.password, req.body.phone, req.body.address, req.file.filename], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Route to Render Edit User Form
app.get('/editUser/:id', (req, res) => {
  let sql = 'SELECT * FROM users WHERE userId = ?';
  connection.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('editUser', { user: result[0] });
  });
});

// Route to Handle Editing a User
app.post('/editUser/:id', upload.single('img'), (req, res) => {
  let sql;
  let params;
  
  if (req.file) {
    // If a new image is uploaded, update the image as well
    sql = 'UPDATE users SET name = ?, email = ?, password = ?, phone = ?, address = ?, img = ? WHERE userId = ?';
    params = [req.body.name, req.body.email, req.body.password, req.body.phone, req.body.address, req.file.filename, req.params.id];
  } else {
    // If no new image is uploaded, do not update the image field
    sql = 'UPDATE users SET name = ?, email = ?, password = ?, phone = ?, address = ? WHERE userId = ?';
    params = [req.body.name, req.body.email, req.body.password, req.body.phone, req.body.address, req.params.id];
  }

  connection.query(sql, params, (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Route to Handle Deleting a User
app.get('/deleteUser/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE userId = ?';
  connection.query(sql, [userId], (error, results) => {
    if (error) {
      console.error("Error deleting user:", error);
      res.status(500).send('Error deleting user');
    } else {
      res.redirect('/');
    }
  });
});

// Route to Display a Specific Workout Plan
app.get('/workout/:id', (req, res) => {
  let sql = 'SELECT * FROM workoutplans WHERE planId = ?';
  connection.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('workout', { workout: result[0] });
  });
});

// Route to Render Add Workout Plan Form
app.get('/addWorkout', (req, res) => {
  res.render('addWorkout');
});

// Route to Handle Adding a New Workout Plan
app.post('/addWorkout', (req, res) => {
  const { name, difficultyLevel, duration, description } = req.body;
  
  // Check if any of the required fields are missing
  if (!name || !difficultyLevel || !duration || !description) {
    res.status(400).send('All fields are required');
    return;
  }

  let sql = 'INSERT INTO workoutplans (name, difficultyLevel, duration, description) VALUES (?, ?, ?, ?)';
  connection.query(sql, [name, difficultyLevel, duration, description], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Route to Render Edit Workout Plan Form
app.get('/editWorkout/:id', (req, res) => {
  let sql = 'SELECT * FROM workoutplans WHERE planId = ?';
  connection.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('editWorkout', { workout: result[0] });
  });
});

// Route to Handle Editing a Workout Plan
app.post('/editWorkout/:id', (req, res) => {
  let sql = 'UPDATE workoutplans SET name = ?, difficultyLevel = ?, duration = ?, description = ? WHERE planId = ?';
  connection.query(sql, [req.body.name, req.body.difficultyLevel, req.body.duration, req.body.description, req.params.id], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Route to Handle Deleting a Workout Plan
app.get('/deleteWorkout/:id', (req, res) => {
  const planId = req.params.id;
  const sql = 'DELETE FROM workoutplans WHERE planId = ?';
  connection.query(sql, [planId], (error, results) => {
    if (error) {
      console.error("Error deleting workout plan:", error);
      res.status(500).send('Error deleting workout plan');
    } else {
      res.redirect('/');
    }
  });
});

// Route to Display a Specific Meal Log
app.get('/meal/:id', (req, res) => {
  let sql = 'SELECT * FROM meallogs WHERE mealId = ?';
  connection.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('meal', { meal: result[0] });
  });
});

// Route to Render Add Meal Log Form
app.get('/addMeal', (req, res) => {
  res.render('addMeal');
});

// Route to Handle Adding a New Meal Log
app.post('/addMeal', (req, res) => {
  const { name, userId, date, calories, protein, carbs, fat } = req.body;
  
  // Check if any of the required fields are missing
  if (!name || !userId || !date) {
    res.status(400).send('Name, User ID, and Date are required');
    return;
  }

  let sql = 'INSERT INTO meallogs (name, userId, date, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, [name, userId, date, calories, protein, carbs, fat], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Route to Render Edit Meal Log Form
app.get('/editMeal/:id', (req, res) => {
  let sql = 'SELECT * FROM meallogs WHERE mealId = ?';
  connection.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('editMeal', { meal: result[0] });
  });
});

// Route to Handle Editing a Meal Log
app.post('/editMeal/:id', (req, res) => {
  let sql = 'UPDATE meallogs SET name = ?, userId = ?, date = ?, calories = ?, protein = ?, carbs = ?, fat = ? WHERE mealId = ?';
  connection.query(sql, [req.body.name, req.body.userId, req.body.date, req.body.calories, req.body.protein, req.body.carbs, req.body.fat, req.params.id], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Route to Handle Deleting a Meal Log
app.get('/deleteMeal/:id', (req, res) => {
  const mealId = req.params.id;
  const sql = 'DELETE FROM meallogs WHERE mealId = ?';
  connection.query(sql, [mealId], (error, results) => {
    if (error) {
      console.error("Error deleting meal log:", error);
      res.status(500).send('Error deleting meal log');
    } else {
      res.redirect('/');
    }
  });
});
// Route to Render Favorite Workout Plans for a User
app.get('/user/:id/favorites', (req, res) => {
  const userId = req.params.id;
  let sql = `
    SELECT wp.* FROM workoutplans wp
    INNER JOIN user_workoutplans uwp ON wp.planId = uwp.planId
    WHERE uwp.userId = ?
  `;
  connection.query(sql, [userId], (err, result) => {
    if (err) throw err;
    res.render('userFavorites', { workoutPlans: result, userId });
  });
});

// Route to Handle Adding a Favorite Workout Plan for a User
app.post('/user/:id/addFavorite', (req, res) => {
  const userId = req.params.id;
  const planId = req.body.planId;
  let sql = 'INSERT INTO user_workoutplans (userId, planId) VALUES (?, ?)';
  connection.query(sql, [userId, planId], (err, result) => {
    if (err) throw err;
    res.redirect(`/user/${userId}/favorites`);
  });
});

// Route to Render Add Meal for a User
app.get('/user/:id/addMeal', (req, res) => {
  const userId = req.params.id;
  res.render('addMeal', { userId });
});

// Route to Handle Adding a Meal for a User
app.post('/user/:id/addMeal', (req, res) => {
  const userId = req.params.id;
  const { name, date, calories, protein, carbs, fat } = req.body;
  let sql = 'INSERT INTO meallogs (name, userId, date, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, [name, userId, date, calories, protein, carbs, fat], (err, result) => {
    if (err) throw err;
    res.redirect(`/user/${userId}`);
  });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

//23013093 Tan Yong Xiang