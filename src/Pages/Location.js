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
          title="Our loaction"
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2775.633338338851!2d31.33142997555251!3d30.01041787494081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzDCsDAwJzM3LjUiTiAzMcKwMjAnMDIuNCJF!5e1!3m2!1sen!2seg!4v1745085666745!5m2!1sen!2seg"
          width="100%"
          height="450"
          style={{border: '0'}}
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>

      <div className="directions-container">
        <a
          href="https://maps.app.goo.gl/PBPgYKQyxeJiNhMG6?g_st=iwb"
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
