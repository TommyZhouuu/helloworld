/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Xuesong Zhou Student ID:127245223 Date: 3.24.2024
*
*  Published URL: https://github.com/TommyZhouuu/helloworld/blob/main/server.js
*
********************************************************************************/
const suvModels = require('./modules/suvModels');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

suvModels.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to initialize models data:", err);
  process.exit(1);
});

app.get('/', (req, res) => {
  res.render('home'); 
});

app.get('/about', (req, res) => {
  res.render('about'); 
});

app.get('/suv/models', async (req, res) => {
  try {
    const type = req.query.model;
    const models = type ? await suvModels.getModelsByType(type) : await suvModels.getAllModels();
    res.render('models', { models: models }); 
  } catch (err) {
    res.status(404).render('404', { message: "The requested SUV model cannot be found." });
  }
});

app.get('/suv/models/:modelId', async (req, res) => {
  try {
    const model = await suvModels.getModelById(req.params.modelId);
    res.render('model', { model: model }); 
  } catch (err) {
    res.status(404).render('404', { message: "The requested SUV model details could not be found." });
  }
});

app.use((req, res) => {
  res.status(404).render('404', { message: "Sorry, we can't find that page!" }); 
});
