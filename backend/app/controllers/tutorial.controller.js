//tutorial controller: create, findAll, findOne, update, delete, deleteAll, findAllPublished

const db = require("../models");
const Tutorial = db.tutorials;
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

    //create a tutorial
    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        //if req.body.published is false or null, return false
        published: req.body.published ? req.body.published : false
    };

    //save the tutorial
    Tutorial.create(tutorial)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

//retrieve all or by title
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? {title: {[Op.like] : `%${title}%`}} : null;

  Tutorial.findAll({where: condition})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieiving tutorials."
        });
    });
};

//find according to id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findByPk(id)
    .then(data => {
        if(data) {
            res.send(data);
        }
        else {
            res.status(404).send({
                message: `Cannot find Tutorial with id=${id}.`
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Tutorial with id=" + id
        });
    });
};

//update according to id
exports.update = (req, res) => {
  const id = req.params.id;

  Tutorial.update(req.body, {
    where: {id: id}
  })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Tutorial updated successfully."
            });
        }
        else {
            res.send({
                message: `Cannot update Tutorial with id=${id}. Tutorial may not be found or requested body is empty.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updated Tutorial with id=" + id
        });
    });
};

//delete according to the id
exports.delete = (req, res) => {
    const id = req.params.id;

    Tutorial.destroy({
        where: {id : id}
    })
        .then(num => {
            if(num == 1){
                res.send({
                    message: "Tutorial was deleted successfully."
                });
            }
            else {
                res.send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with the id=" + id
            });
        })
};

//delete all
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
        res.send({message: `${nums} Tutorials were deleted successfully`});
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while deleting all tutorials"
        });
    });
};

//find all published
exports.findAllPublished = (req, res) => {
  Tutorial.findAll({where: {published: true} })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving published Tutorials"
        });
    });
};