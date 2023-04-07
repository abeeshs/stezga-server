import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    task_type: {
      type: String,
      required: true,
    },
    associated_with: {
      type: String,
    },
    assigned_to: [
      {
        name: {
          type: String,
          required: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
    priority: {
      type: String,
      required: true,
    },
    due_date: {
      type: String,
      required: true,
    },
    due_time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    task_status: {
      default: 'Pending',
      type: String,
    },
    file: {
      type: String,
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
export default mongoose.model('Tasks', taskSchema);
