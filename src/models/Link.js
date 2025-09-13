import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url:   { type: String, required: true }
});

export default mongoose.model('Link', linkSchema);
