import { loadStripe } from '@stripe/stripe-js'

let saleDataGlobal = null

document.addEventListener('initializeStripePayment', async (event) => {
  const { totalAmount, saleData, customerName, customerEmail } = event.detail

  if (!customerName || !customerEmail) {
    console.error('Faltan datos del cliente:', { customerName, customerEmail })
    showMessage('Faltan datos del cliente. Por favor, intenta de nuevo.')
    return
  }

  if (!saleData) {
    console.error('Faltan los datos de la venta.')
    showMessage('No se pudieron obtener los datos de la venta. Intenta de nuevo.')
    return
  }
  saleDataGlobal = saleData

  try {
    const amountInCents = Math.round(totalAmount * 100)
    const clientSecret = await fetchClientSecret(amountInCents, customerName, customerEmail)
    await initializeStripe(clientSecret)
  } catch (error) {
    console.error('Error al inicializar el pago:', error)
    showMessage('No se pudo inicializar el pago. Intenta de nuevo.')
  }
})
let stripe
let elements

async function fetchClientSecret(amountInCents, customerName, customerEmail) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client/payments/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amountInCents,
      customerName,
      customerEmail
    })
  })

  if (!response.ok) {
    throw new Error('Error al obtener el clientSecret')
  }

  const data = await response.json()
  return data.clientSecret
}

async function initializeStripe(clientSecret) {
  if (!clientSecret) {
    console.error('El clientSecret no está definido. No se puede inicializar Stripe.')
    return
  }

  stripe = await loadStripe('pk_test_51QItNYCxHwnRPqw5rQLiDaPD9RD0zU6h8kHd9qcSjU5g2Mhum5ER4sDPQFfhNtLx5bBCvHgXCKCCtB4gHUXY6DJI00bagmow9S')

  elements = stripe.elements({ clientSecret })

  const paymentElement = elements.create('payment')
  paymentElement.mount('#payment-element')

  const paymentForm = document.querySelector('#payment-form')
  if (!paymentForm) {
    console.error('Formulario de pago no encontrado.')
    return
  }

  paymentForm.addEventListener('submit', handleSubmit)
}

async function handleSubmit(e) {
  e.preventDefault()
  setLoading(true)
  try {
    if (!saleDataGlobal) {
      console.error('No se encontraron datos de venta para enviar.')
      showMessage('No se pudieron obtener los datos de la venta. Intenta de nuevo.')
      return
    }

    const saleResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/client/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(saleDataGlobal)
    })

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      saleResponse,
      confirmParams: {
        return_url: 'https://dev-pedidos.com/cliente/reference'
      }
    })

    if (error) {
      showMessage(error.message || 'Ocurrió un error al procesar el pago.')
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      showMessage('¡Pago exitoso!')
    } else {
      showMessage('El pago no se completó. Verifica tu información e inténtalo de nuevo.')
    }
  } catch (error) {
    console.error('Error al confirmar el pago:', error)
    showMessage('Ocurrió un error inesperado. Por favor, intenta de nuevo.')
  }

  setLoading(false)
}

function showMessage(messageText) {
  const messageContainer = document.querySelector('#payment-message')
  if (!messageContainer) return

  messageContainer.classList.remove('hidden')
  messageContainer.textContent = messageText

  setTimeout(() => {
    messageContainer.classList.add('hidden')
    messageContainer.textContent = ''
  }, 4000)
}

function setLoading(isLoading) {
  const submitBtn = document.querySelector('#submit')
  const spinner = document.querySelector('#spinner')
  const buttonText = document.querySelector('#button-text')

  if (isLoading) {
    submitBtn.disabled = true
    spinner.classList.remove('hidden')
    buttonText.classList.add('hidden')
  } else {
    submitBtn.disabled = false
    spinner.classList.add('hidden')
    buttonText.classList.remove('hidden')
  }
}
