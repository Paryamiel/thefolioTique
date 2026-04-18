import React, { useState } from 'react';
import API from '../api/axios';

function ContactPage() {
  // 1. Set up state to hold the form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // 2. Set up state to hold any validation errors
  const [errors, setErrors] = useState({});

  // 3. Update state when the user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Form validation logic (ported from your old JS)
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid mobile number (digits only)";
      isValid = false;
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


 // 5. Handle form submission
  const handleSubmit = async (e) => { // <-- Note: added 'async'
    e.preventDefault();
    if (validateForm()) {
      try {
        // ACTUALLY send the data to the backend!
        await API.post('/auth/contact-submit', {
          name: formData.name,
          email: formData.email,
          message: formData.message // We omit phone because we didn't add it to the Contact model
        });
        
        alert("Message sent successfully!");
        // Clear the form after successful submission
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});
      } catch (error) {
        alert("Failed to send message. Please try again later.");
        console.error("Contact form error:", error);
      }
    }
  };

  return (
    <>
      <section className="page-title">
        <div className="container">
          <h1>Contact & Resources</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Send a Message</h2>
          <form className="form" onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Your Name" 
                value={formData.name} 
                onChange={handleChange} 
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Your Email" 
                value={formData.email} 
                onChange={handleChange} 
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                placeholder="e.g., 09123456789" 
                value={formData.phone} 
                onChange={handleChange} 
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                placeholder="Write your message here..." 
                value={formData.message} 
                onChange={handleChange} 
              />
              {errors.message && <span className="error">{errors.message}</span>}
            </div>

            <button type="submit" className="btn">Send Message</button>
          </form>
        </div>
      </section>

      <section className="section alt-bg">
        <div className="container">
          <h2>Helpful Resources</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Blitz.gg</td>
                <td>Tool</td>
                <td>Provides detailed stats and guides for both games.</td>
              </tr>
              <tr>
                <td>VLR.gg</td>
                <td>News</td>
                <td>The best source for Valorant competitive news.</td>
              </tr>
              <tr>
                <td>OP.GG</td>
                <td>Stats</td>
                <td>Look up player profiles and champion win rates.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Our Location</h2>
          <div className="map-container">
            {/* Notice how inline styles in React use double curly braces {{}} */}
            <iframe 
              src="https://googleusercontent.com/maps.google.com/0"
              width="100%" 
              height="300" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="Map Location Placeholder"
            />
            <p><em>*Placeholder location for demonstration purposes</em></p>
          </div>

          <h2>External Links</h2>
          <ul className="link-list">
            <li><a href="https://playvalorant.com" target="_blank" rel="noopener noreferrer">Valorant Official Website</a> - Download and play Valorant</li>
            <li><a href="https://www.leagueoflegends.com" target="_blank" rel="noopener noreferrer">League of Legends Official</a> - Start your LoL journey</li>
            <li><a href="https://lolesports.com" target="_blank" rel="noopener noreferrer">LoL Esports</a> - Watch professional League of Legends</li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default ContactPage;