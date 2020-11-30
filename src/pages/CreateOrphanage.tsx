import React, { FormEvent, useState, ChangeEvent } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import SideBar from '../components/Sidebar';
import mapIcon from '../utils/mapIcon';
import { LeafletMouseEvent } from 'leaflet';
import { useHistory } from 'react-router-dom'

import { FiPlus } from "react-icons/fi";

import '../styles/pages/create-orphanage.css';
import server from "../services/api";

export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const { latitude, longitude } = position;
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([])

  function handlerMapMarker(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = new FormData();

    data.append('name', name);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    selectedImages.forEach(image => {
      data.append('images', image);
    });

    await server.post('/orphanage-create', data);

    alert('Dados cadastrados com sucesso!');

    history.push('/app');
  }

  function handleSetImages(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files) {
      return;
    }

    const selectedOnes = Array.from(event.target.files)

    setSelectedImages(selectedOnes)

    const selected = selectedOnes.map(image => {
      return URL.createObjectURL(image);
    });

    setImages(selected);
  }

  return (
    <div id="page-create-orphanage">
      <SideBar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-15.8624618, -48.0720324]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handlerMapMarker}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {
                position.latitude !== 0 && <Marker interactive={false} icon={mapIcon} position={[position.latitude, position.longitude]} />
              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={event => setName(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} value={about} onChange={event => setAbout(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="image-container">
                <label htmlFor="images[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>

                {
                  images.map(image => {
                    return (
                      <img key={image} src={image} alt={name} />
                    )
                  })
                }
              </div>

              <input type="file" id="images[]" multiple onChange={handleSetImages} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={event => setInstructions(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horários de funcionamento</label>
              <input id="opening_hours" value={opening_hours} onChange={event => setOpeningHours(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button" className={open_on_weekends ? 'active' : ''} onClick={() => { setOpenOnWeekends(true) }}>Sim</button>
                <button type="button" className={!open_on_weekends ? 'active' : ''} onClick={function () { setOpenOnWeekends(false) }}>Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}
