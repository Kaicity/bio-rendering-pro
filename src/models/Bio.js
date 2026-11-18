import mongoose from 'mongoose';

const CustomLinkSchema = new mongoose.Schema({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  href: { type: String, default: '' },
  icon: { type: String, default: 'link' }, // phone, email, building, glob, map-pin, message-circle, link
}, { _id: false });

const BioSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Họ và tên là bắt buộc'],
      trim: true,
    },
    role: {
      type: String,
      default: '',
      trim: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '/assets/images/avatar.jpg',
    },
    coverTheme: {
      type: String,
      default: 'ocean', // ocean, navy, emerald, sunset, purple, charcoal
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
    },
    department: {
      type: String,
      default: '',
      trim: true,
    },
    enableCallAction: {
      type: Boolean,
      default: true,
    },
    callActionLabel: {
      type: String,
      default: 'Gọi điện',
    },
    enableEmailAction: {
      type: Boolean,
      default: true,
    },
    emailActionLabel: {
      type: String,
      default: 'Gửi email',
    },
    customLinks: [CustomLinkSchema],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Format helper
BioSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id ? obj._id.toString() : obj.id;
  delete obj.__v;
  return obj;
};

export const Bio = mongoose.model('Bio', BioSchema);
