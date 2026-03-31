// ============================================
//  HEALTH & LIFE — app.js  (shared logic)
// ============================================

/* ---------- PAGE TRANSITION ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-transition');
});
document.querySelectorAll && document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
  e.preventDefault();
  document.body.style.opacity = '0';
  document.body.style.transform = 'translateY(-8px)';
  document.body.style.transition = 'opacity .3s ease, transform .3s ease';
  setTimeout(() => { window.location.href = href; }, 300);
});

/* ---------- SCROLL REVEAL ---------- */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

/* ---------- ACTIVE NAV LINK ---------- */
(function highlightNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .bottom-nav-item').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === 'index.html' && href === 'index.html') ||
        (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ---------- BMI CALCULATOR ---------- */
const bmiForm = document.getElementById('bmiForm');
if (bmiForm) {
  bmiForm.addEventListener('submit', e => {
    e.preventDefault();
    const unit  = document.getElementById('unit').value;
    let weight = parseFloat(document.getElementById('weight').value);
    let height = parseFloat(document.getElementById('height').value);
    if (!weight || !height) return;
    let bmi;
    if (unit === 'imperial') {
      bmi = (703 * weight) / (height * height);
    } else {
      bmi = weight / ((height / 100) * (height / 100));
    }
    bmi = Math.round(bmi * 10) / 10;
    let category, color, advice;
    if (bmi < 18.5) {
      category = 'Underweight'; color = '#3b82f6'; advice = 'Focus on nutrient-rich foods to reach a healthy weight.';
    } else if (bmi < 25) {
      category = 'Healthy Weight'; color = '#2d6a4f'; advice = 'Great work! Keep maintaining your balanced diet and activity.';
    } else if (bmi < 30) {
      category = 'Overweight'; color = '#c8956c'; advice = 'Small dietary changes and regular exercise can help.';
    } else {
      category = 'Obese'; color = '#e63946'; advice = 'Consult a healthcare provider for a personalized plan.';
    }
    const maxBMI = 40;
    const pct = Math.min(bmi / maxBMI, 1);
    const circumference = 440;
    const offset = circumference - (circumference * pct);
    const resultEl = document.getElementById('bmiResult');
    const ring = document.getElementById('bmiRingProgress');
    ring.style.stroke = color;
    ring.style.strokeDashoffset = offset;
    document.getElementById('bmiNum').textContent = bmi;
    document.getElementById('bmiCategory').textContent = category;
    document.getElementById('bmiCategory').style.color = color;
    document.getElementById('bmiAdvice').textContent = advice;
    resultEl.classList.add('show');
  });
  document.getElementById('unit') && document.getElementById('unit').addEventListener('change', function() {
    const heightLabel = document.querySelector('label[for="height"]');
    const weightLabel = document.querySelector('label[for="weight"]');
    if (this.value === 'imperial') {
      if (heightLabel) heightLabel.textContent = 'Height (inches)';
      if (weightLabel) weightLabel.textContent = 'Weight (lbs)';
    } else {
      if (heightLabel) heightLabel.textContent = 'Height (cm)';
      if (weightLabel) weightLabel.textContent = 'Weight (kg)';
    }
  });
}

/* ---------- CALORIE DATABASE ---------- */
const CALORIE_DB = {
  'apple': { cal: 95, unit: '1 medium', protein: 0.5, carbs: 25 },
  'banana': { cal: 105, unit: '1 medium', protein: 1.3, carbs: 27 },
  'orange': { cal: 62, unit: '1 medium', protein: 1.2, carbs: 15 },
  'grapes': { cal: 104, unit: '1 cup', protein: 1.1, carbs: 27 },
  'strawberries': { cal: 49, unit: '1 cup', protein: 1, carbs: 12 },
  'blueberries': { cal: 84, unit: '1 cup', protein: 1.1, carbs: 21 },
  'watermelon': { cal: 86, unit: '2 cups', protein: 1.7, carbs: 22 },
  'mango': { cal: 99, unit: '1 cup', protein: 1.4, carbs: 25 },
  'avocado': { cal: 234, unit: '1 whole', protein: 2.9, carbs: 12 },
  'tomato': { cal: 22, unit: '1 medium', protein: 1.1, carbs: 5 },
  'broccoli': { cal: 55, unit: '1 cup', protein: 3.7, carbs: 11 },
  'spinach': { cal: 7, unit: '1 cup raw', protein: 0.9, carbs: 1 },
  'carrot': { cal: 52, unit: '1 medium', protein: 1.2, carbs: 12 },
  'potato': { cal: 163, unit: '1 medium', protein: 4.3, carbs: 37 },
  'sweet potato': { cal: 103, unit: '1 medium', protein: 2.3, carbs: 24 },
  'rice': { cal: 206, unit: '1 cup cooked', protein: 4.3, carbs: 45 },
  'brown rice': { cal: 216, unit: '1 cup cooked', protein: 4.5, carbs: 45 },
  'chicken breast': { cal: 165, unit: '100g', protein: 31, carbs: 0 },
  'salmon': { cal: 208, unit: '100g', protein: 20, carbs: 0 },
  'tuna': { cal: 132, unit: '100g', protein: 29, carbs: 0 },
  'egg': { cal: 70, unit: '1 large', protein: 6, carbs: 0.4 },
  'milk': { cal: 122, unit: '1 cup', protein: 8.1, carbs: 11.7 },
  'yogurt': { cal: 100, unit: '1 cup', protein: 17, carbs: 6 },
  'cheese': { cal: 113, unit: '1 oz', protein: 7, carbs: 0.4 },
  'bread': { cal: 79, unit: '1 slice', protein: 2.7, carbs: 15 },
  'pasta': { cal: 220, unit: '1 cup cooked', protein: 8.1, carbs: 43 },
  'oatmeal': { cal: 166, unit: '1 cup cooked', protein: 5.9, carbs: 28 },
  'almonds': { cal: 164, unit: '1 oz (23 nuts)', protein: 6, carbs: 6 },
  'peanut butter': { cal: 188, unit: '2 tbsp', protein: 8, carbs: 7 },
  'olive oil': { cal: 119, unit: '1 tbsp', protein: 0, carbs: 0 },
  'pizza': { cal: 285, unit: '1 slice', protein: 12.2, carbs: 36 },
  'burger': { cal: 354, unit: '1 patty', protein: 20, carbs: 27 },
  'coffee': { cal: 5, unit: '1 cup black', protein: 0.3, carbs: 0 },
  'orange juice': { cal: 112, unit: '1 cup', protein: 1.7, carbs: 26 },
  'soda': { cal: 140, unit: '12 oz can', protein: 0, carbs: 39 },
  'chocolate': { cal: 155, unit: '1 oz', protein: 2.2, carbs: 17 },
  'ice cream': { cal: 273, unit: '1 cup', protein: 4.7, carbs: 31 },
  'salad': { cal: 20, unit: '1 cup', protein: 1.5, carbs: 3.5 },
  'soup': { cal: 75, unit: '1 cup', protein: 5, carbs: 10 },
  'beans': { cal: 227, unit: '1 cup cooked', protein: 15, carbs: 41 },
  'lentils': { cal: 230, unit: '1 cup cooked', protein: 17.9, carbs: 40 },
  'tofu': { cal: 76, unit: '100g', protein: 8, carbs: 2 },
};

/* ---------- CALORIE COUNTER ---------- */
const calorieInput = document.getElementById('calorieInput');
const calorieBtn   = document.getElementById('calorieSearchBtn');
const calorieList  = document.getElementById('calorieResults');
const calRingFill  = document.getElementById('calRingFill');
const calConsumed  = document.getElementById('calConsumed');
let totalCal = 0;
const DAILY_GOAL = 2000;

function updateCalRing() {
  const pct = Math.min(totalCal / DAILY_GOAL, 1);
  const circ = 440;
  const offset = circ - (circ * pct);
  if (calRingFill) calRingFill.style.strokeDashoffset = offset;
  if (calConsumed) calConsumed.textContent = totalCal;
}

function searchCalories(query) {
  if (!calorieList) return;
  const q = query.trim().toLowerCase();
  if (!q) return;
  const keys = Object.keys(CALORIE_DB).filter(k => k.includes(q));
  if (keys.length === 0) {
    calorieList.innerHTML = `<div class="calorie-no-result">🔍 No results for "<strong>${query}</strong>". Try: apple, chicken, rice…</div>`;
    return;
  }
  calorieList.innerHTML = '';
  keys.slice(0, 6).forEach(k => {
    const d = CALORIE_DB[k];
    const item = document.createElement('div');
    item.className = 'calorie-item';
    item.innerHTML = `
      <div>
        <div class="calorie-food">${k.charAt(0).toUpperCase()+k.slice(1)}</div>
        <div class="calorie-sub">${d.unit} · Protein ${d.protein}g · Carbs ${d.carbs}g</div>
      </div>
      <div style="text-align:right">
        <div class="calorie-val">${d.cal}</div>
        <div class="calorie-unit">kcal</div>
        <button onclick="addCalorie(${d.cal})" class="btn btn-sm btn-primary mt-1" style="padding:.3rem .8rem;font-size:.75rem">+ Add</button>
      </div>`;
    calorieList.appendChild(item);
  });
}

window.addCalorie = function(cal) {
  totalCal += cal;
  if (totalCal > 9999) totalCal = 9999;
  updateCalRing();
  // Show toast
  showToast(`+${cal} kcal added!`);
};

if (calorieBtn) {
  calorieBtn.addEventListener('click', () => searchCalories(calorieInput.value));
}
if (calorieInput) {
  calorieInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchCalories(calorieInput.value);
  });
  // Live suggest (debounced)
  let debTimer;
  calorieInput.addEventListener('input', () => {
    clearTimeout(debTimer);
    debTimer = setTimeout(() => {
      if (calorieInput.value.length >= 2) searchCalories(calorieInput.value);
    }, 300);
  });
}
updateCalRing();

/* ---------- WATER TRACKER ---------- */
const TOTAL_CUPS = 8;
let filledCups = parseInt(localStorage.getItem('hl_water') || '0', 10);
const waterCupsEl   = document.getElementById('waterCups');
const waterFillEl   = document.getElementById('waterFill');
const waterOzEl     = document.getElementById('waterOz');

function renderWater() {
  if (!waterCupsEl) return;
  waterCupsEl.innerHTML = '';
  for (let i = 0; i < TOTAL_CUPS; i++) {
    const btn = document.createElement('button');
    btn.className = 'cup-btn' + (i < filledCups ? ' filled' : '');
    btn.innerHTML = '💧';
    btn.setAttribute('aria-label', `Cup ${i+1}`);
    btn.addEventListener('click', () => {
      filledCups = (i < filledCups) ? i : i + 1;
      localStorage.setItem('hl_water', filledCups);
      renderWater();
    });
    waterCupsEl.appendChild(btn);
  }
  const pct = (filledCups / TOTAL_CUPS) * 100;
  if (waterFillEl) waterFillEl.style.height = pct + '%';
  if (waterOzEl)   waterOzEl.textContent = filledCups * 8;
}
renderWater();

window.addWater = function() {
  if (filledCups < TOTAL_CUPS) { filledCups++; localStorage.setItem('hl_water', filledCups); renderWater(); showToast('💧 Cup added!'); }
  else showToast('🎉 Daily goal reached!');
};
window.resetWater = function() {
  filledCups = 0; localStorage.setItem('hl_water', 0); renderWater(); showToast('Water tracker reset.');
};

/* ---------- TOAST NOTIFICATION ---------- */
function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%) translateY(10px)',
    background: 'var(--green-dark)', color: '#fff', padding: '.7rem 1.5rem',
    borderRadius: '100px', fontWeight: '600', fontSize: '.9rem',
    zIndex: '9999', boxShadow: '0 4px 16px rgba(0,0,0,.2)',
    opacity: '0', transition: 'all .3s ease'
  });
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => t.remove(), 300);
  }, 2200);
}

/* ---------- NEWSLETTER FORM ---------- */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    if (!input.value) return;
    showToast('🎉 Subscribed! Welcome to Health & Life!');
    input.value = '';
  });
}

/* ---------- RING ANIMATION ON LOAD ---------- */
window.addEventListener('load', () => {
  document.querySelectorAll('.ring-fill').forEach(ring => {
    const target = ring.getAttribute('data-offset');
    if (target !== null) {
      setTimeout(() => { ring.style.strokeDashoffset = target; }, 400);
    }
  });
  const bmiRing = document.getElementById('bmiRingProgress');
  if (bmiRing) bmiRing.style.strokeDashoffset = '440';
});
