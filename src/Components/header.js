class header extends HTMLElement {
    constructor () {
      super()
      this.shadow = this.attachShadow({ mode: 'open' })
    }
  
    connectedCallback () {
      
      this.data = {
       
      }
  
      this.render()
    }
  
    render () {
      this.shadow.innerHTML =
         /*html*/`
        <style>
       header {
    width: 100%;
    max-width:100% ;
    background-color: #000000;
    padding: 10px;
    box-sizing: border-box;

}
a{
    text-decoration: none;
    color: inherit;

}

ul{
    list-style: none;
    margin: 0;
    padding: 0;

}

nav ul{
    align-items: center;
    display: flex;
    justify-content: space-between;

}

nav ul li{
    font-size: 1rem;
    font-weight:bold;

}

nav ul li::first-letter{
    text-transform: capitalize;

}

nav ul li svg{
    height: 1.8rem;
    fill: hsl(0, 0%, 100%);
    width: 2rem;


}
        </style>
  
  <header>
  <nav>
      <ul>
          <li>inicio</li>
      </ul>
  </nav>
</header>
        `
      }
  }
  
  customElements.define('header-component', header)