import React, { useEffect, useState } from 'react';

import mapMarkerImg from '../images/map_marker.svg';

import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import mapIcon from '../utils/mapIcon';
import server from '../services/api';

import 'leaflet/dist/leaflet.css'
import '../styles/pages/orphanages-map.css';

interface Orphanages {
  id: string,
  name: string,
  latitude: number,
  longitude: number
}

function Orphanages() {
  const [orphanages, setOrphanages] = useState<Orphanages[]>([]);


  useEffect(function () {
    server.get('/orphanages').then(response => {
      setOrphanages(response.data)
    });
  }, []);

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy" />

          <h2>Escolha um ofanato no mapa</h2>
          <p>
            Muitas crianças estão esperando a sua visita :)
          </p>
        </header>

        <footer>
          <strong>Distrito Federal</strong>
          <span>Brasília</span>
        </footer>
      </aside>


      <Map center={[-15.8622878, -48.0720186]} zoom={15} style={{ width: '100%', height: '100%' }} >
        <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />

        {orphanages.map(orphanage => {
          return (
            <Marker position={[orphanage.latitude, orphanage.longitude]} icon={mapIcon} key={orphanage.id} >
              <Popup closeButton={false} minWidth={240} maxHeight={240} className="map-popup" >
                {orphanage.name}
                <Link to={`/orphanage/${orphanage.id}`} >
                  <FiArrowRight size={20} color="#fff" />
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus color="#fff" size={32} />
      </Link>
    </div>
  );
}

export default Orphanages;