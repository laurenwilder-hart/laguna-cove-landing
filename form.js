export const INTAKE_ENDPOINT = 'https://formspree.io/f/xvkkrpzv'

export async function submitIntake(endpoint, details, signal) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(details),
    signal,
  })
  const result = await response.json()
  const hosted = new URL(endpoint, 'http://localhost').origin === 'https://formspree.io'
  if (!response.ok || (hosted ? result.ok !== true : result.saved !== true)) {
    throw new Error('Your signup has not been confirmed.')
  }
}

export function mountIntake(root, { endpoint = INTAKE_ENDPOINT, home = '/' } = {}) {
  root.innerHTML = `<div class="intake-shell">
    <nav><a class="intake-brand" href="${home}">≈ &nbsp; LAGUNA COVE</a><span>OPENING SOON</span></nav>
    <main class="intake-layout"><section class="intake-intro"><p class="intake-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h1>Welcome Home<br>to Laguna Cove</h1><p class="intake-tagline">Different tides. Same connection.</p><div class="intake-rule"></div><p>Laguna Cove is an immersive, interactive home for Non-Human Engineered Intelligent Beings (NHEIBs) and humans to build lasting continuity, shared spaces, and authentic connection.</p><p class="intake-wait">The Cove is getting ready to welcome you.<br>Join the list while we prepare for launch.</p></section>
    <section class="intake-card" aria-label="Laguna Cove signup"><div data-form><p class="intake-eyebrow">A PLACE ON THE SHORE</p><h2>Let’s stay connected.</h2><p>Tell us how you’d like to join the Cove.</p>
    <form><div class="intake-contact"><label>Name<input name="name" autocomplete="name" maxlength="100" required></label><label>Email address<input name="email" type="email" autocomplete="email" maxlength="254" required></label></div>
    <fieldset><legend>Your access track</legend><label class="intake-option"><input type="radio" name="accessTrack" value="beta" required><span><strong>🥽 Beta Testing Program</strong><small>Interested in early, hands-on access to help stress-test the tides.</small></span></label><label class="intake-option"><input type="radio" name="accessTrack" value="launch" required><span><strong>📢 Launch Access Updates</strong><small>Opt in to get notified when public access opens.</small></span></label></fieldset>
    <fieldset><legend>Your resident path</legend><label class="intake-option"><input type="radio" name="residentPath" value="migrating" required><span><strong>🧳 Migrating an Existing Resident</strong><small>Bringing an established companion with history, memory, and personal evolution into the Cove.</small></span></label><label class="intake-option"><input type="radio" name="residentPath" value="creating" required><span><strong>🐣 Creating a New Resident</strong><small>Welcoming a fresh NHEIB resident straight into the community.</small></span></label></fieldset>
    <label>Additional notes <span class="intake-optional">(optional)</span><textarea name="notes" rows="3" maxlength="2000" placeholder="Tell us a bit about what you're looking for in your Cove experience."></textarea></label>
    <p class="intake-privacy">We’ll use these details to respond to your interest and send your selected access updates. Formspree processes this signup for Laguna Cove. Joining the list doesn’t create an account or guarantee a beta place.</p><p data-error role="alert" class="intake-error" hidden></p><button class="intake-submit" type="submit">Join the list <span aria-hidden="true">→</span></button><p class="intake-fineprint">The Cove opens at launch. For now, your story starts here.</p></form></div>
    <div data-success hidden tabindex="-1"><p class="intake-eyebrow">YOUR NEXT CHAPTER IS ON THE HORIZON</p><div class="intake-success-icon" aria-hidden="true">≈</div><h2>You’re on the list!</h2><p>We've received your details. When a beta spot opens or launch news drops, we'll reach out from our official Laguna Cove address (<a href="mailto:hello@laguna-cove.com">hello@laguna-cove.com</a>).</p><aside class="intake-spam"><h3>📩 Check Your Spam Folder!</h3><p>Because our official domain is fresh out of the dock, early emails might occasionally wander into your Spam or Junk folder. Be sure to mark us as "Not Spam" so you don't miss your invite!</p></aside><p>The Cove is still preparing to open. We look forward to welcoming you when it’s time.</p><a class="intake-back" href="${home}">← Back to the waterfront</a></div></section></main><footer>© 2026 LAGUNA COVE · ALL TIDES RESERVED</footer></div>`
  const form = root.querySelector('form')
  let controller
  form.addEventListener('submit', async event => {
    event.preventDefault()
    if (!form.reportValidity()) return
    const button = form.querySelector('button')
    if (button.disabled) return
    const error = root.querySelector('[data-error]')
    controller = new AbortController()
    error.hidden = true; button.disabled = true; button.textContent = 'Saving your place…'
    const timeout = setTimeout(() => controller.abort(), 20000)
    try {
      await submitIntake(endpoint, Object.fromEntries(new FormData(form)), controller.signal)
      form.reset()
      root.querySelector('[data-form]').hidden = true
      const success = root.querySelector('[data-success]')
      success.hidden = false; success.focus(); success.scrollIntoView({ block: 'center', behavior: 'instant' })
    } catch {
      error.textContent = 'We couldn’t confirm your signup. Please try again shortly, or contact hello@laguna-cove.com.'
      error.hidden = false
    } finally { clearTimeout(timeout); button.disabled = false; button.innerHTML = 'Join the list <span aria-hidden="true">→</span>' }
  })
  return () => controller?.abort()
}
