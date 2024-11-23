import { loadStripe } from '@stripe/stripe-js';

document.addEventListener("DOMContentLoaded", () => {
  let stripe;
  let elements;
  let clientSecret;

  // Función para obtener el clientSecret desde el backend
  async function fetchClientSecret() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/payments/create-payment-intent`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error("Error al obtener el clientSecret");
    }

    const data = await response.json();
    return data.clientSecret;
  }

  async function initialize() {
    stripe = await loadStripe('pk_test_51QItNYCxHwnRPqw5rQLiDaPD9RD0zU6h8kHd9qcSjU5g2Mhum5ER4sDPQFfhNtLx5bBCvHgXCKCCtB4gHUXY6DJI00bagmow9S');

    clientSecret = await fetchClientSecret(); // Obtienes el clientSecret desde el backend

    // 2. Crear un PaymentElement en lugar de CardElement
    elements = stripe.elements({ clientSecret });

    const paymentElement = elements.create('payment');  // Usa el PaymentElement

    // 3. Monta el PaymentElement en el contenedor adecuado
    const paymentElementDiv = document.querySelector('#payment-element');
    if (!paymentElementDiv) {
      console.error("El contenedor #payment-element no fue encontrado en el DOM.");
      return;
    }

    paymentElement.mount('#payment-element');  // Montar el PaymentElement

    const paymentForm = document.querySelector("#payment-form");
    if (!paymentForm) {
      console.error("Formulario de pago no encontrado");
      return;
    }

    paymentForm.addEventListener("submit", handleSubmit); // Llamar al submit cuando el usuario envíe el formulario
  }

  // Inicialización
  initialize();

  // Función para manejar el submit del formulario
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Confirmar el pago usando el PaymentElement
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:4242/complete.html", // La URL donde se redirige después del pago
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        showMessage(error.message); // Muestra un mensaje de error
      } else {
        showMessage("Ocurrió un error inesperado.");
      }
    } else if (paymentIntent.status === 'succeeded') {
      showMessage("¡Pago exitoso!");
    }

    setLoading(false); // Detiene el loading
  }
  // Función para controlar el estado de carga del botón de pago
  function setLoading(isLoading) {
    if (isLoading) {
      document.querySelector("#submit").disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("#submit").disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
  }

  // Función para mostrar mensajes de error o éxito
  function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");
    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
      messageContainer.classList.add("hidden");
      messageContainer.textContent = "";
    }, 4000);
  }
});