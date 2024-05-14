const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        console.log()
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Проект не найден' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { title, subtitle, description, imageUrls } = req.body;
    try {
        const newProject = new Project({
            title: title,
            subtitle: subtitle,
            description: description,
            imageUrls: imageUrls,
        });
        const createdProject = await newProject.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const updateProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updateProject) {
            res.json(updateProject);
        } else {
            res.status(404).json({ message: 'Проект не найден' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await Project.findByIdAndDelete(req.params.id);
        if (result) {
            res.json({ message: 'Проект удален' });
        } else {
            res.status(404).json({ message: 'Проект не найден' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
