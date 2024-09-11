class homebutton extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        .svg {
          height: 1.8rem;
          fill: hsl(0, 0%, 100%);
          width: 2rem;
          justify-content:center;
        }
        button{
          height: 100%; 
          width: 100%;
          background-color:transparent;
          border:0;
          padding:0;
          align-items: center;
          justify-content: center;
        }
        a{
          display: block;
          height: 100%; 
          width: 100%;
        }
        svg{
          height: 1.8rem;
          fill: hsl(0, 0%, 100%);
          width: 2rem;
        }
      </style>
        <div class="svg">
          <button> <a href="#"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>home</title><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" /></svg></a></button>
        </div>
    `
  }
}

customElements.define('homebutton-component', homebutton)
