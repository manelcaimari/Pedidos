class backbutton extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }
  
  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /*html*/`
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
              <button><a href="#"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg></a></button>
          </div>
      `
  }
}
  
customElements.define('backbutton-component', backbutton)