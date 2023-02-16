//recipe controller: create, findAll, findOne, update, delete, deleteAll, findAllPublished

const db = require("../models");
const Recipe = db.recipes;
const Op = db.Sequelize.Op;

//create and save
exports.create = (req, res) => {
    //validate request
    if(!req.body.title){
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    //create a recipe
    const recipe = {
        title: req.body.title,
        description: req.body.description,
        //if req.body.published is false or null, return false
        published: req.body.published ? req.body.published : false
    };

    //save the recipe
    Recipe.create(recipe)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Recipe."
            });
        });
};

//retrieve all or by title
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? {title: {[Op.like] : `%${title}%`}} : null;

  Recipe.findAll({where: condition})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieiving recipes."
        });
    });
};

//find according to id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Recipe.findByPk(id)
    .then(data => {
        if(data) {
            res.send(data);
        }
        else {
            res.status(404).send({
                message: `Cannot find Recipe with id=${id}.`
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Recipe with id=" + id
        });
    });
};

//update according to id
exports.update = (req, res) => {
  const id = req.params.id;

  Recipe.update(req.body, {
    where: {id: id}
  })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Recipe updated successfully."
            });
        }
        else {
            res.send({
                message: `Cannot update Recipe with id=${id}. Recipe may not be found or requested body is empty.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updated Recipe with id=" + id
        });
    });
};

//delete according to the id
exports.delete = (req, res) => {
    const id = req.params.id;

    Recipe.destroy({
        where: {id : id}
    })
        .then(num => {
            if(num == 1){
                res.send({
                    message: "Recipe was deleted successfully."
                });
            }
            else {
                res.send({
                    message: `Cannot delete Recipe with id=${id}. Maybe Recipe was not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Recipe with the id=" + id
            });
        })
};

//delete all
exports.deleteAll = (req, res) => {
    Recipe.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
        res.send({message: `${nums} Recipes were deleted successfully`});
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while deleting all recipe"
        });
    });
};

//find all published
exports.findAllPublished = (req, res) => {
    Recipe.findAll({where: {published: true} })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving published Recipe"
        });
    });
};