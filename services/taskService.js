import asyncHandler from 'express-async-handler';
import Tasks from '../model/taskModel.js';

// find all completed task
export const getCompletedTask = asyncHandler(async (userId) => {
	const task = await Tasks.find({
		task_status: 'Completed',
		assigned_to: { $elemMatch: { id: userId } }
	}).populate('created_by');

	return task;
});

// add document of task

export const uploadTaskDocument = asyncHandler(async (taskId, fileName) => {
	const task = await Tasks.findByIdAndUpdate(taskId, { file: fileName });
	return task;
});
