/* Basic Computer Learning — shared JS. No libraries. Every block guards
   for its own elements, so this file is safe to load on every page. */
(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('siteNav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ---------- Active nav highlighting ---------- */
  var here = (location.pathname.split('/').pop() || 'index.html').split('?')[0].split('#')[0];
  document.querySelectorAll('.site-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Excel mini spreadsheet (excel.html) ---------- */
  var excelInputs = document.querySelectorAll('#miniSheet input[type="number"]');
  function updateSheet() {
    var vals = [];
    excelInputs.forEach(function (inp) {
      var v = parseFloat(inp.value);
      vals.push(isNaN(v) ? 0 : v);
    });
    var count = 0, sum = 0;
    excelInputs.forEach(function (inp) { if (inp.value !== '' && !isNaN(parseFloat(inp.value))) count++; });
    vals.forEach(function (v) { sum += v; });
    var set = function (id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };
    set('sheetSum', sum);
    set('sheetAvg', count ? (sum / count).toFixed(2) : '0');
    set('sheetCount', count);
    set('sheetMax', count ? Math.max.apply(null, excelInputsAsNumbers()) : '—');
    function excelInputsAsNumbers() {
      var out = [];
      excelInputs.forEach(function (inp) { if (inp.value !== '') out.push(parseFloat(inp.value)); });
      return out.length ? out : [0];
    }
  }
  if (excelInputs.length) {
    excelInputs.forEach(function (inp) { inp.addEventListener('input', updateSheet); });
    updateSheet();
  }

  /* ---------- Quiz (quiz.html) ---------- */
  var QUESTIONS = [
    { q: 'What is a computer?', a: ['A machine that takes input, processes it, and gives output', 'A type of television only', 'A box that only stores photos', 'A musical instrument'], c: 0, e: 'A computer accepts input (like typing), processes it, stores it, and gives output (like text on a screen).' },
    { q: 'Which of these is an input device?', a: ['Monitor', 'Printer', 'Keyboard', 'Speaker'], c: 2, e: 'A keyboard sends information INTO the computer. A monitor, printer and speaker give information OUT.' },
    { q: 'Which of these is an output device?', a: ['Mouse', 'Keyboard', 'Scanner', 'Monitor'], c: 3, e: 'A monitor shows the result on screen — that is output. A mouse, keyboard and scanner are input devices.' },
    { q: 'What does CPU stand for?', a: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Utility'], c: 0, e: 'CPU = Central Processing Unit. It is the brain of the computer and does the processing.' },
    { q: 'What is RAM used for?', a: ['Permanent storage of all your files', 'Temporary memory for work in progress', 'Printing documents', 'Connecting to the internet'], c: 1, e: 'RAM is short-term memory. It holds what you are working on right now; it is cleared when the computer turns off.' },
    { q: 'Which storage keeps your files after you turn the computer off?', a: ['RAM', 'Hard disk / SSD', 'Cache', 'Clipboard'], c: 1, e: 'A hard disk or SSD stores files permanently. RAM is temporary.' },
    { q: 'What is the difference between data and information?', a: ['They are exactly the same', 'Data is raw facts; information is data that has been processed and made meaningful', 'Information is raw; data is processed', 'Data only means numbers'], c: 1, e: 'Raw numbers like 85, 90, 70 are data. “Your average mark is 81” is information — processed and useful.' },
    { q: 'Which is system software?', a: ['Microsoft Word', 'Google Chrome', 'Windows operating system', 'A photo editor'], c: 2, e: 'The operating system (Windows, macOS, Linux) is system software — it runs the computer. Word and Chrome are application software.' },
    { q: 'In Microsoft Word, which shortcut saves a document?', a: ['Ctrl + P', 'Ctrl + S', 'Ctrl + C', 'Ctrl + Z'], c: 1, e: 'Ctrl + S saves your document. Ctrl + P prints, Ctrl + C copies, Ctrl + Z undoes.' },
    { q: 'In Microsoft Word, what does Ctrl + B do?', a: ['Makes text bold', 'Makes text bigger', 'Opens a new file', 'Deletes the text'], c: 0, e: 'Ctrl + B makes selected text bold. Ctrl + I is italic and Ctrl + U is underline.' },
    { q: 'In Excel, what does the formula =SUM(A1:A5) do?', a: ['Counts the cells', 'Adds up the numbers in cells A1 to A5', 'Finds the average', 'Deletes the cells'], c: 1, e: 'SUM adds numbers together. =SUM(A1:A5) adds all the values from A1 down to A5.' },
    { q: 'In Excel, a cell is…', a: ['A whole worksheet', 'The box where one row and one column meet', 'A chart', 'A formula only'], c: 1, e: 'A cell is one box in the grid, named by its column letter and row number, e.g. B3.' },
    { q: 'In PowerPoint, what is a slide?', a: ['A transition effect', 'One page of your presentation', 'A font style', 'A speaker note only'], c: 1, e: 'A presentation is made of slides — one page per idea or topic, shown one after another.' },
    { q: 'What should you do before clicking a link in a suspicious email?', a: ['Click it quickly', 'Check who sent it and do not share passwords', 'Forward it to everyone', 'Download every attachment'], c: 1, e: 'Suspicious emails can be phishing. Check the sender, do not click unknown links, and never share your password.' },
    { q: 'What is a strong password?', a: ['Your name', '123456', 'A long mix of letters, numbers and symbols that only you know', 'password'], c: 2, e: 'A strong password is long and mixed — letters, numbers and symbols — and different for each important account.' },
    { q: 'What does the “To” box in an email do?', a: ['Writes the subject', 'Chooses who receives the email', 'Attaches a file', 'Sends a copy to yourself'], c: 1, e: '“To” is the address of the person you are sending the email to. “Subject” is the short title of the message.' }
  ];

  var quizBox = document.getElementById('quizBox');
  if (quizBox) {
    var qIndex = 0, score = 0, answered = false;
    var best = 0;
    try { best = parseInt(localStorage.getItem('bcl-quiz-best') || '0', 10) || 0; } catch (e) { best = 0; }
    var qTitle = document.getElementById('qTitle');
    var qText = document.getElementById('qText');
    var qOptions = document.getElementById('qOptions');
    var qFeedback = document.getElementById('qFeedback');
    var qProgress = document.getElementById('qProgress');
    var qCounter = document.getElementById('qCounter');
    var qNext = document.getElementById('qNext');
    var qResult = document.getElementById('qResult');
    var bestEl = document.getElementById('bestScore');
    if (bestEl) bestEl.textContent = best + ' / ' + QUESTIONS.length;

    function renderQuestion() {
      answered = false;
      var item = QUESTIONS[qIndex];
      qTitle.textContent = 'Question ' + (qIndex + 1) + ' of ' + QUESTIONS.length;
      qText.textContent = item.q;
      qCounter.textContent = 'Score: ' + score;
      qProgress.style.width = (qIndex / QUESTIONS.length * 100) + '%';
      qFeedback.className = 'feedback';
      qFeedback.textContent = '';
      qNext.style.display = 'none';
      qOptions.innerHTML = '';
      item.a.forEach(function (opt, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'option';
        b.textContent = String.fromCharCode(65 + i) + '. ' + opt;
        b.addEventListener('click', function () { answer(i, b); });
        qOptions.appendChild(b);
      });
    }
    function answer(i, btnEl) {
      if (answered) return;
      answered = true;
      var item = QUESTIONS[qIndex];
      var buttons = qOptions.querySelectorAll('.option');
      buttons.forEach(function (b) { b.disabled = true; });
      buttons[item.c].classList.add('correct');
      if (i === item.c) {
        score++;
        qFeedback.className = 'feedback show good';
        qFeedback.textContent = 'Correct! ' + item.e;
      } else {
        btnEl.classList.add('wrong');
        qFeedback.className = 'feedback show bad';
        qFeedback.textContent = 'Not quite. ' + item.e;
      }
      qCounter.textContent = 'Score: ' + score;
      qNext.style.display = 'inline-block';
      qNext.textContent = qIndex === QUESTIONS.length - 1 ? 'See my result' : 'Next question';
    }
    function showResult() {
      qProgress.style.width = '100%';
      var msg = score === QUESTIONS.length ? 'Perfect! You really understand computers now.'
        : score >= 12 ? 'Great work! Just review the topics you missed.'
        : score >= 8 ? 'Good start! Re-read the lessons and try again to beat your score.'
        : 'Keep learning! Read the Fundamentals and Word/Excel lessons, then try the quiz again.';
      if (score > best) {
        best = score;
        try { localStorage.setItem('bcl-quiz-best', String(best)); } catch (e) {}
      }
      if (bestEl) bestEl.textContent = best + ' / ' + QUESTIONS.length;
      quizBox.style.display = 'none';
      qResult.style.display = 'block';
      document.getElementById('finalScore').textContent = score + ' / ' + QUESTIONS.length;
      document.getElementById('finalMsg').textContent = msg;
      document.getElementById('finalBest').textContent = 'Best score: ' + best + ' / ' + QUESTIONS.length;
    }
    qNext.addEventListener('click', function () {
      if (qIndex === QUESTIONS.length - 1) { showResult(); return; }
      qIndex++;
      renderQuestion();
    });
    document.getElementById('restartQuiz').addEventListener('click', function () {
      qIndex = 0; score = 0;
      qResult.style.display = 'none';
      quizBox.style.display = 'block';
      renderQuestion();
    });
    renderQuestion();
  }

  /* ---------- Practice 1: keyboard keys ---------- */
  var keyTarget = document.getElementById('keyTarget');
  if (keyTarget) {
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var currentKey = '', keyCorrect = 0, keyTries = 0;
    var keyMsg = document.getElementById('keyMsg');
    var keyScore = document.getElementById('keyScore');
    function newKey() {
      currentKey = letters[Math.floor(Math.random() * letters.length)];
      keyTarget.textContent = currentKey;
      keyMsg.textContent = 'Press the "' + currentKey + '" key on your keyboard.';
      keyMsg.style.color = '';
    }
    document.addEventListener('keydown', function (e) {
      if (!keyTarget.offsetParent) return; // only when practice section is visible
      if (e.key.length !== 1) return;
      var pressed = e.key.toUpperCase();
      if (!/[A-Z]/.test(pressed)) return;
      keyTries++;
      if (pressed === currentKey) {
        keyCorrect++;
        keyMsg.textContent = 'Correct! That was "' + currentKey + '". Here is the next one.';
        keyMsg.style.color = 'var(--green)';
      } else {
        keyMsg.textContent = 'You pressed "' + pressed + '" — the key shown was "' + currentKey + '". Try the next one.';
        keyMsg.style.color = 'var(--red)';
      }
      keyScore.textContent = 'Correct: ' + keyCorrect + ' / ' + keyTries;
      setTimeout(newKey, 700);
    });
    document.getElementById('newKeyBtn').addEventListener('click', newKey);
    document.getElementById('resetKeyBtn').addEventListener('click', function () {
      keyCorrect = 0; keyTries = 0; keyScore.textContent = 'Correct: 0 / 0'; newKey();
    });
    newKey();
  }

  /* ---------- Practice 2: click accuracy game ---------- */
  var gameArea = document.getElementById('gameArea');
  if (gameArea) {
    var gameScore = 0, gameTime = 30, gameTimer = null, gameRunning = false;
    var scoreEl = document.getElementById('clickScore');
    var timeEl = document.getElementById('clickTime');
    var bestClickEl = document.getElementById('clickBest');
    var startBtn = document.getElementById('startClickBtn');
    var bestClick = 0;
    try { bestClick = parseInt(localStorage.getItem('bcl-click-best') || '0', 10) || 0; } catch (e) {}
    if (bestClickEl) bestClickEl.textContent = 'Best: ' + bestClick;
    function placeTarget() {
      gameArea.querySelectorAll('.target').forEach(function (t) { t.remove(); });
      var t = document.createElement('button');
      t.type = 'button'; t.className = 'target'; t.textContent = '●';
      t.setAttribute('aria-label', 'Click target');
      var maxX = gameArea.clientWidth - 60, maxY = gameArea.clientHeight - 60;
      t.style.left = Math.max(4, Math.floor(Math.random() * maxX)) + 'px';
      t.style.top = Math.max(4, Math.floor(Math.random() * maxY)) + 'px';
      t.addEventListener('click', function (ev) {
        ev.stopPropagation();
        gameScore++;
        scoreEl.textContent = 'Score: ' + gameScore;
        placeTarget();
      });
      gameArea.appendChild(t);
    }
    function endGame() {
      gameRunning = false;
      clearInterval(gameTimer);
      gameArea.querySelectorAll('.target').forEach(function (t) { t.remove(); });
      startBtn.disabled = false;
      startBtn.textContent = 'Play again';
      if (gameScore > bestClick) {
        bestClick = gameScore;
        try { localStorage.setItem('bcl-click-best', String(bestClick)); } catch (e) {}
        if (bestClickEl) bestClickEl.textContent = 'Best: ' + bestClick + ' — new best!';
      }
      timeEl.textContent = 'Time up! You scored ' + gameScore + '.';
    }
    startBtn.addEventListener('click', function () {
      gameScore = 0; gameTime = 30; gameRunning = true;
      scoreEl.textContent = 'Score: 0';
      timeEl.textContent = 'Time left: 30s — click the blue circles!';
      startBtn.disabled = true;
      startBtn.textContent = 'Playing…';
      placeTarget();
      gameTimer = setInterval(function () {
        gameTime--;
        if (gameTime <= 0) { timeEl.textContent = 'Time left: 0s'; endGame(); }
        else { timeEl.textContent = 'Time left: ' + gameTime + 's — click the blue circles!'; }
      }, 1000);
    });
  }

  /* ---------- Practice 3: Word formatting playground ---------- */
  var fmtArea = document.getElementById('fmtArea');
  if (fmtArea) {
    function fmt(cmd, value) {
      fmtArea.focus();
      try { document.execCommand(cmd, false, value || null); } catch (e) {}
      fmtArea.focus();
    }
    document.querySelectorAll('[data-fmt]').forEach(function (b) {
      b.addEventListener('click', function () {
        var cmd = b.getAttribute('data-fmt');
        fmt(cmd);
        b.classList.toggle('on');
      });
    });
    var sizeSel = document.getElementById('fmtSize');
    if (sizeSel) sizeSel.addEventListener('change', function () { fmt('fontSize', sizeSel.value); });
    var colorSel = document.getElementById('fmtColor');
    if (colorSel) colorSel.addEventListener('change', function () { fmt('foreColor', colorSel.value); });
    document.getElementById('fmtClear').addEventListener('click', function () {
      fmtArea.innerHTML = 'Select some of this text, then try Bold, Italic or Underline. Change the size or colour too — just like in Microsoft Word.';
      document.querySelectorAll('[data-fmt]').forEach(function (b) { b.classList.remove('on'); });
    });
  }
})();
