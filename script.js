const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

(function animateCursor() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;

  cursorDot.style.left  = mouseX - 5  + 'px';
  cursorDot.style.top   = mouseY - 5  + 'px';
  cursorRing.style.left = ringX  - 18 + 'px';
  cursorRing.style.top  = ringY  - 18 + 'px';

  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('button, a, .q-opt, .car-btn, .dot').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width   = '52px';
    cursorRing.style.height  = '52px';
    cursorRing.style.opacity = '0.8';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width   = '36px';
    cursorRing.style.height  = '36px';
    cursorRing.style.opacity = '0.5';
  });
});

const hamburgerBtn = document.getElementById('hbg');
const mobileNav    = document.getElementById('mobileNav');

hamburgerBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  hamburgerBtn.textContent = mobileNav.classList.contains('open') ? '✕' : '☰';
});

function closeNav() {
  mobileNav.classList.remove('open');
  hamburgerBtn.textContent = '☰';
}

function updateBreakpoint() {
  const width = window.innerWidth;
  const label = document.getElementById('bpText');

  if (width <= 580) {
    label.textContent  = '📱 Mobile ≤ 580px';
    label.style.color  = 'var(--pink)';
  } else if (width <= 900) {
    label.textContent  = '📟 Tablet 581–900px';
    label.style.color  = 'var(--orange)';
  } else {
    label.textContent  = '🖥 Desktop ≥ 901px';
    label.style.color  = 'var(--green)';
  }
}

window.addEventListener('resize', updateBreakpoint);

const questions = [
  {
    q:    "Which CSS property enables a Grid layout?",
    opts: ["display: block", "display: flex", "display: grid", "display: inline"],
    ans:  2,
    exp:  "display: grid activates CSS Grid. Use display: flex for Flexbox."
  },
  {
    q:    "What does the fetch() function return?",
    opts: ["A string", "An array", "A Promise", "A number"],
    ans:  2,
    exp:  "fetch() returns a Promise that resolves to a Response object."
  },
  {
    q:    "Which media query targets screens wider than 900px?",
    opts: ["@media (max-width:900px)", "@media (min-width:900px)", "@media screen", "@media (width:900px)"],
    ans:  1,
    exp:  "min-width targets screens ≥ the value specified."
  },
  {
    q:    "What does 'async/await' help you do?",
    opts: ["Style elements", "Handle Promises cleanly", "Select DOM nodes", "Add event listeners"],
    ans:  1,
    exp:  "async/await is syntactic sugar over Promises for cleaner async code."
  },
  {
    q:    "Which HTTP method does fetch() use by default?",
    opts: ["POST", "PUT", "DELETE", "GET"],
    ans:  3,
    exp:  "fetch() defaults to GET unless you specify a different method."
  }
];

let currentQuestion = 0;
let quizScore       = 0;
let hasAnswered     = false;

const LETTERS = ['A', 'B', 'C', 'D'];

function renderQuestion() {
  const q = questions[currentQuestion];

  document.getElementById('qCount').textContent      = `Question ${currentQuestion + 1} of ${questions.length}`;
  document.getElementById('qScoreLive').textContent  = `Score: ${quizScore}`;
  document.getElementById('progFill').style.width    = `${(currentQuestion / questions.length) * 100}%`;
  document.getElementById('qText').textContent       = q.q;
  document.getElementById('nextBtn').disabled        = true;

  hasAnswered = false;


  document.getElementById('qOpts').innerHTML = q.opts.map((opt, i) =>
    `<button class="q-opt" onclick="pickAnswer(${i})">
       <span class="q-letter">${LETTERS[i]}</span>${opt}
     </button>`
  ).join('');


  const fb = document.getElementById('qFb');
  fb.className = 'q-fb';
  fb.textContent = '';
}

function pickAnswer(selectedIndex) {
  if (hasAnswered) return;
  hasAnswered = true;

  const q    = questions[currentQuestion];
  const opts = document.querySelectorAll('.q-opt');
  const fb   = document.getElementById('qFb');


  opts.forEach((btn) => { btn.disabled = true; });

  if (selectedIndex === q.ans) {
    quizScore++;
    opts[selectedIndex].classList.add('correct');
    fb.textContent = '✓ Correct! ' + q.exp;
    fb.className   = 'q-fb show ok';
  } else {
    opts[selectedIndex].classList.add('wrong');
    opts[q.ans].classList.add('correct');
    fb.textContent = '✗ ' + q.exp;
    fb.className   = 'q-fb show bad';
  }

  document.getElementById('nextBtn').disabled       = false;
  document.getElementById('qScoreLive').textContent = `Score: ${quizScore}`;
}

function nextQ() {
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    showFinalScore();
  } else {
    renderQuestion();
  }
}

function showFinalScore() {
  document.getElementById('quizBody').style.display  = 'none';
  document.getElementById('scoreCard').style.display = 'block';

  const emojis = ['😅', '😐', '🙂', '🎉', '🏆'];
  const labels = ['Keep going!', 'Getting there!', 'Nice work!', 'Great job!', 'Perfect score! 🔥'];

  document.getElementById('sBig').textContent   = `${quizScore}/5`;
  document.getElementById('sEmoji').textContent = emojis[quizScore];
  document.getElementById('sSub').textContent   = labels[quizScore];
}

function resetQuiz() {
  currentQuestion = 0;
  quizScore       = 0;
  document.getElementById('quizBody').style.display  = 'block';
  document.getElementById('scoreCard').style.display = 'none';
  renderQuestion();
}

const carouselSlides = document.querySelectorAll('.car-slide');
const carouselTrack  = document.getElementById('carTrack');
const carouselDots   = document.getElementById('carDots');

let currentSlide   = 0;
let autoPlayTimer;

carouselDots.innerHTML = [...carouselSlides].map((_, i) =>
  `<div class="dot${i === 0 ? ' active' : ''}" onclick="goToSlide(${i})"></div>`
).join('');

function goToSlide(index) {
  currentSlide = (index + carouselSlides.length) % carouselSlides.length;
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() {
  goToSlide(currentSlide + 1);
  resetAutoPlay();
}

function prevSlide() {
  goToSlide(currentSlide - 1);
  resetAutoPlay();
}

function resetAutoPlay() {
  clearInterval(autoPlayTimer);
  autoPlayTimer = setInterval(() => goToSlide(currentSlide + 1), 3800);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft')  prevSlide();
});

let touchStartX = 0;

carouselTrack.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

carouselTrack.addEventListener('touchend', (e) => {
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(deltaX) > 40) {
    deltaX < 0 ? nextSlide() : prevSlide();
  }
});

async function fetchJoke() {
  const container = document.getElementById('jokeBody');
  container.innerHTML = '<div class="spinner"></div>';

  try {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
    const data     = await response.json();

    container.innerHTML = `
      <p class="joke-setup">${data.setup}</p>
      <div class="joke-delivery" id="jokePunch">${data.punchline}</div>
      <button class="punch-btn" onclick="revealPunchline()">Reveal punchline 👇</button>
      <p class="api-meta">
        Source: official-joke-api.appspot.com · Type: <span>${data.type}</span>
      </p>`;
  } catch (error) {
    container.innerHTML = '<p style="color:var(--pink);font-size:0.82rem">⚠ Could not load. Check your connection.</p>';
    console.error('Joke API error:', error);
  }
}

function revealPunchline() {
  document.getElementById('jokePunch').style.display = 'block';
  document.querySelector('.punch-btn').style.display = 'none';
}

async function fetchDog() {
  const container = document.getElementById('dogBody');
  container.innerHTML = '<div class="spinner"></div>';

  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data     = await response.json();


    const breed = data.message.split('/breeds/')[1]?.split('/')[0]?.replace('-', ' ') || 'dog';

    container.innerHTML = `
      <div class="dog-img-wrap">
        <img src="${data.message}" alt="Random ${breed}" loading="lazy" />
      </div>
      <p class="api-meta">Breed: <span>${breed}</span> · Source: dog.ceo/api</p>`;
  } catch (error) {
    container.innerHTML = '<p style="color:var(--pink);font-size:0.82rem">⚠ Could not load image.</p>';
    console.error('Dog API error:', error);
  }
}

updateBreakpoint();
renderQuestion();
resetAutoPlay();
fetchJoke();
fetchDog();