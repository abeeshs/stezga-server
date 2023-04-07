import asyncHandler from 'express-async-handler';
import * as meetingService from '../services/meetingService.js';

export const addNewMeeting = asyncHandler(async (req, res) => {
  const { name, startDate, endDate, participands, type, description } =
    req.body;
  const newMeeting = {
    organizer: req.user._id,
    event_title: name,
    description: description,
    participands: participands,
    start_date: startDate,
    end_date: endDate,
    type: type,
    company_id: req.user.company_id,
  };

  const createdMeeting = await meetingService.creatMeetingService(newMeeting);
  if (createdMeeting) {
    res.status(201).json({
      status: 'Success',
      message: 'Meeting Created Successfully',
      data: createdMeeting,
    });
  } else {
    throw new Error('Failed to create meetings');
  }
});

export const getMembers = asyncHandler(async (req, res) => {
  const createdMeeting = await meetingService.getMemberDetails(req.body);
  if (createdMeeting) {
    res.status(200).json({ message: 'success', data: createdMeeting });
  } else {
    throw new Error('No members found');
  }
});

export const getAllMeetings = asyncHandler(async (req, res, next) => {
  const allMeetings = await meetingService.getAllMeetingsService(req.user);
  if (allMeetings && allMeetings.length > 0) {
    res.status(200).json({ status: 'Success', meetings: allMeetings });
  } else {
    throw new Error('No meetings found');
  }
});

export const deleteMeeting = asyncHandler(async (req, res, next) => {
  const meetingId = req.params.id;

  const deletedMeeting = await meetingService.deleteMeetingService(meetingId);

  if (deletedMeeting) {
    res.status(201).json({ status: 'Success' });
  } else {
    throw new Error('Meeting deletion failed');
  }
});

export const updateMeeting = asyncHandler(async (req, res, next) => {
  const meetingId = req.params.id;
  const { name, startDate, endDate, participands, type, description } =
    req.body;
  const meeting = {
    organizer: req.user._id,
    event_title: name,
    description: description,
    participands: participands,
    start_date: startDate,
    end_date: endDate,
    type: type,
  };
  const updatedMeeting = await meetingService.updateMeetingService(
    meetingId,
    meeting
  );

  if (updatedMeeting) {
    res.status(201).json({ status: 'Success' });
  } else {
    throw new Error('Meeting deletion failed');
  }
});
