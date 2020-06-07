import React, { MouseEvent } from "react";
import { useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import logo from '../../assets/logo.svg';

import "./styles.css";

interface HeaderProps {
  back?: boolean;
  backUrl?: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  const history = useHistory();

  function handleClickBackButton(evt: MouseEvent<HTMLElement>) {
    evt.preventDefault();
    if (props.backUrl) return history.replace(props.backUrl);
    return history.go(-1);
  }

  return (
    <header id="header">
      <img src={logo} alt="Ecoleta" />
      { props.back ? (
        <a onClick={handleClickBackButton} href="/">
          <FiArrowLeft />
          Voltar para home
        </a>
      ) : null}
    </header>
  );
}

export default Header;