import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import '../styles/pages/components/sidebar.css';

import mapMarkerImg from '../images/map_marker.svg';

export default function SideBar() {
  const  { goBack } = useHistory();
  return (
    <aside className="sidebar">
        <img src={mapMarkerImg} alt="Happy" />

        <footer>
          <button type="button" onClick={goBack}>
            <FiArrowLeft size={24} color="#FFF" />
          </button>
        </footer>
      </aside>
  );
}