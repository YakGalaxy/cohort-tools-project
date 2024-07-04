const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cohortData = require("./cohorts.json");
const studentData = require("./students.json");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017")
  .then((x) => console.log("Connect to the database", x.connections[0].name))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// Students Routes

app.get("/api/students", (req, res) => {
  res.json(studentData);
});

app.get("/api/students/cohort/:cohortId", (req, res) => {});

app.get("/api/students/:studentId", (req, res) => {
  const studentId = req.params.id;
  Student.findById(studentId)
    .then((oneStudent) =>{
      res.json(oneStudent)
    })
    .catch((err) =>{
      console.error("Failed to get one student", err)
      res.status(500).json({ err: err })
    })
});

app.post("/api/students", (req, res) => {
  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    cohort: req.body.cohort,
    projects: req.body.projects
  })
  .then((createdStudent) =>{
    console.log("Student created ->", createdStudent)
    res.json(createdStudent)
  })
  .catch((err) => {
    console.error("Failed to create a student", err)
    res.status(500).send({ err:err})
  })
});

app.put("/api/students/:studentId", (req, res) => {});

app.delete("/api/students/:studentId", (req, res) => {
  const studentId = req.params.id;
  
  Student.findByIdAndDelete(studentId)
  .then((result) => {
    console.log("result", result)
    res.status(204).send();
  })
  .catch((err) => {
    console.error("Failed to delete one student", err)
    res.status(500).json({ err:err})
  })
});

// Cohort Routes

app.post("/api/cohorts", (req, res) => {
  Cohort.create({
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    format: req.body.format,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    inProgress: req.body.inProgress,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours,
  })
    .then((createdCohort) => {
      console.log("Cohort created ->", createdCohort);
      res.status(201).json(createdCohort);
    })
    .catch((error) => {
      console.error("Error while creating the cohort ->", error);
      res.status(500).json({ error: "Failed to create the cohort" });
    });
});

app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts ->", cohorts);
      res.status(200).json(cohorts);
    })
    .catch((error) => {
      console.log("Error while retrieving cohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});

app.get("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = req.params.id;
  Cohort.findbyId(cohortId)
    .then((cohort) => {
      console.log("Retrieved cohort ->", cohort);
      res.status(200).json(cohort);
    })
    .catch((error) => {
      console.error("Errror retrieving cohort ->", error);
      res.status(500).json({ error: "Failed to retrieve cohort" });
    });
});

app.put("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = req.params.id;
  Cohort.findbyIdAndUpdate(cohortId, req.body, {})
    .then((updatedCohort) => {
      console.log("Updated cohort ->", updatedCohort);
      res.status(204).json(updatedCohort);
    })
    .catch((error) => {
      console.error("Errror while updating the cohort ->", error);
      res.status(500).json({ error: "Failed to update thee cohort" });
    });
});

app.delete("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = req.params.id;
  Cohort.findbyIdAndDelete(cohortId, req.body, {})
    .then((result) => {
      console.log("Cohort deleted!");
      res.status(204).send();
    })
    .catch((error) => {
      console.error("Errror while deleting the cohort ->", error);
      res.status(500).json({ error: "Deleting cohort failed!" });
    });
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
