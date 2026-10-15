const SIZE = 15;

// The answer grid ("#" is a black square). The pattern and clue numbers are
// derived from it.
const SOLUTION = [
  "ARTS#BRAKE#OWES",
  "COOT#RATED#RAIL",
  "EVER#ADOBE#BITE",
  "DESIGN#MAMA#THE",
  "###KIDS#BARKEEP",
  "ASPEN#HAS#MARRY",
  "APE##EEL#SYN###",
  "HANG#RAISE#EARS",
  "###ARE#ALE##HUE",
  "THEME#PSI#SLANT",
  "RELEASE#PLOY###",
  "ERA#LURK#ENRICH",
  "ANTI#TIARA#IDLY",
  "TIER#ROLES#CLAM",
  "SADE#ADEPT#SEWN",
];

const CLUES = {
  across: {
    1: "Fine ___ (painting and sculpture)",
    5: "Pedal that slows a car",
    10: "Is in debt",
    14: "Old ___ (grumpy codger)",
    15: "Given stars, as a movie",
    16: "Part of a train track",
    17: "Happily ___ after",
    18: "Sun-dried brick",
    19: "Mosquito's souvenir",
    20: "Blueprint or plan",
    22: "Mother, informally",
    24: "Most common word in English",
    25: "Children",
    27: "One pouring drinks at a tiki bar",
    29: "Quaking tree",
    32: "Possesses",
    34: "Tie the knot",
    35: "Mimic",
    36: "Slippery fish in a coral reef",
    37: "Thesaurus abbr. for a word with the same meaning",
    38: "Put up, as a hammock",
    40: "Lift up",
    42: "Corn units, or hearing organs",
    46: "\"You ___ here\"",
    48: "Pub pour",
    49: "Shade of color",
    50: "Tropical island ___ party",
    53: "Greek letter before omega",
    54: "Tilt",
    56: "Set free",
    58: "Cunning tactic",
    60: "Historical period",
    61: "Wait in hiding",
    63: "Make wealthier",
    67: "Opposed to",
    69: "Pageant crown",
    71: "Lazily",
    72: "Wedding cake layer",
    73: "Actors' parts",
    74: "Beach digger's find",
    75: "\"Smooth Operator\" singer",
    76: "Highly skilled",
    77: "Stitched",
  },
  down: {
    1: "Got 100% on",
    2: "Wander",
    3: "Things wiggled in the sand",
    4: "Bowling's best roll",
    5: "Company name or logo",
    6: "Totally awesome, in surfer slang",
    7: "Smallest unit of an element",
    8: "Grilled skewers",
    9: "Medical swelling",
    10: "Sphere",
    11: "Restaurant server",
    12: "One or the other",
    13: "Ready for a nap in the hammock",
    21: "Tonic's partner",
    23: "Military force",
    26: "___ butter (moisturizer)",
    28: "\"Citizen ___\"",
    29: "Sigh of relief",
    30: "Place for a massage",
    31: "Ballpoint, e.g.",
    33: "Assumed name",
    36: "Before, poetically",
    37: "Look",
    39: "Match or contest",
    41: "Lose one's footing",
    43: "\"Eureka!\"",
    44: "Jog",
    45: "\"Ready, ___, go!\"",
    47: "Genuine",
    50: "Sweet snacks",
    51: "Weightlifter's injury, perhaps",
    52: "Overjoyed",
    53: "Sentence ender",
    54: "Male child",
    55: "Song words",
    57: "Buddhist scripture",
    59: "Smallest amount",
    62: "Leafy green",
    64: "Not working",
    65: "Crab's pincer",
    66: "Church song",
    68: "Anger",
    70: "Gym repetition",
  },
};

const gridEl = document.getElementById("grid");
const currentClueEl = document.getElementById("current-clue");
const statusEl = document.getElementById("status");
const clueListEls = {
  across: document.getElementById("across-clues"),
  down: document.getElementById("down-clues"),
};

// cells[row][col] = { el, letterEl, black, answer, words: { across, down } }
const cells = [];
// Each word: { number, dir, cells, clueEl }
const words = [];

let active = null; // { row, col }
let direction = "across";

function isOpen(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE && !cells[row][col].black;
}

function buildGrid() {
  for (let row = 0; row < SIZE; row++) {
    cells.push([]);
    for (let col = 0; col < SIZE; col++) {
      const answer = SOLUTION[row][col];
      const black = answer === "#";
      const el = document.createElement("div");
      el.className = black ? "cell black" : "cell";
      el.setAttribute("role", "gridcell");
      const cell = { el, black, answer, letterEl: null, words: {} };
      cells[row].push(cell);
      gridEl.appendChild(el);
      if (black) continue;

      const letterEl = document.createElement("span");
      letterEl.className = "letter";
      el.appendChild(letterEl);
      cell.letterEl = letterEl;
      el.addEventListener("click", () => select(row, col, true));
    }
  }

  // Number every square that starts an across or down word.
  let number = 0;
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (!isOpen(row, col)) continue;
      const startsAcross = !isOpen(row, col - 1) && isOpen(row, col + 1);
      const startsDown = !isOpen(row - 1, col) && isOpen(row + 1, col);
      if (!startsAcross && !startsDown) continue;

      number += 1;
      const numEl = document.createElement("span");
      numEl.className = "number";
      numEl.textContent = String(number);
      cells[row][col].el.prepend(numEl);
      if (startsAcross) addWord(number, "across", row, col);
      if (startsDown) addWord(number, "down", row, col);
    }
  }
}

function addWord(number, dir, row, col) {
  const [dr, dc] = dir === "across" ? [0, 1] : [1, 0];
  const word = { number, dir, cells: [], clueEl: null };
  for (let r = row, c = col; isOpen(r, c); r += dr, c += dc) {
    word.cells.push(cells[r][c]);
    cells[r][c].words[dir] = word;
  }

  const li = document.createElement("li");
  li.className = "clue";
  const numEl = document.createElement("span");
  numEl.className = "clue-num";
  numEl.textContent = String(number);
  const textEl = document.createElement("span");
  textEl.className = "clue-text";
  textEl.textContent = CLUES[dir][number] ?? "(missing clue)";
  li.append(numEl, textEl);
  li.addEventListener("click", () => {
    direction = dir;
    const first = word.cells.find((cell) => !cell.letterEl.textContent) ?? word.cells[0];
    const { row: r, col: c } = positionOf(first);
    active = { row: r, col: c };
    render();
  });
  clueListEls[dir].appendChild(li);
  word.clueEl = li;
  words.push(word);
}

function positionOf(target) {
  for (let row = 0; row < SIZE; row++) {
    const col = cells[row].indexOf(target);
    if (col !== -1) return { row, col };
  }
  return null;
}

function activeWord() {
  if (!active) return null;
  return cells[active.row][active.col].words[direction] ?? null;
}

function render() {
  for (const row of cells) {
    for (const cell of row) cell.el.classList.remove("active", "in-word");
  }
  for (const word of words) {
    word.clueEl.classList.remove("active");
    word.clueEl.classList.toggle("done", word.cells.every((cell) => cell.letterEl.textContent));
  }

  const word = activeWord();
  if (!word) {
    currentClueEl.textContent = " ";
    return;
  }
  for (const cell of word.cells) cell.el.classList.add("in-word");
  cells[active.row][active.col].el.classList.add("active");
  word.clueEl.classList.add("active");
  word.clueEl.scrollIntoView({ block: "nearest" });
  const label = `${word.number} ${word.dir === "across" ? "Across" : "Down"}`;
  currentClueEl.textContent = `${label}: ${CLUES[word.dir][word.number]}`;
}

function select(row, col, fromClick = false) {
  if (fromClick && active && active.row === row && active.col === col) {
    toggleDirection();
    return;
  }
  active = { row, col };
  // Prefer a direction that actually forms a word through this square.
  if (!cells[row][col].words[direction]) toggleDirection(false);
  render();
}

function toggleDirection(rerender = true) {
  direction = direction === "across" ? "down" : "across";
  if (rerender) render();
}

// Move to the next open square in the given direction, skipping black ones.
function move(dr, dc) {
  let r = active.row + dr;
  let c = active.col + dc;
  while (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
    if (isOpen(r, c)) {
      active = { row: r, col: c };
      render();
      return;
    }
    r += dr;
    c += dc;
  }
}

function step(forward) {
  const sign = forward ? 1 : -1;
  const [dr, dc] = direction === "across" ? [0, sign] : [sign, 0];
  if (isOpen(active.row + dr, active.col + dc)) {
    active = { row: active.row + dr, col: active.col + dc };
  }
  render();
}

function setLetter(cell, letter) {
  cell.letterEl.textContent = letter;
  cell.el.classList.remove("wrong", "revealed");
}

function openCells() {
  return cells.flat().filter((cell) => !cell.black);
}

function checkSolved() {
  if (openCells().every((cell) => cell.letterEl.textContent === cell.answer)) {
    statusEl.textContent = "Solved! Time for a coconut.";
  }
}

document.getElementById("check").addEventListener("click", () => {
  let wrong = 0;
  let empty = 0;
  for (const cell of openCells()) {
    const letter = cell.letterEl.textContent;
    if (!letter) {
      empty += 1;
    } else if (letter !== cell.answer) {
      cell.el.classList.add("wrong");
      wrong += 1;
    }
  }
  if (wrong) statusEl.textContent = `${wrong} wrong ${wrong === 1 ? "letter" : "letters"} marked.`;
  else if (empty) statusEl.textContent = `All correct so far, ${empty} squares to go.`;
  else checkSolved();
});

document.getElementById("reveal").addEventListener("click", () => {
  for (const cell of openCells()) {
    if (cell.letterEl.textContent !== cell.answer) {
      setLetter(cell, cell.answer);
      cell.el.classList.add("revealed");
    }
  }
  statusEl.textContent = "Puzzle revealed.";
  render();
});

document.getElementById("clear").addEventListener("click", () => {
  for (const cell of openCells()) setLetter(cell, "");
  statusEl.textContent = "";
  render();
});

document.addEventListener("keydown", (event) => {
  if (!active || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target instanceof HTMLButtonElement && (event.key === " " || event.key === "Enter")) return;
  const cell = cells[active.row][active.col];
  const key = event.key;

  if (/^[a-zA-Z]$/.test(key)) {
    setLetter(cell, key.toUpperCase());
    step(true);
    checkSolved();
  } else if (key === "Backspace") {
    if (cell.letterEl.textContent) {
      setLetter(cell, "");
      render();
    } else {
      step(false);
      setLetter(cells[active.row][active.col], "");
      render();
    }
  } else if (key === "Delete") {
    setLetter(cell, "");
    render();
  } else if (key === " ") {
    toggleDirection();
  } else if (key === "ArrowLeft") {
    move(0, -1);
  } else if (key === "ArrowRight") {
    move(0, 1);
  } else if (key === "ArrowUp") {
    move(-1, 0);
  } else if (key === "ArrowDown") {
    move(1, 0);
  } else {
    return;
  }
  event.preventDefault();
});

buildGrid();
