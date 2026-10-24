import './style.css'

document.getElementById('year').textContent = new Date().getFullYear()

// Mobile nav
const toggle = document.querySelector('.nav-toggle')
const nav = document.getElementById('nav')
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open')
  toggle.setAttribute('aria-expanded', String(open))
})
nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    nav.classList.remove('open')
    toggle.setAttribute('aria-expanded', 'false')
  }
})

// Image slots: show a clearly-marked placeholder until the real asset exists.
document.querySelectorAll('.slot').forEach((slot) => {
  const img = slot.querySelector('img')
  const showPlaceholder = () => {
    slot.classList.add('is-empty')
    if (!slot.querySelector('.ph')) {
      const ph = document.createElement('div')
      ph.className = 'ph'
      ph.textContent = `[PLACEHOLDER: ${slot.dataset.label} — add images/${slot.dataset.img}]`
      slot.prepend(ph)
    }
  }
  img.addEventListener('error', showPlaceholder)
  if (img.complete && img.naturalWidth === 0) showPlaceholder()
})

// Contact form (Formspree)
const form = document.getElementById('contact-form')
const status = document.getElementById('form-status')
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  status.className = ''
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }
  if (form.action.includes('YOUR_FORM_ID')) {
    status.textContent = 'The form is not connected yet. Please email me directly in the meantime.'
    status.className = 'err'
    return
  }
  const btn = form.querySelector('button')
  btn.disabled = true
  status.textContent = 'Sending…'
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(String(res.status))
    form.reset()
    status.textContent = 'Thanks — your message was sent.'
    status.className = 'ok'
  } catch {
    status.textContent = 'Something went wrong. Please email me directly instead.'
    status.className = 'err'
  } finally {
    btn.disabled = false
  }
})
