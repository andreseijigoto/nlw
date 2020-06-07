import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { FiCheckCircle } from 'react-icons/fi';

import './styles.css';

const Confirmation = () => {
  const [counter, setCounter] = useState<number>(5);
  const history = useHistory();

  useEffect(() => {
    if (counter) {
      setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      history.push('/');
    }
  }, [counter, history]);


  return (
    <div id="page-confirmation">
      <FiCheckCircle />
      <h1>Cadastro concluído</h1>
      <span>Você será redirecionado para a home em {counter} segundos</span>
    </div>
  )
}

export default Confirmation;