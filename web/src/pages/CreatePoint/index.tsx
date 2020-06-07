import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from 'leaflet';
import Header from '../../components/Header';

import ibge from '../../services/ibge';
import api from '../../services/api';

import "./styles.css";

interface Item {
  id: number;
  title: string;
  image: string;
  image_url: string;
}

interface IBGEState {
  sigla: string;
}

interface IBGECity {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const [selectedState, setSelectedState] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setInitialPosition([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  useEffect(() => {
    api.get('items').then(res => setItems(res.data));
  }, []);

  useEffect(() => {
    ibge.get<IBGEState[]>('estados').then(res => setStates(res.data.map(state => state.sigla)));
  }, []);

  useEffect(() => {
    if (selectedState === '0') {
      setCities([]);
      setSelectedCity('0');
      return;
    };
    ibge.get<IBGECity[]>(`estados/${selectedState}/municipios`)
      .then(res => setCities(res.data.map(city => city.nome)));
  }, [selectedState]);

  function handleSelectState(evt: ChangeEvent<HTMLSelectElement>) {
    setSelectedState(evt.target.value);
  }

  function handleSelectCity(evt: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(evt.target.value);
  }

  function handleMapClick(evt: LeafletMouseEvent) {
    setSelectedPosition([evt.latlng.lat, evt.latlng.lng]);
  }

  function handleInputChange(evt: ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  function handleSelectItem(id: number) {
    setSelectedItems(
      selectedItems.findIndex(item => item === id) >= 0
        ? selectedItems.filter((item) => item !== id)
        : [...selectedItems, id]
      );
  }

  function handleSubmit(evt: FormEvent) {
    evt.preventDefault();

    const { name, email, whatsapp } = formData;
    const state = selectedState;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;
    const data = {
      name,
      email,
      whatsapp,
      state,
      city,
      latitude,
      longitude,
      items
    };
    new Promise(resolve => resolve(api.post('points', data)))
      .then(() => history.push('/confirmation'));
  }

  return (
    <div id="page-create-point">
      <Header back={true} />
      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do
          <br />
          ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço do mapa</span>
          </legend>
          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="state">Estado (UF)</label>
              <select
                name="state"
                id="state"
                value={selectedState}
                onChange={handleSelectState}
              >
                <option value="0">Selecione uma UF</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
                onClick={() => handleSelectItem(item.id)}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
}

export default CreatePoint;