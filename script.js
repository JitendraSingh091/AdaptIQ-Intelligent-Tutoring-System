// DARK MODE 
function initDarkMode() {
  const saved = localStorage.getItem('adaptiq_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const toggles = document.querySelectorAll('.dark-toggle');
  toggles.forEach(t => t.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('adaptiq_theme', next);
  }));
}

/* ── NAVBAR ACTIVE LINK ─────────────────────────────────── */
function initNavActive() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });
}

/* ── MOBILE MENU ────────────────────────────────────────── */
function initMobileMenu() {
  const ham  = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.mobile-close');
  if (!ham || !menu) return;
  ham.addEventListener('click',   () => menu.classList.add('open'));
  close?.addEventListener('click',() => menu.classList.remove('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

/* ── TOAST ──────────────────────────────────────────────── */
function showToast(msg, duration = 3200) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/* ── STORAGE HELPERS ────────────────────────────────────── */
const Store = {
  get:    (k)    => { try { return JSON.parse(localStorage.getItem('adaptiq_' + k)); } catch { return null; } },
  set:    (k, v) => localStorage.setItem('adaptiq_' + k, JSON.stringify(v)),
  remove: (k)    => localStorage.removeItem('adaptiq_' + k),
};

/* ── ANIMATE NUMBERS ────────────────────────────────────── */
function animateNum(el, from, to, suffix = '', duration = 1200) {
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (to - from) * eased) + suffix;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── ANIMATE PROGRESS BARS ON SCROLL ───────────────────── */
function initProgressBars() {
  const bars = document.querySelectorAll('[data-width]');
  const obs  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => { b.style.width = '0%'; obs.observe(b); });
}

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initNavActive();
  initMobileMenu();
  initProgressBars();
});



//   QUIZ ENGINE
const QUESTIONS = [
  {
    id:1, category:'Programming Fundamentals',
    q:'What is the correct way to declare a variable in JavaScript?',
    opts:['variable x = 5','var x = 5','v x = 5','declare x = 5'],
    ans:1, topic:'variables'
  },
  {
    id:2, category:'Programming Fundamentals',
    q:'Which of these is NOT a primitive data type in most programming languages?',
    opts:['Integer','String','Array','Boolean'],
    ans:2, topic:'data_types'
  },
  {
    id:3, category:'Data Structures',
    q:'What is the time complexity of searching in a hash table (average case)?',
    opts:['O(n)','O(log n)','O(1)','O(n²)'],
    ans:2, topic:'hash_tables'
  },
  {
    id:4, category:'Data Structures',
    q:'Which data structure follows the LIFO (Last In, First Out) principle?',
    opts:['Queue','Stack','Linked List','Tree'],
    ans:1, topic:'stack_queue'
  },
  {
    id:5, category:'Algorithms',
    q:'What is the best-case time complexity of Bubble Sort?',
    opts:['O(n²)','O(n log n)','O(n)','O(1)'],
    ans:2, topic:'sorting'
  },
  {
    id:6, category:'Algorithms',
    q:'Which algorithm uses a "divide and conquer" approach?',
    opts:['Bubble Sort','Insertion Sort','Merge Sort','Selection Sort'],
    ans:2, topic:'sorting'
  },
  {
    id:7, category:'Problem Solving',
    q:'What does Big O notation describe?',
    opts:['Memory usage only','Time complexity only','Algorithm efficiency (time/space)','Code readability'],
    ans:2, topic:'complexity'
  },
  {
    id:8, category:'Problem Solving',
    q:'In a binary search, you always search:',
    opts:['Randomly','The first half','The relevant half (divide and conquer)','The entire array'],
    ans:2, topic:'binary_search'
  },
  {
    id:9, category:'Logical Reasoning',
    q:'A function that calls itself is known as:',
    opts:['Iteration','Recursion','Abstraction','Encapsulation'],
    ans:1, topic:'recursion'
  },
  {
    id:10, category:'Logical Reasoning',
    q:'What will `2 + "3"` evaluate to in JavaScript?',
    opts:['5','TypeError','23','NaN'],
    ans:2, topic:'type_coercion'
  },
  {
    id:11, category:'Data Structures',
    q:'What is the height of a balanced binary tree with n nodes?',
    opts:['O(n)','O(log n)','O(n²)','O(1)'],
    ans:1, topic:'trees'
  },
  {
    id:12, category:'Algorithms',
    q:'Which searching algorithm requires the array to be sorted first?',
    opts:['Linear Search','Jump Search','Binary Search','Depth-First Search'],
    ans:2, topic:'binary_search'
  },
  {
    id:13, category:'Programming Fundamentals',
    q:'What is encapsulation in Object-Oriented Programming?',
    opts:['Inheriting properties from parent class','Bundling data and methods that operate on data','Overriding parent methods','Creating multiple instances'],
    ans:1, topic:'oop'
  },
  {
    id:14, category:'Problem Solving',
    q:'Which approach systematically explores all possible solutions?',
    opts:['Greedy Algorithm','Dynamic Programming','Backtracking','Divide and Conquer'],
    ans:2, topic:'backtracking'
  },
  {
    id:15, category:'Logical Reasoning',
    q:'If you have a sorted array of 1024 elements, how many steps does binary search need at most?',
    opts:['512','10','1024','100'],
    ans:1, topic:'binary_search'
  },
];

/* Topic groupings for skill gap analysis */
const TOPIC_MAP = {
  'Programming Fundamentals': ['variables','data_types','oop'],
  'Data Structures':          ['hash_tables','stack_queue','trees'],
  'Algorithms':               ['sorting','binary_search'],
  'Problem Solving':          ['complexity','binary_search','backtracking'],
  'Logical Reasoning':        ['recursion','type_coercion','binary_search'],
};

// Quiz State 
let quizState = {
  active:   false,
  current:  0,
  answers:  {},
  started:  false,
  finished: false,
  timeLeft: 20 * 60,
  interval: null,
};

function initQuiz() {
  const profileForm = document.getElementById('profileForm');
  const quizSection = document.getElementById('quizSection');
  const startBtn    = document.getElementById('startQuizBtn');

  if (profileForm) {
    profileForm.addEventListener('submit', e => {
      e.preventDefault();
      const name   = document.getElementById('pName')?.value?.trim();
      const email  = document.getElementById('pEmail')?.value?.trim();
      const domain = document.getElementById('pDomain')?.value;
      const level  = document.getElementById('pLevel')?.value;
      if (!name || !email || !domain || !level) { showToast('⚠️ Please fill all profile fields.'); return; }
      Store.set('profile', { name, email, domain, level, date: new Date().toISOString() });
      showToast(`Welcome, ${name}! Profile saved.`);
      updateProfileDisplay();
      if (startBtn) startBtn.disabled = false;
    });
  }

  // Restore saved profile
  const sp = Store.get('profile');
  if (sp) { fillProfileForm(sp); updateProfileDisplay(); if (startBtn) startBtn.disabled = false; }

  if (startBtn) startBtn.addEventListener('click', startQuiz);

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const subBtn  = document.getElementById('submitBtn');
  if (prevBtn) prevBtn.addEventListener('click', () => navigateQuestion(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateQuestion(1));
  if (subBtn)  subBtn.addEventListener('click',  finishQuiz);
}

function fillProfileForm(p) {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  set('pName', p.name); set('pEmail', p.email); set('pDomain', p.domain); set('pLevel', p.level);
}

function updateProfileDisplay() {
  const p = Store.get('profile');
  if (!p) return;
  const nameEl   = document.getElementById('profileDisplayName');
  const metaEl   = document.getElementById('profileDisplayMeta');
  const avatarEl = document.getElementById('profileAvatar');
  if (nameEl)   nameEl.textContent = p.name;
  if (metaEl)   metaEl.textContent = p.domain + ' · ' + (p.level ? p.level.charAt(0).toUpperCase() + p.level.slice(1) : '');
  if (avatarEl) avatarEl.textContent = p.name ? p.name.charAt(0).toUpperCase() : '🎓';
}

function startQuiz() {
  const p = Store.get('profile');
  if (!p) { showToast('⚠️ Please complete your profile first.'); return; }
  quizState = { active: true, current: 0, answers: {}, started: true, finished: false, timeLeft: 20 * 60, interval: null };
  document.getElementById('profileSection')?.classList.add('hidden-section');
  const qs = document.getElementById('quizSection');
  if (qs) { qs.style.display = 'block'; qs.scrollIntoView({ behavior: 'smooth' }); }
  renderQuestion();
  startTimer();
}

function startTimer() {
  const el = document.getElementById('timerDisplay');
  const box = document.getElementById('timerBox');
  clearInterval(quizState.interval);
  quizState.interval = setInterval(() => {
    quizState.timeLeft--;
    const m = String(Math.floor(quizState.timeLeft / 60)).padStart(2,'0');
    const s = String(quizState.timeLeft % 60).padStart(2,'0');
    if (el) el.textContent = `${m}:${s}`;
    if (quizState.timeLeft <= 120) box?.classList.add('urgent');
    if (quizState.timeLeft <= 0) { clearInterval(quizState.interval); finishQuiz(); }
  }, 1000);
}

function renderQuestion() {
  const q   = QUESTIONS[quizState.current];
  const tot = QUESTIONS.length;
  const idx = quizState.current;

  // Counter & progress
  const counter = document.getElementById('qCounter');
  const bar     = document.getElementById('quizProgressBar');
  if (counter) counter.textContent = `Question ${idx + 1} of ${tot}`;
  if (bar) bar.style.width = ((idx + 1) / tot * 100) + '%';

  // Dots
  const dotsEl = document.getElementById('questionDots');
  if (dotsEl) {
    dotsEl.innerHTML = '';
    QUESTIONS.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'q-dot' + (quizState.answers[i] !== undefined ? ' answered' : '') + (i === idx ? ' current' : '');
      dotsEl.appendChild(d);
    });
  }

  // Question
  const catEl  = document.getElementById('questionCategory');
  const textEl = document.getElementById('questionText');
  if (catEl)  catEl.textContent  = q.category;
  if (textEl) textEl.textContent = q.q;

  // Options
  const grid = document.getElementById('optionsGrid');
  if (grid) {
    grid.innerHTML = '';
    const letters = ['A','B','C','D'];
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn' + (quizState.answers[idx] === i ? ' selected' : '');
      btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${opt}</span>`;
      btn.addEventListener('click', () => selectOption(i));
      grid.appendChild(btn);
    });
  }

  // Nav buttons
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const subBtn  = document.getElementById('submitBtn');
  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) { nextBtn.style.display = idx < tot - 1 ? 'flex' : 'none'; }
  if (subBtn)  { subBtn.style.display  = idx === tot - 1 ? 'flex' : 'none'; }
}

function selectOption(optIdx) {
  quizState.answers[quizState.current] = optIdx;
  renderQuestion();
}

function navigateQuestion(dir) {
  const newIdx = quizState.current + dir;
  if (newIdx >= 0 && newIdx < QUESTIONS.length) {
    quizState.current = newIdx;
    const card = document.getElementById('questionCard');
    if (card) { card.style.animation = 'none'; void card.offsetWidth; card.style.animation = ''; }
    renderQuestion();
  }
}

function finishQuiz() {
  clearInterval(quizState.interval);
  quizState.finished = true;

  // Score
  let correct = 0;
  const topicScores = {};
  QUESTIONS.forEach((q, i) => {
    if (!topicScores[q.category]) topicScores[q.category] = { total: 0, correct: 0 };
    topicScores[q.category].total++;
    if (quizState.answers[i] === q.ans) {
      correct++;
      topicScores[q.category].correct++;
    }
  });

  const result = {
    score: correct,
    total: QUESTIONS.length,
    pct:   Math.round(correct / QUESTIONS.length * 100),
    topicScores,
    answers: quizState.answers,
    date: new Date().toISOString(),
  };
  Store.set('result', result);

  // Hide quiz, show results
  document.getElementById('quizSection')?.style?.setProperty('display', 'none');
  const rs = document.getElementById('resultsSection');
  if (rs) { rs.style.display = 'block'; rs.scrollIntoView({ behavior: 'smooth' }); }
  renderResults(result);
}

function renderResults(result) {
  const scoreEl = document.getElementById('resultScore');
  const gradeEl = document.getElementById('resultGrade');
  const msgEl   = document.getElementById('resultMsg');
  const skillEl = document.getElementById('skillAnalysis');

  if (scoreEl) scoreEl.textContent = `${result.score} / ${result.total}`;
  const { grade, msg } = getGrade(result.pct);
  if (gradeEl) gradeEl.textContent = grade;
  if (msgEl)   msgEl.textContent   = msg;

  // Skill analysis bars
  if (skillEl) {
    skillEl.innerHTML = '';
    Object.entries(result.topicScores).forEach(([topic, data]) => {
      const pct    = Math.round(data.correct / data.total * 100);
      const level  = getSkillLevel(pct);
      const color  = level === 'Strong' ? 'pb-green' : level === 'Moderate' ? 'pb-amber' : 'pb-orange';
      const badge  = level === 'Strong' ? 'sl-strong'   : level === 'Moderate' ? 'sl-moderate' : 'sl-weak';
      skillEl.innerHTML += `
        <div class="sa-row fade-up">
          <div class="sa-name">${topic}</div>
          <div class="sa-bar">
            <div class="progress-track"><div class="progress-bar ${color}" data-width="${pct}" style="width:0%"></div></div>
          </div>
          <div class="sa-badge"><span class="skill-level ${badge}">${level}</span></div>
        </div>`;
    });
    setTimeout(initProgressBars, 100);
  }
}

function getGrade(pct) {
  if (pct >= 90) return { grade: 'A+ Distinction',    msg: 'Outstanding! You demonstrate exceptional mastery.' };
  if (pct >= 80) return { grade: 'A  Excellent',       msg: 'Excellent work! Strong command across all topics.' };
  if (pct >= 70) return { grade: 'B  Proficient',      msg: 'Good job! Minor gaps to address for full mastery.' };
  if (pct >= 55) return { grade: 'C  Developing',      msg: 'You\'re on track — targeted practice will close your gaps.' };
  if (pct >= 40) return { grade: 'D  Foundational',    msg: 'Build your foundation with core resources first.' };
  return                { grade: 'F  Needs Review',    msg: 'Start from the basics — structured learning will get you there.' };
}

function getSkillLevel(pct) {
  if (pct >= 70) return 'Strong';
  if (pct >= 45) return 'Moderate';
  return 'Weak';
}


//   DASHBOARD ENGINE
function initDashboard() {
  const result  = Store.get('result');
  const profile = Store.get('profile');
  if (!result || !profile) {
    const noDataEl = document.getElementById('noDataMsg');
    if (noDataEl) noDataEl.style.display = 'block';
    const dashContent = document.getElementById('dashContent');
    if (dashContent) dashContent.style.display = 'none';
    return;
  }

  // Profile
  setEl('dashName',   profile.name);
  setEl('dashEmail',  profile.email);
  setEl('dashDomain', profile.domain);
  setEl('dashLevel',  profile.level ? profile.level.charAt(0).toUpperCase() + profile.level.slice(1) : '');
  const avatarEl = document.getElementById('dashAvatar');
  if (avatarEl) avatarEl.textContent = profile.name ? profile.name.charAt(0).toUpperCase() : '🎓';

  // Score ring
  const ring = document.getElementById('scoreRingFill');
  if (ring) {
    const circ = 2 * Math.PI * 54; // r=54
    setTimeout(() => {
      ring.style.strokeDashoffset = circ - (circ * result.pct / 100);
    }, 300);
  }
  setEl('dashScoreVal', result.pct + '%');
  setEl('dashScoreLabel', `${result.score} / ${result.total} Correct`);

  // Stats
  const correct  = result.score;
  const wrong    = result.total - result.score;
  const elapsed  = result.date ? Math.floor((Date.now() - new Date(result.date).getTime()) / 1000 / 60) : 0;
  setEl('statCorrect', correct);
  setEl('statWrong',   wrong);
  setEl('statPct',     result.pct + '%');

  // Skill analysis
  const skillEl = document.getElementById('dashSkillAnalysis');
  if (skillEl) {
    skillEl.innerHTML = '';
    Object.entries(result.topicScores).forEach(([topic, data]) => {
      const pct   = Math.round(data.correct / data.total * 100);
      const level = getSkillLevel(pct);
      const color = level === 'Strong' ? 'pb-green' : level === 'Moderate' ? 'pb-amber' : 'pb-orange';
      const badge = level === 'Strong' ? 'sl-strong' : level === 'Moderate' ? 'sl-moderate' : 'sl-weak';
      skillEl.innerHTML += `
        <div class="sa-row">
          <div class="sa-name">${topic}</div>
          <div class="sa-bar"><div class="progress-track"><div class="progress-bar ${color}" data-width="${pct}" style="width:0%"></div></div></div>
          <div class="sa-badge"><span class="skill-level ${badge}">${level}</span></div>
        </div>`;
    });
    setTimeout(initProgressBars, 200);
  }

  // Recommendations based on weak topics
  const recEl = document.getElementById('dashRecs');
  if (recEl) {
    recEl.innerHTML = '';
    const recs = buildRecommendations(result.topicScores);
    recs.forEach((r, i) => {
      recEl.innerHTML += `
        <div class="rec-item fade-up" style="animation-delay:${i * 0.07}s">
          <div class="rec-num">${i + 1}</div>
          <div>
            <div class="rec-text">${r.title}</div>
            <div class="rec-desc">${r.desc}</div>
          </div>
          <span class="badge badge-${r.tagColor}">${r.tag}</span>
        </div>`;
    });
  }

  // Retake button
  const retakeBtn = document.getElementById('retakeBtn');
  if (retakeBtn) retakeBtn.addEventListener('click', () => { window.location.href = 'assessment.html'; });

  // Date taken
  if (result.date) {
    const dateEl = document.getElementById('assessmentDate');
    if (dateEl) dateEl.textContent = new Date(result.date).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  }
}

function buildRecommendations(topicScores) {
  const recs = [];
  const allRecs = {
    'Programming Fundamentals': [
      { title:'Variables, Types & Operators', desc:'Review core data types, type coercion, and variable scoping.', tag:'Foundation', tagColor:'orange' },
      { title:'Object-Oriented Programming', desc:'Practice encapsulation, inheritance, and polymorphism with examples.', tag:'OOP', tagColor:'amber' },
    ],
    'Data Structures': [
      { title:'Arrays and Strings', desc:'Master array manipulation, slicing, and string operations.', tag:'Priority', tagColor:'orange' },
      { title:'Stacks, Queues & Hash Tables', desc:'Implement each structure from scratch to understand internals.', tag:'Core', tagColor:'amber' },
      { title:'Trees and Graphs', desc:'Study BFS/DFS traversal and balanced tree properties.', tag:'Intermediate', tagColor:'green' },
    ],
    'Algorithms': [
      { title:'Sorting Algorithms', desc:'Understand Merge Sort, Quick Sort, and their trade-offs.', tag:'Key Skill', tagColor:'orange' },
      { title:'Binary Search', desc:'Implement binary search variants and recognize applicable patterns.', tag:'Essential', tagColor:'amber' },
    ],
    'Problem Solving': [
      { title:'Big-O Complexity Analysis', desc:'Learn to evaluate time and space complexity for any algorithm.', tag:'Analysis', tagColor:'amber' },
      { title:'Backtracking & Recursion', desc:'Solve problems using recursive decomposition and pruning.', tag:'Advanced', tagColor:'green' },
    ],
    'Logical Reasoning': [
      { title:'Recursion Basics', desc:'Practice base cases, recursive calls, and call stack visualization.', tag:'Fundamentals', tagColor:'orange' },
      { title:'Problem Decomposition', desc:'Break complex problems into smaller, solvable sub-problems.', tag:'Strategy', tagColor:'green' },
    ],
  };

  // Prioritize weak topics first
  const sorted = Object.entries(topicScores).sort((a, b) => {
    const pa = a[1].correct / a[1].total;
    const pb = b[1].correct / b[1].total;
    return pa - pb;
  });

  sorted.forEach(([topic]) => {
    if (allRecs[topic]) allRecs[topic].forEach(r => recs.push(r));
  });

  return recs.slice(0, 6);
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}


//   CONTACT FORM

function initContact() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const fields = [
      { id: 'cName',    errId: 'errName',    msg: 'Please enter your name.' },
      { id: 'cEmail',   errId: 'errEmail',   msg: 'Please enter a valid email.',   type: 'email' },
      { id: 'cMessage', errId: 'errMessage', msg: 'Please write a message.' },
    ];
    fields.forEach(f => {
      const el  = document.getElementById(f.id);
      const err = document.getElementById(f.errId);
      let ok = el?.value?.trim().length > 0;
      if (f.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el?.value || '');
      err?.classList.toggle('show', !ok);
      if (!ok) valid = false;
    });
    if (valid) {
      form.style.display = 'none';
      const success = document.getElementById('formSuccess');
      if (success) { success.classList.add('show'); success.scrollIntoView({ behavior: 'smooth' }); }
      showToast('✓ Message sent successfully!');
    }
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}


//   PAGE-SPECIFIC INITS
document.addEventListener('DOMContentLoaded', () => {
  // Assessment page
  if (document.getElementById('profileForm')) initQuiz();
  // Dashboard page
  if (document.getElementById('dashContent') || document.getElementById('noDataMsg')) initDashboard();
  // Contact page
  if (document.getElementById('contactForm')) initContact();

  // Hero counter animation
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateNum(el, 0, target, el.dataset.suffix || '', 1400);
        obs.disconnect();
      }
    });
    obs.observe(el);
  });
});
