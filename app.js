/* ==========================================================================
   Bands4U — navigation + interactive bits
   Everything is vanilla JS. No dependencies.
   ========================================================================== */

/* ----- Goal data (used by goal detail + previews) ----- */
const GOALS = {
  laptop: {
    emoji: '💻',
    name: 'New Laptop',
    saved: 540, target: 1200,
    deadline: 'Aug 10, 2026',
    daysLeft: 115, behind: '14 days',
    weekly: 45, paceMsg: 'Save <strong>$45/week</strong> to stay on track and hit your goal by Aug 10.',
  },
  emergency: {
    emoji: '🛟',
    name: 'Emergency Fund',
    saved: 400, target: 500,
    deadline: 'May 30, 2026',
    daysLeft: 43, behind: 'On track',
    weekly: 17, paceMsg: 'You\'re ahead! Keep saving <strong>$17/week</strong> to wrap this up early.',
  },
  japan: {
    emoji: '🗼',
    name: 'Japan Trip',
    saved: 200, target: 2500,
    deadline: 'Dec 20, 2026',
    daysLeft: 247, behind: '22 days',
    weekly: 65, paceMsg: 'Save <strong>$65/week</strong> to hit your goal by Dec 20.',
  },
};

/* Track currently viewed goal so Goal Impact can use it */
let currentGoalKey = 'laptop';

/* ==========================================================================
   Screen navigation
   ========================================================================== */
const MAIN_SCREENS = ['dashboard', 'goals', 'monthly', 'profile'];

function go(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + screenId);
  if (target) {
    target.classList.add('active');
    target.scrollTop = 0;
  }

  // Show tab bar only on the four main screens; highlight the active tab.
  const tabBar = document.getElementById('tab-bar');
  if (MAIN_SCREENS.includes(screenId)) {
    tabBar.classList.add('visible');
    tabBar.querySelectorAll('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.target === screenId);
    });
  } else {
    tabBar.classList.remove('visible');
  }
}

function openGoal(key) {
  currentGoalKey = key;
  const g = GOALS[key];
  const pct = Math.round((g.saved / g.target) * 100);

  // circumference = 2 * PI * 82 ≈ 515.22
  const CIRC = 515.22;
  const dash = (pct / 100) * CIRC;
  const ring = document.getElementById('gd-ring');
  ring.setAttribute('stroke-dasharray', `${dash.toFixed(2)} ${CIRC.toFixed(2)}`);

  document.getElementById('gd-name').textContent = g.name;
  document.getElementById('gd-pct').textContent = pct + '%';
  document.getElementById('gd-saved').textContent = `$${g.saved.toLocaleString()} of $${g.target.toLocaleString()}`;
  document.getElementById('gd-remaining').textContent = '$' + (g.target - g.saved).toLocaleString();
  document.getElementById('gd-days').textContent = g.daysLeft;
  const behindEl = document.getElementById('gd-behind');
  behindEl.textContent = g.behind;
  behindEl.classList.toggle('text-accent', g.behind !== 'On track');
  behindEl.classList.toggle('text-primary-green', g.behind === 'On track');
  document.getElementById('gd-pace-msg').innerHTML = g.paceMsg;

  go('goal-detail');
}

/* ==========================================================================
   Expense/Income keypad + chip selection
   ========================================================================== */
function initKeypad(keypadId, displayId) {
  const keypad = document.getElementById(keypadId);
  const display = document.getElementById(displayId);
  let raw = ''; // digits + optional "."

  function render() {
    if (!raw) {
      display.textContent = '0.00';
      display.classList.add('placeholder');
      return;
    }
    display.classList.remove('placeholder');
    // Format with commas + 2 decimals if "."
    const num = parseFloat(raw);
    if (isNaN(num)) { display.textContent = raw; return; }
    if (raw.includes('.')) {
      const [whole, dec = ''] = raw.split('.');
      const w = (parseInt(whole || '0')).toLocaleString();
      display.textContent = `${w}.${dec.padEnd(2, '0').slice(0, 2)}`;
    } else {
      display.textContent = num.toLocaleString();
    }
  }

  keypad.addEventListener('click', (e) => {
    const btn = e.target.closest('.key');
    if (!btn) return;
    const k = btn.dataset.k;
    if (k === 'back') {
      raw = raw.slice(0, -1);
    } else if (k === '.') {
      if (!raw.includes('.')) raw = (raw || '0') + '.';
    } else {
      // cap at reasonable length
      if (raw.replace('.', '').length >= 8) return;
      if (raw.includes('.') && raw.split('.')[1].length >= 2) return;
      raw += k;
    }
    render();
  });

  // Expose reset for save handlers
  return { reset: () => { raw = ''; render(); } };
}

function initChips(containerId) {
  const el = document.getElementById(containerId);
  el.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    el.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
}

const expenseKeypad = initKeypad('expense-keypad', 'expense-amount');
const incomeKeypad = initKeypad('income-keypad', 'income-amount');
initChips('expense-chips');
initChips('income-chips');

function saveExpense() {
  flashToast('Expense saved ✓');
  expenseKeypad.reset();
  go('dashboard');
}
function saveIncome() {
  flashToast('Income saved ✓');
  incomeKeypad.reset();
  go('dashboard');
}
function saveGoal() {
  flashToast('Goal created 🎯');
  go('goals');
}

/* Simple toast */
function flashToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  t.style.cssText = `
    position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%);
    background: #2C3E50; color: white; padding: 12px 20px; border-radius: 999px;
    font-size: 14px; font-weight: 500; box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    z-index: 100; animation: toastIn 0.25s ease;
  `;
  document.getElementById('phone').appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; }, 1400);
  setTimeout(() => t.remove(), 1800);
}

/* ==========================================================================
   Goal Impact — interactive sliders
   Model: each $1 cut per week → 0.6 days earlier (so $20 = 12 days).
   Current pace lands 14 days behind target; sliders close that gap and can push past.
   ========================================================================== */
const sliderFood = document.getElementById('slider-food');
const sliderSub = document.getElementById('slider-sub');
const sliderEnt = document.getElementById('slider-ent');
const msgEl = document.getElementById('impact-msg');
const foodVal = document.getElementById('s-food-val');
const subVal = document.getElementById('s-sub-val');
const entVal = document.getElementById('s-ent-val');
const markerCurrent = document.getElementById('marker-current');
const labelCurTop = document.getElementById('label-current-top');
const labelCurDate = document.getElementById('label-current-date');
const gapDaysLabel = document.getElementById('gap-days-label');
const gapFill = document.getElementById('gap-fill');

const TARGET_DATE = new Date(2026, 5, 1); // Jun 1, 2026
const BASE_BEHIND_DAYS = 14;

function formatDate(d) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function updateImpact() {
  const food = +sliderFood.value;
  const sub = +sliderSub.value;
  const ent = +sliderEnt.value;

  foodVal.textContent = `$${food}/week`;
  subVal.textContent = `$${sub}/week`;
  entVal.textContent = `$${ent}/week`;

  const totalCut = food + sub + ent;
  const daysImproved = Math.round(totalCut * 0.6);
  const netDays = BASE_BEHIND_DAYS - daysImproved; // positive = still behind, negative = ahead

  // Current finish = Jun 15 base; each day improved moves marker left
  const finish = new Date(TARGET_DATE);
  finish.setDate(finish.getDate() + Math.max(netDays, -30));

  // Position marker along timeline.
  // Left anchor: Jun 1 at 25%, Jun 15 at 80%. 14 days = 55% of track.
  // 1 day ≈ 55/14 ≈ 3.93% per day
  const pctPerDay = 55 / BASE_BEHIND_DAYS;
  const clampedNetDays = Math.max(-20, Math.min(20, netDays));
  const markerPct = Math.max(5, Math.min(92, 25 + clampedNetDays * pctPerDay));
  markerCurrent.style.left = markerPct + '%';
  labelCurTop.style.left = markerPct + '%';
  labelCurDate.style.left = markerPct + '%';
  labelCurDate.textContent = formatDate(finish);

  // Gap fill width
  if (markerPct >= 25) {
    gapFill.style.left = '25%';
    gapFill.style.right = (100 - markerPct) + '%';
    gapFill.style.background = 'var(--accent)';
  } else {
    gapFill.style.left = markerPct + '%';
    gapFill.style.right = (100 - 25) + '%';
    gapFill.style.background = 'var(--primary)';
  }

  // Status label
  if (netDays > 0) {
    gapDaysLabel.textContent = `${netDays} days behind`;
    gapDaysLabel.className = 'text-accent';
    gapDaysLabel.style.fontWeight = '600';
  } else if (netDays === 0) {
    gapDaysLabel.textContent = 'On track ✓';
    gapDaysLabel.className = 'text-primary-green';
    gapDaysLabel.style.fontWeight = '600';
  } else {
    gapDaysLabel.textContent = `${Math.abs(netDays)} days ahead ✓`;
    gapDaysLabel.className = 'text-primary-green';
    gapDaysLabel.style.fontWeight = '600';
  }

  // Dynamic message — reflect dominant slider when only one moved
  if (totalCut === 0) {
    msgEl.innerHTML = 'Drag any slider to see the impact on your goal.';
    return;
  }

  let leadCategory = 'Dining';
  let leadAmount = food;
  if (sub > leadAmount) { leadCategory = 'Subscriptions'; leadAmount = sub; }
  if (ent > leadAmount) { leadCategory = 'Entertainment'; leadAmount = ent; }

  const moreThanOne = [food, sub, ent].filter(v => v > 0).length > 1;

  if (moreThanOne) {
    if (netDays > 0) {
      msgEl.innerHTML = `Saving <strong>$${totalCut}/week</strong> across categories brings your goal <strong>${daysImproved} days earlier</strong> — ${netDays} days still to close.`;
    } else if (netDays === 0) {
      msgEl.innerHTML = `Saving <strong>$${totalCut}/week</strong> across categories puts you <strong>right on target</strong> for Jun 1.`;
    } else {
      msgEl.innerHTML = `Saving <strong>$${totalCut}/week</strong> finishes your goal <strong>${Math.abs(netDays)} days early</strong>. 🎉`;
    }
  } else {
    msgEl.innerHTML = `Cutting <strong>${leadCategory}</strong> by <strong>$${leadAmount}/week</strong> = reach goal <strong>${daysImproved} days earlier</strong>.`;
  }
}

[sliderFood, sliderSub, sliderEnt].forEach(s => s.addEventListener('input', updateImpact));

/* init once so positions are correct */
updateImpact();

/* Keyboard shortcut: "R" resets to splash (useful for demos) */
document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      go('splash');
    }
  }
});
