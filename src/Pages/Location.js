import React from 'react';
import './location.css';  // Importing the CSS file for styling

const Location = () => {
  return (
    <div className="location-container">
      <h2 className="location-title">Our Location</h2>
      <p className="location-description">
        Find us at the address below and click on the map to get directions.
      </p>

      <div className="map-container">
        <iframe
          title="Google Map - Our Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12672.624516280183!2d-74.00601552118273!3d40.7127760013439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259ae0c2e89d7%3A0x65c02445b7464672!2sNew%20York%20City%2C%20NY!5e0!3m2!1sen!2sus!4v1616777883022!5m2!1sen!2sus"
          width="100%"
          height="450"
          style={{ border: '0' }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      <div className="directions-container">
        <a
          href="https://www.google.com/maps?q=New+York+City,+NY"
          target="_blank"
          rel="noopener noreferrer"
          className="directions-link"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
};

export default Location;
