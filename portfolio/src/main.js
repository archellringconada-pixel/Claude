import './style.css'
import { renderTools, renderToolRow } from './tools.js'

renderTools(document.getElementById('tool-grid'))
renderToolRow(document.getElementById('p2-tools'), ['WooCommerce', 'Elementor', 'GoHighLevel', 'Airtable', 'Boost.space / Make', 'Google Analytics', 'Search Console', 'Claude Code'])

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
    if (slot.querySelector('.ph')) return
    const ph = document.createElement('div')
    ph.className = 'ph'
    ph.innerHTML = `
      <svg class="ph-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="10" r="1.8" fill="currentColor"/><path d="M4 18l5-5 4 4 3-3 4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
      <strong></strong><span class="ph-hint"></span><code></code>`
    ph.querySelector('strong').textContent = slot.dataset.label
    ph.querySelector('.ph-hint').textContent = slot.dataset.hint || ''
    ph.querySelector('code').textContent = `images/${slot.dataset.img}`
    slot.prepend(ph)
  }
  img.addEventListener('error', showPlaceholder)
  if (img.complete && img.naturalWidth === 0) showPlaceholder()
  // Lazy images may not attempt to load until scrolled near, so probe the file up front.
  const probe = new Image()
  probe.onerror = showPlaceholder
  probe.src = img.getAttribute('src')
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
