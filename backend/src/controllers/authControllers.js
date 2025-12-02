import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendOTPEmail } from '../utils/emailService.js';


export const register = async (req, res) => {
    try {
        const { email, password, role = 'user' } = req.body;

        // Checking if email already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use.'
            });
        }

        // Create new user with role 
        const user = new User({ email, password, role });
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            data: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during registration.'
        });
    }
};


//Login - Step 1: Password authentication 

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists in database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // Match password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password.'
            });
        }

        // Generating OTP for MFA
        const otp = user.generateOTP();
        await user.save();

        // Sending OTP via email 
        const emailSent = await sendOTPEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email.',
            data: { email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login.'
        });
    }
};

/**
 * Verify OTP - Step 2: Complete MFA and return JWT 
 */
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // Check if OTP exists and matches
        if (!user.isOTPValid(otp)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP.'
            });
        }

        await user.save();

        // Generating JWT token encoding user info including role
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during OTP verification.'
        });
    }
};

/**
 * Get user profile 
 */
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password -otp -otpExpiry');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile.'
        });
    }
};