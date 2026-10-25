import './style.css'
import { renderTools, renderToolRow, renderFlow } from './tools.js'

renderTools(document.getElementById('tool-grid'))
document.documentElement.classList.add('js')
document.querySelectorAll('[data-tools]').forEach((ul) => renderToolRow(ul, ul.dataset.tools.split('|').filter(Boolean)))
document.querySelectorAll('[data-flow]').forEach((ul) => renderFlow(ul, ul.dataset.flow.split('|')))
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
    // Form service not connected yet: fall back to the visitor's email app.
    const f = new FormData(form)
    const body = `${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`
    location.href = `mailto:archellringconada@gmail.com?subject=${encodeURIComponent('Message from your portfolio')}&body=${encodeURIComponent(body)}`
    status.textContent = 'Opening your email app to send this message…'
    status.className = 'ok'
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

// Animate bars/rings in when they scroll into view
const reveals = document.querySelectorAll('.reveal')
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in')
        io.unobserve(e.target)
      }
    })
  }, { threshold: 0.2 })
  reveals.forEach((r) => io.observe(r))
} else {
  reveals.forEach((r) => r.classList.add('in'))
}

// Resume: if the PDF isn't uploaded yet, offer a request-by-email button instead of a dead link
const resumeBtn = document.getElementById('resume-btn')
if (resumeBtn) {
  fetch(resumeBtn.getAttribute('href'), { method: 'HEAD' })
    .then((res) => {
      const type = res.headers.get('content-type') || ''
      if (!res.ok || !type.includes('pdf')) throw new Error('missing')
    })
    .catch(() => {
      resumeBtn.removeAttribute('download')
      resumeBtn.href = 'mailto:archellringconada@gmail.com?subject=' + encodeURIComponent('Resume request')
      resumeBtn.querySelector('span').textContent = 'Request my resume'
    })
}

// Tap-to-enlarge for work-sample images
document.querySelectorAll('.sample img').forEach((img) => {
  img.tabIndex = 0
  img.setAttribute('role', 'button')
  const open = () => {
    if (img.closest('.slot').classList.contains('is-empty')) return
    const box = document.createElement('div')
    box.className = 'lightbox'
    box.setAttribute('role', 'dialog')
    box.setAttribute('aria-modal', 'true')
    box.setAttribute('aria-label', img.alt)
    const big = document.createElement('img')
    big.src = img.currentSrc || img.src
    big.alt = img.alt
    const close = document.createElement('button')
    close.type = 'button'
    close.setAttribute('aria-label', 'Close image')
    close.textContent = '×'
    box.append(big, close)
    const done = () => {
      box.remove()
      document.removeEventListener('keydown', onKey)
      img.focus()
    }
    const onKey = (e) => { if (e.key === 'Escape') done() }
    box.addEventListener('click', done)
    document.addEventListener('keydown', onKey)
    document.body.append(box)
    close.focus()
  }
  img.addEventListener('click', open)
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() }
  })
})

// Mobile: collapse extra work samples behind a "Show more" button
document.querySelectorAll('[data-collapse]').forEach((grid) => {
  const keep = Number(grid.dataset.collapse)
  const items = [...grid.children]
  items.slice(keep).forEach((el) => el.classList.add('m-hide'))
  if (keep === 0) grid.classList.add('all-hidden')
  grid.classList.add('collapsible')
  const extra = items.length - keep
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'show-more'
  btn.setAttribute('aria-expanded', 'false')
  btn.textContent = `Show ${extra} more sample${extra > 1 ? 's' : ''}`
  btn.addEventListener('click', () => {
    const open = grid.classList.toggle('expanded')
    btn.setAttribute('aria-expanded', String(open))
    btn.textContent = open ? 'Show less' : `Show ${extra} more sample${extra > 1 ? 's' : ''}`
  })
  grid.after(btn)
})

// ---- Interactivity: progress bar, scroll-spy, reveal, count-up, back-to-top ----
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

// Scroll progress bar + back-to-top
const bar = document.createElement('div')
bar.className = 'progress'
bar.setAttribute('aria-hidden', 'true')
const toTop = document.createElement('button')
toTop.type = 'button'
toTop.className = 'to-top'
toTop.setAttribute('aria-label', 'Back to top')
toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }))
document.body.append(bar, toTop)
let ticking = false
const onScroll = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`
    toTop.classList.toggle('show', scrollY > 900)
    ticking = false
  })
}
addEventListener('scroll', onScroll, { passive: true })
onScroll()

// Scroll-spy: highlight the nav link of the section in view
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')]
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return
    navLinks.forEach((a) => {
      const on = a.getAttribute('href') === '#' + e.target.id
      a.classList.toggle('active', on)
      if (on) a.setAttribute('aria-current', 'true')
      else a.removeAttribute('aria-current')
    })
  })
}, { rootMargin: '-45% 0px -50% 0px' })
navLinks.forEach((a) => {
  const target = document.querySelector(a.getAttribute('href'))
  if (target) spy.observe(target)
})

// Reveal cards as they scroll into view
const revealSel = '.about-card, .journey li, .kpi, .p2-top > div, .tool-group, .client, .phase, .sample, .metric-card, .how, .resume-card, .contact-grid > *'
const targets = [...document.querySelectorAll(revealSel)].filter((n) => !n.classList.contains('reveal'))
if (!reduce && 'IntersectionObserver' in window) {
  targets.forEach((n, i) => {
    n.classList.add('rv')
    n.style.transitionDelay = `${(i % 4) * 70}ms`
  })
  const rio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in')
        rio.unobserve(e.target)
      }
    })
  }, { threshold: 0.12 })
  targets.forEach((n) => rio.observe(n))
}

// Count-up numbers
const countEls = [...document.querySelectorAll('.stats dd, .kpi strong')].filter((el) => {
  const first = el.firstChild
  return first && first.nodeType === 3 && /^(−?)(\d+(?:\.\d+)?)(.*)$/.test(first.nodeValue.trim()) && !/→|\//.test(first.nodeValue)
})
if (!reduce && 'IntersectionObserver' in window) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return
      cio.unobserve(e.target)
      const node = e.target.firstChild
      const [, sign, num, rest] = node.nodeValue.trim().match(/^(−?)(\d+(?:\.\d+)?)(.*)$/)
      const dec = (num.split('.')[1] || '').length
      const end = parseFloat(num)
      const t0 = performance.now()
      const dur = 1100
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        node.nodeValue = `${sign}${(end * eased).toFixed(dec)}${rest}`
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    })
  }, { threshold: 0.6 })
  countEls.forEach((el) => cio.observe(el))
}
