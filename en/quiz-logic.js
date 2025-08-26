// This file contains all the shared quiz logic.

function clearHighlights() {
  document.querySelectorAll('#quizForm .options label').forEach(l => {
    l.classList.remove('option-correct', 'option-wrong');
    const extra = l.querySelector('.correct-badge, .wrong-badge');
    if (extra) extra.remove();
  });
  const summary = document.getElementById('gradingResults');
  summary.style.display = 'none';
  summary.innerHTML = '';
}

function getCurrentAnswers() {
  const answers = {};
  for (let i = MIN_Q; i <= MAX_Q; i++) {
    const name = `q${i}`;
    const sel = document.querySelector(`#quizForm input[name="${name}"]:checked`);
    answers[name] = sel ? sel.value : '';
  }
  return answers;
}

function checkAnswers() {
  clearHighlights();
  const answers = getCurrentAnswers();
  let correctCount = 0;

  for (let i = MIN_Q; i <= MAX_Q; i++) {
    const qName = `q${i}`;
    const user = (answers[qName] || '').toUpperCase();
    // Note: ANSWER_KEY, MIN_Q, and MAX_Q must be defined in the HTML page
    const correct = (ANSWER_KEY[i] || '').toUpperCase();

    const selectedInput = document.querySelector(`#quizForm input[name="${qName}"]:checked`);
    if (selectedInput) {
      const selectedLabel = selectedInput.closest('label');
      if (selectedLabel) {
        if (user === correct && user !== '') {
          selectedLabel.classList.add('option-correct');
        } else {
          selectedLabel.classList.add('option-wrong');
        }
      }
    }
    
    if (correct) {
      const correctInput = document.querySelector(`#quizForm input[name="${qName}"][value="${correct}"]`);
      if (correctInput) {
        const correctLabel = correctInput.closest('label');
        if (correctLabel) {
          correctLabel.classList.add('option-correct');
          if (user !== correct) {
            if (!correctLabel.querySelector('.correct-badge')) {
              const span = document.createElement('span');
              span.className = 'correct-badge';
              span.textContent = 'Correct';
              correctLabel.appendChild(span);
            }
          }
        }
      }
    }

    if (selectedInput && user !== correct) {
      const userLabel = selectedInput.closest('label');
      if (userLabel && !userLabel.querySelector('.wrong-badge')) {
        const span = document.createElement('span');
        span.className = 'wrong-badge';
        span.textContent = 'Your answer';
        userLabel.appendChild(span);
      }
    }

    if (user === correct && user !== '') correctCount++;
  }

  const summaryBox = document.getElementById('gradingResults');
  summaryBox.style.display = 'block';
  summaryBox.innerHTML = `<div>Quiz Result: <strong>${correctCount} / ${TOTAL_QUESTIONS}</strong> correct</div>
                          <div class="grading-details">Review your answers above. Correct answers are green; your incorrect choices are red.</div>`;
  summaryBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/////////////////////////////////////////////



    function showMessage(message, isConfirm = false, onConfirm = null) {
      modalMessage.textContent = message;
      modalButtons.innerHTML = '';
      if (isConfirm) {
        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        okBtn.className = 'btn';
        okBtn.onclick = () => { if (onConfirm) onConfirm(); hideModal(); };
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'btn secondary';
        cancelBtn.onclick = hideModal;
        modalButtons.appendChild(okBtn);
        modalButtons.appendChild(cancelBtn);
      } else {
        const okBtn = document.createElement('button');
        okBtn.textContent = 'OK';
        okBtn.className = 'btn';
        okBtn.onclick = hideModal;
        modalButtons.appendChild(okBtn);
      }
      modal.classList.add('visible');
    }

    function hideModal() { modal.classList.remove('visible'); }

    function saveAll() {
      const form = document.getElementById('quizForm');
      const data = {};
      for (let i = MIN_Q; i <= MAX_Q; i++) {
        const checked = form.querySelector(`input[name="q${i}"]:checked`);
        if (checked) data[`q${i}`] = checked.value;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      showMessage('Answers saved locally.');
    }

    function manualLoad() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) { showMessage('No saved answers found.'); return; }
        loadAll();
        showMessage('Saved answers loaded.');
    }

    function exportCsv() {
      const raw = localStorage.getItem(STORAGE_KEY) || '{}';
      const data = JSON.parse(raw);
      let csv = 'question,answer\n';
      for (let i = MIN_Q; i <= MAX_Q; i++) {
        const q = `q${i}`;
        csv += `${i},${data[q] || ''}\n`;
      }
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'sat_math_module1_answers.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    }

    function clearAll() {
      showMessage('Clear all selected answers?', true, () => {
        document.querySelectorAll('#quizForm input[type="radio"]').forEach(r => r.checked = false);
        localStorage.removeItem(STORAGE_KEY);
        clearHighlights();
      });
    }

    
    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            timeRemaining--;
            if (timeRemaining < 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                timeRemaining = 0;
                showMessage('Time is up!');
            }
            updateTimerDisplay();
        }, 1000);
        startBtn.disabled = true;
        pauseBtn.disabled = false;
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function resetTimer() {
        pauseTimer();
        timeRemaining = QUIZ_DURATION;
        updateTimerDisplay();
    }

    function loadAll() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      document.querySelectorAll('#quizForm input[type="radio"]').forEach(r => r.checked = false);
      Object.keys(data).forEach(k => {
        const sel = document.querySelector(`#quizForm input[name="${k}"][value="${data[k]}"]`);
        if (sel) sel.checked = true;
      });
    }
    

    




