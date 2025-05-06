import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  status: { 
    type: String, 
    enum: ['approved', 'pending', 'rejected', 'suspended'], 
    default: "pending" 
  },
  suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Admin specific
  title: String,
  // Teacher specific
  secAssigned: [{
    section: { type: String},
    subject: { type: String },
    department:{ type:String},
    school:{type:String}
  }],
  occupation: String,
  // Student specific
  batch: String,
  section: String,
  school: String,
  department: String,
  studentID: {
    type: String,
    unique:true,
    required: function() {
      return this.role === 'student';
    },
    validate: {
      validator: function(v) {
        if (this.role === 'student') return !!v;
        return true;
      },
      message: 'StudentID is required for students'
    }
  },
  // Common
  profilePic: String,
  bio: String
});
const User = mongoose.model('User', userSchema);
export default User