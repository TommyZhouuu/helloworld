const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'data.json');

let models = [];

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const jsonData = JSON.parse(data);
      models = jsonData.models;
      resolve();
    });
  });
}

function getAllModels() {
  return new Promise((resolve, reject) => {
    if (models.length > 0) {
      resolve(models);
    } else {
      reject("No models found");
    }
  });
}

function getModelById(modelId) {
  return new Promise((resolve, reject) => {
    const foundModel = models.find(m => m.id === modelId);
    if (foundModel) {
      resolve(foundModel);
    } else {
      reject("Unable to find requested model");
    }
  });
}

function getModelsByType(type) {
    return new Promise((resolve, reject) => {
      const foundModels = models.filter(m => m.type.toUpperCase() === type.toUpperCase());
      if (foundModels.length > 0) {
        resolve(foundModels);
      } else {
        reject("Unable to find requested models");
      }
    });
  }

module.exports = { initialize, getAllModels, getModelById, getModelsByType };
