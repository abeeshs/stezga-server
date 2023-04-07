import mongoose, { mongo } from 'mongoose';
const dealSchema = new mongoose.Schema(
  {
    deal_name: {
      type: String,
      required: true,
    },
    deal_stage: {
      type: String,
    },
    amount: {
      type: Number,
    },
    close_date: {
      type: String,
      required: true,
    },
    deal_owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    priority: {
      type: String,
    },

    deal_with_contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
    },
    docModel: {
      type: String,
      required: true,
      enum: ['Admin', 'User'],
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'docModel',
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('Deal', dealSchema);
