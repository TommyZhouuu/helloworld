require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

const Model = sequelize.define('Model', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    model: Sequelize.STRING,
    description: Sequelize.STRING,
    type: Sequelize.STRING
}, {
    timestamps: false 
});

function initialize() {
    return sequelize.sync().then(() => {
        console.log("Database synced");
    }).catch(err => {
        console.error("Failed to initialize the database:", err);
        throw err; 
    });
}


function getAllModels() {
    return Model.findAll();
}

function getModelById(modelId) {
    return Model.findByPk(modelId).then(model => {
        if (!model) {
            throw new Error('Model not found');
        }
        return model;
    });
}

function getModelsByType(type) {
    return Model.findAll({
        where: {
            type: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('type')), '=', type.toLowerCase())
        }
    });
}

function addModel(modelData) {
  return Model.create({
      model: modelData.model,
      description: modelData.description,
      type: modelData.type
  });
}

function editModel(id, modelData) {
  return Model.update({
      model: modelData.model,
      description: modelData.description,
      type: modelData.type
  }, {
      where: { id: id }
  })
  .then(result => {
      if (result[0] === 0) {
          throw new Error('No model found with this ID or no change was made.');
      }
  })
  .catch(err => {
      throw err;
  });
}


function deleteModel(id) {
  return Model.destroy({
      where: { id: id }
  }).then(count => {
      if (count === 0) {
          throw new Error('No model found with this ID.');
      }
  });
}

module.exports = { initialize, getAllModels, getModelById, getModelsByType, addModel, editModel, deleteModel };
