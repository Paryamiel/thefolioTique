import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function ProfilePage() {
  const { user, setUser } = useAuth();
  
  // Use fullname to match the registration model, with a fallback to name
  const [fullname, setFullname] = useState(user?.fullname || user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [pic, setPic] = useState(null);
  
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault(); 
    setMsg('');
    setError('');
    setIsUpdating(true);

    const fd = new FormData();
    fd.append('fullname', fullname);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);

    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data); // Update global context so header/navbar changes immediately
      setMsg('Profile updated successfully!');
    } catch (err) { 
      setError(err.response?.data?.message || 'Error updating profile'); 
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault(); 
    setMsg('');
    setError('');

    try {
      await API.put('/auth/change-password', { 
        currentPassword: curPw,
        newPassword: newPw 
      });
      setMsg('Password changed successfully!');
      setCurPw(''); 
      setNewPw('');
    } catch (err) { 
      setError(err.response?.data?.message || 'Error changing password'); 
    }
  };

  // Construct the image source URL using env variable
  const picSrc = user?.profilePic
    ? `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/uploads/${user.profilePic}`
    : 'https://via.placeholder.com/150/333333/FFFFFF?text=No+Avatar';

  return (
    <>
      <section className="page-title">
        <div className="container">
          <h1>Command Center</h1>
          <p>Manage your agent profile and security credentials.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Display global messages */}
          {msg && <div style={{ color: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.1)', padding: '10px', borderLeft: '4px solid #4CAF50', marginBottom: '20px' }}>{msg}</div>}
          {error && <div style={{ color: '#FF4655', backgroundColor: 'rgba(255, 70, 85, 0.1)', padding: '10px', borderLeft: '4px solid #FF4655', marginBottom: '20px' }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
            
            {/* Form 1: Profile Details */}
            <div className="form-container">
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <img 
                  src={picSrc} 
                  alt="Profile" 
                  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FF4655' }} 
                />
                <h2>Edit Identity</h2>
              </div>
              
              <form className="form" onSubmit={handleProfile}>
                <div className="form-group">
                  <label>Display Name</label>
                  <input 
                    type="text" 
                    value={fullname} 
                    onChange={e => setFullname(e.target.value)}
                    placeholder="Enter your display name" 
                  />
                </div>

                <div className="form-group">
                  <label>Bio / Status</label>
                  <textarea 
                    value={bio} 
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell the lobby about yourself..." 
                    rows={3} 
                    style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
                  />
                </div>

                <div className="form-group">
                  <label>Update Avatar</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setPic(e.target.files[0])} 
                    style={{ marginTop: '5px' }}
                  />
                </div>

                <button type="submit" className="btn" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>

            {/* Form 2: Security */}
            <div className="form-container" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', marginTop: '-10px' }}>
              <h2 style={{ marginBottom: '20px' }}>Security Clearance</h2>
              
              <form className="form" onSubmit={handlePassword}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter current password"
                    value={curPw} 
                    onChange={e => setCurPw(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    placeholder="New password (min 6 chars)"
                    value={newPw} 
                    onChange={e => setNewPw(e.target.value)} 
                    required
                    minLength={6} 
                  />
                </div>

                <button type="submit" className="btn" style={{ backgroundColor: 'transparent', border: '1px solid #FF4655', color: '#FF4655' }}>
                  Update Password
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default ProfilePage;