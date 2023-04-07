import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    event_title: {
      type: String,
      required: true,
    },

    location: {
      type: String,
    },
    description: {
      type: String,
    },
    participands: {
      type: [
        {
          memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          member: {
            type: String,
          },
        },
      ],
    },
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

meetingSchema.pre(/^find/, function () {
  this.populate('participands.memberId');
});
meetingSchema.pre(/^save/, function () {
  this.populate('participands.memberId');
});
export default mongoose.model('Meetings', meetingSchema);
