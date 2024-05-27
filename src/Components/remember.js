class Remember extends HTMLElement {
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
        .remember {
            text-align:center;
            border:none;
            margin-top:1rem;
        }

        .remember a{
            font-size: 15px;
            color: hsl(0, 0%, 100%);
            text-decoration: none;

}
        </style>
  
        <div class="remember">
        <a href="#">Olvidé mi contraseña</a>
        </div>
        `
      }
  }
  
  customElements.define('remember-component', Remember)