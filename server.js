/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Xuesong Zhou Student ID:127245223 Date: 4.14.2024
*
*  Published URL: https://github.com/TommyZhouuu/helloworld/tree/master
*
********************************************************************************/
const suvModels = require('./modules/suvModels');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

suvModels.initialize().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}).catch(err => {
  console.error("Failed to initialize models data:", err);
  process.exit(1);
});


app.get('/', (req, res) => res.render('home'));
app.get('/about', (req, res) => res.render('about'));

app.get('/suv/models', async (req, res) => {
  try {
    const models = await (req.query.model ? suvModels.getModelsByType(req.query.model) : suvModels.getAllModels());
    res.render('models', { models });
  } catch (err) {
    res.status(404).render('404', { message: "The requested SUV model cannot be found." });
  }
});

app.get('/suv/models/:modelId', async (req, res) => {
  try {
    const model = await suvModels.getModelById(req.params.modelId);
    res.render('model', { model });
  } catch (err) {
    res.status(404).render('404', { message: "The requested SUV model details could not be found." });
  }
});

app.route('/suv/addModel')
  .get((req, res) => res.render('addModel'))
  .post(async (req, res) => {
    try {
      await suvModels.addModel(req.body);
      res.redirect('/suv/models');
    } catch (err) {
      res.status(500).render('500', { message: `Error adding model: ${err.message}` });
    }
  });

app.route('/suv/editModel/:id')
  .get(async (req, res) => {
    try {
      const model = await suvModels.getModelById(req.params.id);
      model ? res.render('editModel', { model }) : res.status(404).render('404', { message: "Model not found" });
    } catch (err) {
      res.status(500).render('500', { message: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      await suvModels.editModel(req.body.id, req.body);
      res.redirect('/suv/models');
    } catch (err) {
      res.status(500).render('500', { message: `Error updating model: ${err.message}` });
    }
  });

app.get('/suv/deleteModel/:id', async (req, res) => {
  try {
    await suvModels.deleteModel(req.params.id);
    res.redirect('/suv/models');
  } catch (err) {
    res.status(500).render('500', { message: `Error deleting model: ${err.message}` });
  }
});

app.use((req, res) => res.status(404).render('404', { message: "Sorry, we can't find that page!" }));

