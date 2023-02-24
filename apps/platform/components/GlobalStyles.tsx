import { createGlobalStyle } from "styled-components";
import { theme } from "../common/theme";

export const GlobalStyle = createGlobalStyle`
  * {
    color: ${theme.colors.mainDark}
  }

  .ReactModal__Overlay {
    opacity: 0;
    transition: all 500ms ease-in-out;
    transform: scale(1.5);
  }

  .ReactModal__Overlay--open {
    opacity: 0;
  }
  
  .ReactModal__Overlay--after-open {
    opacity: 1;
    transform: scale(1);
  }

  .ReactModal__Overlay--before-close {
    opacity: 0;
    transform: scale(1.5);
  }
  
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    background:#141C2D;
    color:#141C2D;
  }

  a {
    color:#fe6f6f;
    text-decoration: none;
  }

  :root {

    /* =============================================== COLORS */
    --light-violet-color:#e8e5fc;
    --dark-violet-color: #9e94f7;
    --secondary-color: #fe6f6f;
    --placeholder-text-color: #91959d;
    --main-dark-color: #141c2d;
    --dark-blue-color: #294269;
    --active-field-color: #faea95;
    --error-color: #e04f5f;
  }


  html, body {
    background-color: #f6f6f6;
    font-family: 'Poppins', sans-serif;
    line-height: 1.8em;
    color: var(--main-dark-color);
    overflow-x: hidden;
  }

  h6 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
    margin-top: 20px;
  }

  h3 {
    font-size: 48px;
    text-align: center;
    line-height: 1.2em;
  }

  .profile-photo-small {
    max-width: 35px;
    width: 100%;
  }

  .sign-up, .log-in {
    padding: 0px 30px 0px 30px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 70px;
    max-width: 450px;
  }

  .log-in-text a {
    color: var(--secondary-color);
    text-decoration: none;
  }

  .log-in-text {
    margin-top: 20px;
    font-size: 14px;
  }

  .profile-settings {
    margin: 0 auto;
    text-align: center;
    max-width: 450px;
    padding: 0px 20px 0px 20px;
    margin-top: 100px;
    margin-bottom: 100px;
  }

  .profile-settings img {
    max-width: 150px;
    width: 100%;
  }


  .profile-fields {
    display: flex;
    flex-direction: column;
    align-items: left;
    text-align: left;
  }

  .profile-settings p {
    font-size: 12px;
    color: var(--placeholder-text-color);
  }

  textarea {
    font-family: 'Poppins', sans-serif;
  }

  textarea:focus, input:focus {
    outline: solid 1px var(--dark-violet-color);
  }

  .nav-profile {
    background-color: #fff;
  }

  .dark-background-profile {
    background-color: var(--main-dark-color);
    height: 200px;
  }


  /* =============================================== mobile */

  @media (max-width: 450px) {
    h3 {
      font-size: 30px;
    }

    h6 {
      font-size: 16px;
    }

    .profile-settings img {
      max-width: 100px;
      width: 100%;
    }
  }

  html {
    @media only screen and (max-width: 900px) {
      font-size: 0.8rem;
    }
    @media only screen and (max-width: 500px) {
      font-size: 0.6rem;
    }
  }
`;
