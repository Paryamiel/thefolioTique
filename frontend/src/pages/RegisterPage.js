import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    accountType: '',
    level: '',
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.fullname.trim()) { newErrors.fullname = "Full Name is required"; isValid = false; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"; isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format"; isValid = false;
    }

    if (!formData.username.trim()) { newErrors.username = "Username is required"; isValid = false; }

    if (!formData.password) {
      newErrors.password = "Password is required"; isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"; isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required"; isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"; isValid = false;
    }

    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required"; isValid = false;
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) { age--; }
      if (age < 18) { newErrors.dob = "You must be at least 18 years old to register."; isValid = false; }
    }

    if (!formData.gender) { newErrors.gender = "Gender is required"; isValid = false; }
    if (!formData.accountType) { newErrors.accountType = "Account Type is required"; isValid = false; }
    if (!formData.level) { newErrors.level = "Skill Level is required"; isValid = false; }
    if (!formData.terms) { newErrors.terms = "You must agree to the Terms and Conditions"; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (validateForm()) {
      try {
        const { confirmPassword, terms, ...userData } = formData;
        await API.post('/auth/register', userData);
        alert("Registration successful! Please log in.");
        navigate('/login');
      } catch (err) {
        setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <>
      <section className="page-title">
        <div className="container">
          <h1>Join Our Community</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="register-layout">
            <div className="register-form-container">
              <h2>Create Account</h2>
              
              {serverError && <div className="error-message" style={{ color: '#FF4655', marginBottom: '15px' }}>{serverError}</div>}

              <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullname">Full Name *</label>
                  <input type="text" id="fullname" name="fullname" placeholder="Enter your full name" value={formData.fullname} onChange={handleChange} />
                  {errors.fullname && <span className="error">{errors.fullname}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="username">Preferred Username *</label>
                  <input type="text" id="username" name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} />
                  {errors.username && <span className="error">{errors.username}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input type="password" id="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} />
                  {errors.password && <span className="error">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Repeat your password" value={formData.confirmPassword} onChange={handleChange} />
                  {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="dob">Date of Birth *</label>
                  <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} />
                  {errors.dob && <span className="error">{errors.dob}</span>}
                </div>

                <div className="form-group">
                  <label>Gender *</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} /> Male
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} /> Female
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} /> Other
                    </label>
                  </div>
                  {errors.gender && <span className="error">{errors.gender}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="accountType">Account Type *</label>
                  <select id="accountType" name="accountType" value={formData.accountType} onChange={handleChange}>
                    <option value="">Select Account Type</option>
                    <option value="basic">Basic (Free)</option>
                    <option value="premium">Premium (Paid)</option>
                  </select>
                  {errors.accountType && <span className="error">{errors.accountType}</span>}
                </div>

                <div className="form-group">
                  <label>Skill Level *</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" name="level" value="beginner" checked={formData.level === 'beginner'} onChange={handleChange} /> Beginner
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="level" value="intermediate" checked={formData.level === 'intermediate'} onChange={handleChange} /> Intermediate
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="level" value="expert" checked={formData.level === 'expert'} onChange={handleChange} /> Expert
                    </label>
                  </div>
                  {errors.level && <span className="error">{errors.level}</span>}
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} />
                    I agree to the Terms and Conditions *
                  </label>
                  {errors.terms && <span className="error">{errors.terms}</span>}
                </div>

                <button type="submit" className="btn">Register</button>
                <p style={{ marginTop: '15px' }}>Already have an account? <Link to="/login" style={{ color: '#FF4655' }}>Log in here</Link>.</p>
              </form>
            </div>

            <div className="benefits-container">
              <h2>What You Get</h2>
              <img src="https://plus.unsplash.com/premium_photo-1683121664254-fcfd8e426592?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Gaming community and esports atmosphere" />
              
              <h3>Member Benefits:</h3>
              <ul>
                <li>Weekly tips for Valorant and League of Legends</li>
                <li>Updates on patches and new content</li>
                <li>Access to community discussions</li>
                <li>Tournament and event notifications</li>
              </ul>
              <p><em>Your data is securely stored and encrypted in our database.</em></p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default RegisterPage;