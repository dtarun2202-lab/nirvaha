const express = require('express');
const router = express.Router();
const CommonProblem = require('../models/CommonProblem');

// GET /api/common-problems - Public endpoint (returns active problems sorted by displayOrder)
router.get('/', async (req, res) => {
  try {
    const problems = await CommonProblem.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    
    const normalizedProblems = problems.map(p => ({
      ...p,
      id: p.id || p._id.toString()
    }));

    res.json({
      success: true,
      problems: normalizedProblems,
      count: normalizedProblems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching problems',
      error: error.message
    });
  }
});

// GET /api/common-problems/all - Admin endpoint (returns all problems sorted by displayOrder)
router.get('/all', async (req, res) => {
  try {
    const problems = await CommonProblem.find()
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    
    const normalizedProblems = problems.map(p => ({
      ...p,
      id: p.id || p._id.toString()
    }));

    res.json({
      success: true,
      problems: normalizedProblems,
      count: normalizedProblems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all problems',
      error: error.message
    });
  }
});

// GET /api/common-problems/:id - Get single problem
router.get('/:id', async (req, res) => {
  try {
    const problem = await CommonProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    res.json({
      success: true,
      problem: {
        ...problem.toObject(),
        id: problem.id || problem._id.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching problem',
      error: error.message
    });
  }
});

// POST /api/common-problems - Create new problem
router.post('/', async (req, res) => {
  try {
    const {
      title,
      icon,
      color,
      bgColor,
      borderColor,
      hoverBg,
      activeBg,
      gradientFrom,
      gradientTo,
      accentColor,
      accentLight,
      modalGradient,
      image,
      description,
      solutions,
      recommendations,
      dropdownSectionTitle,
      dropdowns
    } = req.body;

    if (!title || !icon || !accentColor || !accentLight || !image || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, icon, accentColor, accentLight, image, and description are required'
      });
    }

    const lastProblem = await CommonProblem.findOne().sort({ displayOrder: -1 }).lean();
    const nextOrder = (lastProblem?.displayOrder || 0) + 1;

    const problem = new CommonProblem({
      title,
      icon,
      color: color || 'text-emerald-700',
      bgColor: bgColor || 'bg-emerald-50',
      borderColor: borderColor || 'border-emerald-200',
      hoverBg: hoverBg || 'hover:bg-emerald-50',
      activeBg: activeBg || 'bg-emerald-100',
      gradientFrom: gradientFrom || 'from-emerald-500',
      gradientTo: gradientTo || 'to-teal-400',
      accentColor,
      accentLight,
      modalGradient: modalGradient || 'from-emerald-400 to-teal-400',
      image,
      description,
      solutions: solutions || [],
      recommendations: recommendations || [],
      dropdownSectionTitle: dropdownSectionTitle || 'Why the mind keeps repeating',
      dropdowns: dropdowns || [],
      displayOrder: nextOrder,
      isActive: true
    });

    await problem.save();

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      problem: {
        ...problem.toObject(),
        id: problem.id || problem._id.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating problem',
      error: error.message
    });
  }
});

// PUT /api/common-problems/:id - Update problem
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.createdAt;
    delete updates.updatedAt;

    const problem = await CommonProblem.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.json({
      success: true,
      message: 'Problem updated successfully',
      problem: {
        ...problem.toObject(),
        id: problem.id || problem._id.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating problem',
      error: error.message
    });
  }
});

// DELETE /api/common-problems/:id - Delete problem permanently
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await CommonProblem.findByIdAndDelete(id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.json({
      success: true,
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting problem',
      error: error.message
    });
  }
});

// POST /api/common-problems/reorder - Reorder problems
router.post('/reorder', async (req, res) => {
  try {
    const { problemIds } = req.body;

    if (!Array.isArray(problemIds)) {
      return res.status(400).json({
        success: false,
        message: 'problemIds must be an array'
      });
    }

    const updatePromises = problemIds.map((item, index) => {
      const id = typeof item === 'string' ? item : (item.id || item._id);
      return CommonProblem.findByIdAndUpdate(id, { displayOrder: index, updatedAt: Date.now() });
    });

    await Promise.all(updatePromises);

    const problems = await CommonProblem.find().sort({ displayOrder: 1 });

    res.json({
      success: true,
      message: 'Problems reordered successfully',
      problems: problems.map(p => ({ ...p.toObject(), id: p.id || p._id.toString() }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reordering problems',
      error: error.message
    });
  }
});

module.exports = router;
