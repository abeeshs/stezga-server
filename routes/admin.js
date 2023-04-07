import { Router } from 'express';
import * as contactController from '../controller/contactController.js';
import * as adminController from '../controller/adminController.js';
import * as taskController from '../controller/taskController.js';
import { adminProtect } from '../middleware/authMiddleware.js';
import * as meetingController from '../controller/meetingController.js';
const router = Router();
//=============== LOGIN/REGISTER ===============

//Admin signup
router.post('/signup', adminController.adminRegister);
//admin login
router.post('/', adminController.adminLogin);
router.get('/admin-data', adminProtect, adminController.getProfile);

router.get('/logout', adminProtect, adminController.logOut);

//Add user
router.post('/users/add-user', adminController.createUser);

//==================== TASK =======================
//View all task
router.get('/task', adminProtect, adminController.getAllTask);

//Create tasks
router.post('/task/add-task', adminProtect, taskController.createNewTask);

//Delete Task
router.delete('/task/delete-task/:id', adminProtect, taskController.deleteTask);
//Edit Task
router.put('/task/edit-task/:id', adminProtect, taskController.editTask);
//Change status
router.patch('/task/change-status/:id', taskController.aproveTask);

//====================== USERS ========================
//Get all users
router.get('/users', adminController.getAllUser);
//delete user
router.delete('/Users/delete-user/:id', adminController.deleteUser);
router.patch('/Users/block-user/:id', adminController.preventUser);

//================== CONTACTS ====================

//view -Contacts
router.get('/contacts', adminProtect, contactController.getAllContact);
//create contacts
router.post(
  '/contacts/add-contact',
  adminProtect,
  contactController.addNewContact
);
//delete contacts
router.delete(
  '/contacts/delete-contact/:id',
  adminProtect,
  contactController.deleteContact
);
//Edit contacts
router.put(
  '/contacts/edit-contact/:id',
  adminProtect,
  contactController.editContact
);

//=================== MEETINGS ====================

router.post(
  '/meetings/new-meeting',
  adminProtect,
  meetingController.addNewMeeting
);
router.get('/meetings/members', adminProtect, meetingController.getMembers);

export default router;
