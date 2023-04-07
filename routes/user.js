import express from 'express';
const router = express.Router();
import fs from 'fs';
import * as userController from '../controller/userController.js';
import * as contactController from '../controller/contactController.js';
import * as taskController from '../controller/taskController.js';
import * as dealController from '../controller/dealController.js';
import * as chatController from '../controller/chatController.js';
import * as meetingController from '../controller/meetingController.js';
import { userProtect } from '../middleware/authMiddleware.js';
// import multer from 'multer'
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3, upload } from '../config/multer.js';

// router.get('/',userController.userLogin)

//================== SIGNUP ================
router.post('/', userController.userLogin);
router.post('/signup', userController.userRegister);
router.post('/signup-validate', userController.checkUserExist);
router.post('/signup/sent-otp', userController.sendEmailOtp);
router.post('/signup/verify-otp', userController.varifySignUpOtp);
router.post('/logout', userController.userLogOut);
router.post('/otp-login', userController.otpLogin);
router.post('/varify-otp', userController.varifyOtp);

//==================== TASK =====================

router.delete('/task/delete-task/:id', taskController.deleteTask);
//Edit Task
router.put('/task/edit-task/:id', taskController.editTask);
// Download files

router.get('/download/:filename', async (req, res) => {
  console.log(process.env.BUCKET, req.params.filename);

  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: req.params.filename,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  res.status(200).json({ status: 'Success', url });
});
router.post('/users/user-login', userController.allowNewUser);

router.use(userProtect);

//View task
router.get('/task', taskController.getAllTask);
//pending task
router.get('/task/pending-task', taskController.getPendingTask);
//completed task
router.get(
  '/task/completed-task',

  taskController.getAllCompletedTask
);
//Create tasks
router.post('/task/add-task', taskController.createNewTask);
//Delete Task

//Change Task Status
router.put('/task/task-verify/:id', taskController.verifyTask);

router.put('/task/complete-task/:id', taskController.completeTask);

router.post(
  '/task/upload-file/:id',
  upload.single('file'),
  taskController.uploadTaskFile
);

//================== CONTACTS ====================

//view -Contacts
router.get('/contacts', contactController.getAllContact);
//create contacts
router.post(
  '/contacts/add-contact',

  contactController.addNewContact
);
//delete contacts
router.delete('/contacts/delete-contact/:id', contactController.deleteContact);
//Edit contacts
router.put(
  '/contacts/edit-contact/:id',

  contactController.editContact
);

// ================= USERS =======================

//view all users
router.get('/users', userController.viewAllUser);
//Edit contacts
router.put(
  '/contacts/edit-contact/:id',

  contactController.editContact
);

// ================= DEALS =======================

//View all deals
router.get('/deals', dealController.getAllDeals);
//Create deals
router.post('/deals/create-deal', dealController.addNewDeal);
//Update Deal
router.put('/deals/update-deal/:id', dealController.updateDeal);

//================= CONVERSATION =======================

router.post('/conversation/chat', chatController.createChat);
router.get('/conversation/chat', chatController.getchats);
router.get('/conversation/users', chatController.searchUser);
router.post('/conversation/message', chatController.sendMessage);
router.get(
  '/conversation/message/:chatId',

  chatController.allMessage
);

//================= MEETINGS =================
router.get('/meetings', meetingController.getAllMeetings);
router.post(
  '/meetings/create-meeting',

  meetingController.addNewMeeting
);
router.delete(
  '/meetings/delete-meeting/:id',

  meetingController.deleteMeeting
);
router.put(
  '/meetings/update-meeting/:id',

  meetingController.updateMeeting
);

//================ PROFILE =================
router.get('/profile', userController.getProfile);
router.put('/profile/edit-profile', userController.editProfile);
//====================== USERS ========================

//Get all users
router.get('/users/all-users', userController.getAllUser);
router.post('/users/add-user', userController.inviteUser);

//delete user
router.delete('/users/delete-user/:id', userController.deleteUser);
router.patch('/users/block-user/:id', userController.preventUser);

export default router;
