import { css } from "lit-element";

export const slideUp = css`
  @-webkit-keyframes SlideUp {
    0% {
      height: 0;
    }
    100% {
      height: 100%;
    }
  }
  @keyframes SlideUp {
    0% {
      height: 0;
    }
    100% {
      height: 100%;
    }
  }
  .slideUp {
    -webkit-animation-name: SlideUp;
    animation-name: SlideUp;
    animation-fill-mode: forwards;
  }
`;

export const slideDown = css`
  @-webkit-keyframes SlideDown {
    0% {
      height: 100%;
    }
    100% {
      height: 0;
    }
  }
  @keyframes SlideDown {
    0% {
      height: 100%;
    }
    100% {
      height: 0;
    }
  }
  .slideDown {
    -webkit-animation-name: SlideDown;
    animation-name: SlideDown;
    animation-fill-mode: forwards;
    height: 100%;
  }
`;

