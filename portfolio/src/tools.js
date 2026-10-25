import {
  siFacebook, siInstagram, siTiktok, siNotion, siAsana, siGmail, siGooglecalendar,
  siGoogledrive, siGoogledocs, siGooglemeet, siZoom, siWordpress,
  siElementor, siHtml5, siGoogleanalytics, siGooglesearchconsole, siSemrush,
  siAirtable, siMake, siClaude, siWondersharefilmora,
} from 'simple-icons'

// Official logo where the icon set has one; otherwise a lettered badge (bg/fg colours).
const badge = (mono, bg, fg = '#fff') => ({ mono, bg, fg })

const groups = [
  { title: 'Social Media & Advertising', items: [
    { name: 'LinkedIn', sub: 'Recruiter, Sales Navigator, Campaign Manager', ...badge('in', '#0a66c2') },
    { name: 'Facebook', sub: 'Business Suite & Ads', icon: siFacebook },
    { name: 'Instagram', icon: siInstagram },
    { name: 'TikTok', icon: siTiktok },
  ] },
  { title: 'Project Management', items: [
    { name: 'Notion', icon: siNotion },
    { name: 'Microsoft Project', ...badge('P', '#31752f') },
    { name: 'Asana', icon: siAsana },
    { name: 'Monday.com', ...badge('m', '#e0294a') },
  ] },
  { title: 'Documentation & Reporting', items: [
    { name: 'Excel', ...badge('X', '#107c41') },
    { name: 'Word', ...badge('W', '#185abd') },
    { name: 'PowerPoint', ...badge('P', '#c43e1c') },
    { name: 'Outlook', ...badge('O', '#0f6cbd') },
    { name: 'Power BI', ...badge('BI', '#f2c811', '#1c2523') },
  ] },
  { title: 'Google Workspace', items: [
    { name: 'Gmail', icon: siGmail },
    { name: 'Calendar', icon: siGooglecalendar },
    { name: 'Drive', icon: siGoogledrive },
    { name: 'Docs', icon: siGoogledocs },
    { name: 'Meet', icon: siGooglemeet },
  ] },
  { title: 'Communication & Collaboration', items: [
    { name: 'SharePoint', ...badge('S', '#038387') },
    { name: 'Slack', ...badge('S', '#4a154b') },
    { name: 'Zoom', icon: siZoom },
    { name: 'Microsoft Teams', ...badge('T', '#5059c9') },
  ] },
  { title: 'Editing & Design', items: [
    { name: 'Illustrator', ...badge('Ai', '#330000', '#ff9a00') },
    { name: 'Photoshop', ...badge('Ps', '#001e36', '#31a8ff') },
    { name: 'Canva', ...badge('C', '#00c4cc', '#073b3f') },
    { name: 'CapCut', ...badge('C', '#111111') },
    { name: 'Shotcut', ...badge('S', '#2f6f9f') },
    { name: 'Filmora', icon: siWondersharefilmora },
  ] },
  { title: 'Website, Audit & SEO', items: [
    { name: 'WordPress', icon: siWordpress },
    { name: 'WooCommerce', ...badge('Woo', '#96588a') },
    { name: 'Elementor', icon: siElementor },
    { name: 'HTML & CSS', icon: siHtml5 },
    { name: 'Google Analytics', sub: 'GA4', icon: siGoogleanalytics },
    { name: 'Search Console', icon: siGooglesearchconsole },
    { name: 'Screaming Frog', ...badge('SF', '#43751f') },
    { name: 'Semrush', icon: siSemrush },
    { name: 'Meta SEO Inspector', ...badge('M', '#2c4a7c') },
    { name: 'Ubersuggest', ...badge('U', '#c9460f') },
  ] },
  { title: 'CRM & Automation', items: [
    { name: 'GoHighLevel', ...badge('G', '#2f6bc9') },
    { name: 'ActiveCampaign', ...badge('A', '#356ae6') },
    { name: 'Airtable', icon: siAirtable },
    { name: 'Boost.space / Make', icon: siMake },
    { name: 'Claude Code', sub: 'AI-assisted development', icon: siClaude },
  ] },
]

const el = (tag, cls, text) => {
  const n = document.createElement(tag)
  if (cls) n.className = cls
  if (text) n.textContent = text
  return n
}

function iconNode(item) {
  if (item.icon) {
    const span = el('span', 'ti')
    span.setAttribute('aria-hidden', 'true')
    span.innerHTML = `<svg viewBox="0 0 24 24" role="img"><path fill="#${item.icon.hex}" d="${item.icon.path}"/></svg>`
    return span
  }
  const span = el('span', 'ti ti-badge', item.mono)
  span.style.background = item.bg
  span.style.color = item.fg
  span.setAttribute('aria-hidden', 'true')
  return span
}

const cats = {
  'Social Media & Advertising': 'social',
  'Editing & Design': 'social',
  'Website, Audit & SEO': 'web',
  'CRM & Automation': 'web',
  'Project Management': 'work',
  'Documentation & Reporting': 'work',
  'Google Workspace': 'work',
  'Communication & Collaboration': 'work',
}
const tabs = [
  ['all', 'All'],
  ['web', 'Websites & automation'],
  ['social', 'Social & design'],
  ['work', 'Productivity'],
]

export function renderTools(root) {
  const bar = el('div', 'tool-tabs')
  bar.setAttribute('role', 'group')
  bar.setAttribute('aria-label', 'Filter tools by category')
  const wraps = []
  groups.forEach((g) => {
    const wrap = el('div', 'tool-group')
    wrap.dataset.cat = cats[g.title]
    wrap.append(el('h3', '', g.title))
    const ul = el('ul', 'tool-card')
    g.items.forEach((item) => {
      const li = el('li', 'tool')
      if (item.sub) li.title = item.sub
      li.append(iconNode(item), el('span', 'tn', item.name))
      ul.append(li)
    })
    wrap.append(ul)
    root.append(wrap)
    wraps.push(wrap)
  })
  tabs.forEach(([key, label], i) => {
    const b = el('button', 'tool-tab' + (i === 0 ? ' on' : ''), label)
    b.type = 'button'
    b.setAttribute('aria-pressed', String(i === 0))
    b.addEventListener('click', () => {
      bar.querySelectorAll('.tool-tab').forEach((x) => {
        x.classList.toggle('on', x === b)
        x.setAttribute('aria-pressed', String(x === b))
      })
      wraps.forEach((w) => { w.hidden = key !== 'all' && w.dataset.cat !== key })
    })
    bar.append(b)
  })
  root.before(bar)
}

export function renderToolRow(root, names) {
  const all = groups.flatMap((g) => g.items)
  names.forEach((name) => {
    const item = all.find((i) => i.name === name)
    if (!item) return
    const li = el('li', 'tool')
    li.append(iconNode(item), el('span', 'tn', item.name))
    root.append(li)
  })
}

export function renderFlow(root, names) {
  const all = groups.flatMap((g) => g.items)
  names.forEach((name, i) => {
    const item = all.find((x) => x.name === name)
    if (!item) return
    if (i > 0) {
      const arrow = el('li', 'flow-arrow', '→')
      arrow.setAttribute('aria-hidden', 'true')
      root.append(arrow)
    }
    const li = el('li', 'tool')
    li.append(iconNode(item), el('span', 'tn', item.name))
    root.append(li)
  })
}
