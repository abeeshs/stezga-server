import asyncHandler from 'express-async-handler';
import Meetings from '../model/meetingModel.js';

export const creatMeetingService = asyncHandler(async (data) => {
	const response = await Meetings.create(data);
	return response;
});

export const getMemberDetails = asyncHandler(async (data) => {
	const response = await Meetings.findById(data);

	return response;
});

export const getAllMeetingsService = asyncHandler(async (user) => {
	const allMeetings = await Meetings.find({company_id:user.company_id}).populate('organizer');
	return allMeetings;
});

export const deleteMeetingService = asyncHandler(async (meetingId) => {
	const deletedMessage = await Meetings.findByIdAndDelete(meetingId);
	return deletedMessage;
});

export const updateMeetingService = asyncHandler(async (meetingId, meeting) => {
	const update = await Meetings.findByIdAndUpdate(meetingId, meeting);
	return update;
});
