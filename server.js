/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Xuesong Zhou Student ID: 127245223 Date: 2024/03/01
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/
const express = require('express');
const path = require('path');
const suvModels = require('./modules/suvModels'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

suvModels.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to initialize models data:", err);
  process.exit(1);
});

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

// About route
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/suv/models', async (req, res) => {
  try {
    const type = req.query.model;
    const models = type ? await suvModels.getModelsByType(type) : await suvModels.getAllModels();
    res.json(models);
  } catch (err) {
    res.status(404).send(err);
  }
});


app.get('/suv/models/:modelId', async (req, res) => {
  try {
    const model = await suvModels.getModelById(req.params.modelId);
    res.json(model);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});
