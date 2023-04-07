import * as dealService from '../services/dealService.js';
import asyncHandler from 'express-async-handler';

//View all deals

export const getAllDeals = asyncHandler(async (req, res) => {
	const allDeals = await dealService.getDealService(req.user);
	if (allDeals) {
		res.status(200).json(allDeals);
	} else {
		throw new Error('No deals found');
	}
});

//Create new Deals
export const addNewDeal = asyncHandler(async (req, res) => {
	const { dealName, dealStage, amount, closeDate, dealOwner, priority, contact } = req.body;

	const isDealExist = await dealService.dealExist(req.body.dealName);
	if (isDealExist.length > 0) {
		throw new Error('Deal name already exist');
	} else {
		const dealObj = {
			deal_name: dealName,
			deal_stage: dealStage,
			amount: amount,
			close_date: closeDate,
			deal_owner: dealOwner,
			priority: priority,
			deal_with_contact: contact,
			created_by: req.user._id,
			docModel: 'User',
			company_id:req.user.company_id
		};

		const createdDeal = await dealService.dealCreateService(dealObj);

		if (createdDeal) {
			res.status(200).json({ status: 'success', message: 'Deal created successfully' });
		} else {
			throw new Error();
		}
	}
});

//update Deal
export const updateDeal = asyncHandler(async (req, res) => {
	const dealId = req.params.id;

	const updated = await dealService.dealUpdateService(req.body.data, dealId);

	if (updated) {
		res.status(200).json({ message: 'Deal created successfully' });
	} else {
		throw new Error();
	}
});
