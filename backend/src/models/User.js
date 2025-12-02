import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) 
        return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


userSchema.methods.generateOTP = function() {
    // creating the  6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = otp;
    // OTP valid for 5 minutes 
    this.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    return otp;
};

// Checking  if OTP is valid
userSchema.methods.isOTPValid = function(inputOTP) {
    if (!this.otp || !this.otpExpiry) return false;
    
    const isMatch = this.otp === inputOTP;
    const isNotExpired = this.otpExpiry > new Date();
    
    return isMatch && isNotExpired;
};

const User = mongoose.model('User', userSchema);
export default User;