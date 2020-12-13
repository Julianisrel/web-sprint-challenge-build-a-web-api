const express = require('express');
const projects = require('../data/helpers/projectModel');
const actions = require('../data/helpers/actionModel');
const router = express.Router();


// Project endpoints
router.get('/projects', (req, res, next) => {
    projects.get()
    .then(response => {
        if(response) {
            return res.status(200).json(response)
        } else {
            return res.status(404).json({
                errorMessage: "Could not find the projects"
            })
        }
    })
    .catch(error => {
        next(error)
    })
})

router.get('/projects/:id', validateProjectId(), (req, res) => {
    return res.status(200).json(req.project)
})

router.post('/projects', validatePost(), (req, res, next) => {
    projects.insert(req.body)
    .then(project => {
        return res.status(201).json(project)
    })
    .catch(error => {
        next(error)
    })
})

router.put('/projects/:id', validateProjectId(), validatePost(), (req, res, next) => {
    projects.update(req.params.id, req.body)
    .then(project => {
        if(project) {
            return res.status(200).json(project)
        } else {
            return res.status(400).json({
                message: "The project could not be found"
            })
        }
    })
    .catch(error => {
        next(error)
    })
})

router.delete('/projects/:id', validateProjectId(), (req, res, next) => {
    projects.remove(req.params.id)
    .then(project => {
        if(project > 0) {
            return res.status(200).json({
                message: "The project was deleted"
            })
        } else {
            return res.status(404).json({
                errorMessage: "There was an error deleting the project"
            })
        }
    })
    .catch(error => {
        next(error)
    })
})

// Actions CRUD
router.get('/projects/:id/actions', validateProjectId(), (req, res, next) => {
    return res.status(200).json(req.project.actions)
})

router.get('/projects/:projectid/actions/:id', validateActionId(), (req, res, next) => {
    return res.status(200).json(req.action)
})

router.post('/projects/:id/actions', validateProjectId(), validateAction(), (req, res, next) => {
    actions.insert(req.body)
    .then(action => {
        return res.status(201).json(action)
    })
    .catch(error => {
        next(error)
    })
})

router.put('/projects/:projectid/actions/:id', validateActionId(), validateAction(), (req, res, next) => {
    actions.update(req.params.id, req.body)
    .then(action => {
        if(action) {
            return res.status(200).json(action)
        } else {
            return res.status(400).json({
                message: "The action could not be found"
            })
        }
    })
    .catch(error => {
        next(error)
    })
})

router.delete('/projects/:projectid/actions/:id', validateActionId(), (req, res, next) => {
    actions.remove(req.params.id)
    .then(action => {
        if(action > 0) {
            return res.status(200).json({
                message: "Action was deleted"
            })
        } else {
            return res.status(404).json({
                errorMessage: "There was a problem deleting the action"
            })
        }
    })
    .catch(error => {
        next(error)
    })
})

// Custom Middleware
function validateProjectId() {
    return (req, res, next) => {
    projects.get(req.params.id)
    .then(project => {
        if(project) {
            req.project = project
            next()
        } else {
            return res.status(404).json({
                errorMessage: "Invalid project id"
            })
        }
    })
    .catch(error => {
        next(error)
    })
    }
}

function validateActionId() {
    return (req, res, next) => {
    actions.get(req.params.id)
    .then(action => {
        if(action) {
            req.action = action
            next()
        } else {
            return res.status(404).json({
                errorMessage: "Invalid action id"
            })
        }
    })
    .catch(error => {
        next(error)
    })
    }
}

function validatePost() {
    return (req, res, next) => {
        if(Object.keys(req.body).length === 0) {
            return res.status(400).json({
                errorMessage: "missing project data"
            })
        } else if(!req.body.name) {
            return res.status(400).json({
                errorMessage: "Missing name field"
            })
        } else if(!req.body.description) {
            return res.status(400).json({
                errorMessage: "Missing description field"
            })
        } else {
            next()
        }
    }
}

function validateAction () {
    return (req, res, next) => {
        if(Object.keys(req.body).length === 0) {
            return res.status(400).json({
                errorMessage: "missing action data"
            })
        } else if(!req.body.project_id) {
            return res.status(400).json({
                errorMessage: "Missing project id field"
            })
        } else if(!req.body.description) {
            return res.status(400).json({
                errorMessage: "Missing description field"
            })
        } else if(req.body.description.length > 128){
            return res.status(400).json({
                errorMessage: "Description is too long"
            })
        } else if(!req.body.notes) {
            return res.status(400).json({
                errorMessage: "Missing notes field"
            })
        } else {
            next()
        }
    }
}

module.exports = router;
