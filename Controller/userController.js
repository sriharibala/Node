const User = require('../Model/userModel');
const employee = require('../Model/EmployeeModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
// Controller/userController.js
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // ✅ role added
    process.env.JWT_SECRET,
    { expiresIn: '10min' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // if (!name || !email || !password) {
  //   return res.status(400).json({ message: 'Please provide all fields' });
  // }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, role }); // ✅ role included
    await newUser.save();

    // Create JWT token
    // const token = generateToken(newUser._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate token
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // ✅ Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role // ✅ include role
      },
      token,refreshToken
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.createEmployee = async (req, res) => {  
  console.log(req);
  
  const { name, email, mobile} = req.body;
  // if (!name || !email  || !mobile) {
  //   return res.status(400).json({ message: 'Please provide all fields' });
  // }

  try {
    const userExists = await employee.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new employee({ name, email, mobile});
    await newUser.save();
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken
    });

  } catch (error) {
    return res.status(403).json({ message: 'Refresh token expired' });
  }
};
exports.logoutUser = async (req, res) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed' });
  }
};
