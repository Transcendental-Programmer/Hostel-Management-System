import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Import the CSS file for additional styles if needed
import Navbar from './Navbar';

const HomePage = () => {
    const navigate = useNavigate();

    // Animation for fade-in effect
    const fadeIn = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        config: { duration: 1000 },
    });

    // Animation for buttons
    const buttonAnimation = useSpring({
        transform: 'scale(1)',
        from: { transform: 'scale(0.9)' },
        config: { tension: 180, friction: 12 },
    });

    return (
        <div className="homepage-container md:min-h-[calc(100vh-80px)] min-h-[calc(100vh-64px)]">
            <animated.div style={fadeIn} className="overlay">
                <h1 className="app-name">Welcome to HostelMate</h1>
                <p className="tagline">Your All-in-One Hostel Management Solution</p>
                
                <animated.div style={buttonAnimation} className="button-group">
                    <button className="login-btn" onClick={() => navigate('/login')}>
                        Log In
                    </button>
                    <button className="signup-btn" onClick={() => navigate('/signup')}>
                        Sign Up
                    </button>
                </animated.div>
            </animated.div>
        </div>
       
    );
};

export default HomePage;

