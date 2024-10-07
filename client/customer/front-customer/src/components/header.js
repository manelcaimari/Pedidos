class header extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.color = this.getAttribute('color')
    this.title = this.getAttribute('title')
    this.linkHref = this.getAttribute('linkHref')
    this.svg = this.getAttribute('svg') || ''
  }

  connectedCallback () {
    this.render()
    document.addEventListener('changeHeader', (event) => {
      this.changeHeader(event.detail.title, event.detail.svg, event.detail.linkHref)
    })
  }

  changeHeader (newTitle, newSvg, newLinkHref) {
    this.title = newTitle
    this.svg = newSvg || ''
    this.linkHref = newLinkHref || ''
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
    <style>
      header {
        width: 100%;
        max-width:100% ;
        background-color: ${this.color};
        padding:0.3rem 0.5rem;
        box-sizing: border-box;
        align-items: center;
        display: flex;
        justify-content: space-between;
      }
      h2::first-letter{
        text-transform: capitalize;
      }
      h2{
        font-size: 1rem;
        font-weight:bold;
      }
      svg {
        height: 1.8rem;
        fill: hsl(0, 0%, 100%);
        width: 2rem;
      }
      .header-link {
        display: flex; 
        align-items: center; 
        text-decoration: none; 
        color: hsl(0, 0%, 100%); 
      }
   
    </style>
      <header>
        <h2>${this.title}</h2>
        <div class="header-svg"><a class="header-link" href="${this.linkHref}">${this.svg}</a></div>
      </header>
        `
  }
}

customElements.define('header-component', header)
