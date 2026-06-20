import Task from '../models/Task.js';

// 1. GET all tasks with Filtering, Search, Pagination, Sorting, and Stats
export const getTasks = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 6, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build Search/Filter Object
    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' }; // Case-insensitive title search
    }
    if (status && status !== 'All Statuses') {
      query.status = status;
    }

    // Pagination Calculation
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting Configuration
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    // Fetch matching data from MongoDB
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total task count for matching query
    const totalTasksCount = await Task.countDocuments(query);

    // Calculate Dashboard Statistics using MongoDB aggregation
    const stats = await Task.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } }
        }
      }
    ]);

    const dashboardStats = stats[0] || { total: 0, pending: 0, inProgress: 0, completed: 0 };

    // Send unified payload response back to React frontend
    res.status(200).json({
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTasksCount / limit),
        totalTasks: totalTasksCount
      },
      stats: dashboardStats
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Create a task (Kept exactly as before)
export const createTask = async (req, res) => {
  const { title, description, status } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }
  if (description.length < 20) {
    return res.status(400).json({ message: 'Description must be at least 20 characters long.' });
  }
  try {
    const newTask = new Task({ title, description, status });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Update a task (Kept exactly as before)
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Delete a task (Kept exactly as before)
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};