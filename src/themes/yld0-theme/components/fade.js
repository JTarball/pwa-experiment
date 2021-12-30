import { css } from "lit-element";



export const fadeInLeft = css`
  @-webkit-keyframes FadeInLeft {
    from {
      opacity: 0;
      top: 0px;
    }
    to {
      opacity: 1;
      top: 200px;
    }
  }
  @keyframes FadeInLeft {
    from {
      opacity: 0;
      top: 0px;
    }
    to {
      opacity: 1;
      top: 400px;
    }
  }
  .fadeInLeft {
    -webkit-animation-name: FadeInLeft;
    animation-name: FadeInLeft;
    opacity: 0;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
  }
`;