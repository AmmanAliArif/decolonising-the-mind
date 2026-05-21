// Student editors: update this array to change quiz questions, answers, or explanations.
const quizQuestions = [
  {
    question:
      "A colonised person starts believing their own culture is backward and the coloniser's culture is superior. What concept does this show?",
    options: [
      "Public reason",
      "Psychological colonialism",
      "Market competition",
      "Neutral citizenship"
    ],
    correct: 1,
    explanation:
      "Psychological colonialism describes how colonial domination can enter self-image, desire, shame, and ideas of cultural worth."
  },
  {
    question:
      "A country becomes independent, but local elites keep the same exploitative institutions. What would Fanon warn this is?",
    options: [
      "Direct democracy",
      "Cultural renaissance",
      "Postcolonial trap / national bourgeoisie",
      "International solidarity"
    ],
    correct: 2,
    explanation:
      "Fanon warns that a national bourgeoisie can replace foreign rulers while preserving colonial institutions and exploitation."
  },
  {
    question:
      "A colonial government controls people through police, military force, and fear. What does this show?",
    options: [
      "Colonial violence",
      "Free consent",
      "Cultural pluralism",
      "Economic neutrality"
    ],
    correct: 0,
    explanation:
      "Colonial violence means colonial power is maintained through coercion, police control, military force, and fear."
  },
  {
    question:
      "A person feels ashamed of their accent because elite society values the coloniser's language more. Which Fanon theme does this connect to?",
    options: [
      "Environmental justice",
      "Military strategy",
      "Language and power",
      "Electoral procedure"
    ],
    correct: 2,
    explanation:
      "Fanon links language to power because speech can carry prestige, hierarchy, class status, and colonial approval."
  },
  {
    question:
      "A university movement demands that colonial statues, curricula, and knowledge systems be challenged. Which modern issue does this connect to?",
    options: [
      "Price inflation",
      "Decolonising education",
      "Private property law",
      "Industrial automation"
    ],
    correct: 1,
    explanation:
      "Decolonising education challenges colonial symbols, curricula, institutions, and assumptions about whose knowledge counts."
  },
  {
    question: "Fanon's main point about violence is best described as:",
    options: [
      "Violence is an abstract moral ideal in every political context.",
      "Colonial rule was mainly peaceful administration.",
      "Colonialism is already violent, so anti-colonial violence must be understood in that context.",
      "Politics can be separated from coercive force."
    ],
    correct: 2,
    explanation:
      "Fanon should not be reduced to glorifying violence; he argues that colonial rule is already structured by violence."
  },
  {
    question: "Fanon's goal is not just replacing foreign rulers. His deeper goal is:",
    options: [
      "Keeping colonial institutions with new flags",
      "Making elites more powerful",
      "Avoiding cultural and psychological change",
      "Transforming society and creating a new humanism"
    ],
    correct: 3,
    explanation:
      "Fanon's liberation project aims to transform society, consciousness, institutions, and human relations."
  },
  {
    question:
      "A legal system inherited from colonial rule continues to treat some citizens differently. Which theme does this connect to?",
    options: [
      "Pure cultural freedom",
      "A completed decolonisation process",
      "A non-political tradition",
      "Colonial institutional legacy"
    ],
    correct: 3,
    explanation:
      "A colonial institutional legacy exists when laws, bureaucracies, or legal hierarchies survive after formal independence."
  }
];

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#navLinks");
const navItems = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const navTargets = new Set([...navItems].map((link) => link.getAttribute("href")));
const sections = [...document.querySelectorAll("main section[id]")].filter((section) =>
  navTargets.has(`#${section.id}`)
);
const backToTop = document.querySelector("#backToTop");
const questionText = document.querySelector("#questionText");
const quizOptions = document.querySelector("#quizOptions");
const quizProgress = document.querySelector("#quizProgress");
const quizScore = document.querySelector("#quizScore");
const quizFeedback = document.querySelector("#quizFeedback");
const nextQuestion = document.querySelector("#nextQuestion");
const restartQuiz = document.querySelector("#restartQuiz");

let currentQuestion = 0;
let score = 0;
let answered = false;

// Mobile navigation toggle.
navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
});

// Smooth scroll with sticky-header offset.
navItems.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) return;

    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");

    const top = target.getBoundingClientRect().top + window.scrollY - 82;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

// Reveal sections and cards as the page scrolls.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Highlight the navigation item for the section currently in view.
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navItems.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
);

sections.forEach((section) => sectionObserver.observe(section));

// Back-to-top behavior.
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 640);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function renderQuestion() {
  const item = quizQuestions[currentQuestion];
  answered = false;
  questionText.textContent = item.question;
  quizFeedback.textContent = "";
  quizProgress.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
  quizScore.textContent = `Score: ${score}`;
  quizOptions.innerHTML = "";
  nextQuestion.disabled = true;

  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => checkAnswer(button, index));
    quizOptions.appendChild(button);
  });
}

function checkAnswer(selectedButton, selectedIndex) {
  if (answered) return;

  const item = quizQuestions[currentQuestion];
  const optionButtons = quizOptions.querySelectorAll(".quiz-option");
  answered = true;
  nextQuestion.disabled = false;

  optionButtons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) {
      button.classList.add("correct");
    }
  });

  if (selectedIndex === item.correct) {
    score += 1;
    quizFeedback.textContent = `Correct. ${item.explanation}`;
  } else {
    selectedButton.classList.add("incorrect");
    quizFeedback.textContent = `Not quite. ${item.explanation}`;
  }

  quizScore.textContent = `Score: ${score}`;
}

function showFinalScore() {
  questionText.textContent = "Quiz complete";
  quizProgress.textContent = "Finished";
  quizScore.textContent = `Final score: ${score} / ${quizQuestions.length}`;
  quizOptions.innerHTML = "";
  quizFeedback.textContent =
    score >= 6
      ? "Strong work. You are reading Fanon as a thinker of colonial power, psychology, institutions, and liberation."
      : "Review the sections above, then try again. The key is to connect colonial institutions with colonial consciousness.";
  nextQuestion.classList.add("hidden");
  restartQuiz.classList.remove("hidden");
}

nextQuestion.addEventListener("click", () => {
  if (!answered) return;

  currentQuestion += 1;

  if (currentQuestion >= quizQuestions.length) {
    showFinalScore();
  } else {
    renderQuestion();
  }
});

restartQuiz.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  nextQuestion.classList.remove("hidden");
  restartQuiz.classList.add("hidden");
  renderQuestion();
});

renderQuestion();
