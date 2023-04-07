import asyncHandler from 'express-async-handler';
import Contact from '../model/contactModel.js';
import * as contactService from '../services/contactService.js';

//------------VIEW CONTACT----------------
//Method - GET

export const getAllContact = asyncHandler(async (req, res) => {
	const allContacts = await Contact.find({company_id:req.user.company_id}).populate('contact_owner');

	if (allContacts) {
		res.status(200).json(allContacts);
	} else {
		res.status(400);
		throw new Error('Contacts not found');
	}
});

//-------------ADD NEW CONTACT--------------
//Mathod - POST

export const addNewContact = asyncHandler(async (req, res, next) => {
	const { email, mobile, firstname, lastname, contactOwner, jobTitle, lifeCycle, leadStatus } =
		req.body.data;
	console.log(req.body);
	if (!email || !mobile || !firstname || !lastname || !contactOwner || !jobTitle) {
		res.status(400);
		throw new Error('All fields required');
	} else {
		const newContact = {
			firstname: firstname,
			email: email,
			lastname: lastname,
			mobile: mobile,
			contact_owner: contactOwner,
			job_title: jobTitle,
			lifecycle_stage: lifeCycle,
			lead_status: leadStatus,
			created_by: req.user._id,
			company_id:req.user.company_id
		};
		const contact = await contactService.createContactService(newContact);
		if (contact) {
			res.status(200).json({ message: 'Contact created succesfully', status: 'success' });
		} else {
			res.status(400);
			throw new Error('Contact creation failed');
		}
	}
});

//----------- DELETE CONTACT---------
//Method -Delete

export const deleteContact = asyncHandler(async (req, res) => {
	const contactId = req.params.id;
	const deletedContact = await Contact.findByIdAndDelete(contactId);
	if (deletedContact) {
		res.status(200).json({ message: 'Contact deleted successfully' });
	} else {
		res.status(400);
		throw new Error('Contact not found');
	}
});

//----------- EDIT CONTACT---------
//Method -Put

export const editContact = asyncHandler(async (req, res) => {
	//contact object id
	const contactId = req.params.id;

	const { email, mobile, firstname, lastname, contactOwner, jobtitle, lifecycle, leadStatus } =
		req.body;
	//updated data stored in a object
	const newContact = {
		firstname: firstname,
		email: email,
		lastname: lastname,
		mobile: mobile,
		contact_owner: contactOwner,
		job_title: jobtitle,
		lifecycle_stage: lifecycle,
		lead_status: leadStatus,
		created_by: req.user._id
	};
	//checking wheather contact exist or not
	const contactExist = await Contact.findById(contactId);

	if (contactExist) {
		//If the contact exist updatating the contact
		const updatedContact = await Contact.findByIdAndUpdate(contactId, newContact, { new: true });
		res.status(200).json({ message: 'Contact updated successfully' });
	} else {
		res.status(400);
		throw new Error('Contact not found');
	}
});
