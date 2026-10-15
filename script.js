const SIZE = 15;

// Top half of the grid ("#" is a black square). The bottom half is the
// 180° rotation of the top, giving the usual rotational symmetry.
const TOP_HALF = [
  "....#.....#....",
  "....#.....#....",
  "...............",
  "#......#.......",
  "###...#....#...",
  "...#....#......",
  ".....#....#....",
  ".......#.......",
];

const PATTERN = [
  ...TOP_HALF,
  ...TOP_HALF.slice(0, SIZE - TOP_HALF.length)
    .reverse()
    .map((row) => [...row].reverse().join("")),
];

const gridEl = document.getElementById("grid");
const cells = []; // cells[row][col] = { el, letterEl, black }

let active = null; // { row, col }
let direction = "across";

function isOpen(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE && !cells[row][col].black;
}

function buildGrid() {
  let number = 0;
  for (let row = 0; row < SIZE; row++) {
    cells.push([]);
    for (let col = 0; col < SIZE; col++) {
      const black = PATTERN[row][col] === "#";
      const el = document.createElement("div");
      el.className = black ? "cell black" : "cell";
      el.setAttribute("role", "gridcell");
      const cell = { el, black, letterEl: null };
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
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (!isOpen(row, col)) continue;
      const startsAcross = !isOpen(row, col - 1) && isOpen(row, col + 1);
      const startsDown = !isOpen(row - 1, col) && isOpen(row + 1, col);
      if (startsAcross || startsDown) {
        const numEl = document.createElement("span");
        numEl.className = "number";
        numEl.textContent = String(++number);
        cells[row][col].el.prepend(numEl);
      }
    }
  }
}

function wordCells(row, col, dir) {
  const [dr, dc] = dir === "across" ? [0, 1] : [1, 0];
  let r = row;
  let c = col;
  while (isOpen(r - dr, c - dc)) {
    r -= dr;
    c -= dc;
  }
  const result = [];
  while (isOpen(r, c)) {
    result.push(cells[r][c]);
    r += dr;
    c += dc;
  }
  return result;
}

function render() {
  for (const row of cells) {
    for (const cell of row) cell.el.classList.remove("active", "in-word");
  }
  if (!active) return;
  for (const cell of wordCells(active.row, active.col, direction)) {
    cell.el.classList.add("in-word");
  }
  cells[active.row][active.col].el.classList.add("active");
}

function select(row, col, fromClick = false) {
  if (fromClick && active && active.row === row && active.col === col) {
    toggleDirection();
    return;
  }
  active = { row, col };
  // Prefer a direction that actually forms a word through this square.
  if (wordCells(row, col, direction).length < 2) toggleDirection(false);
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
    render();
  }
}

document.addEventListener("keydown", (event) => {
  if (!active || event.ctrlKey || event.metaKey || event.altKey) return;
  const cell = cells[active.row][active.col];
  const key = event.key;

  if (/^[a-zA-Z]$/.test(key)) {
    cell.letterEl.textContent = key.toUpperCase();
    step(true);
  } else if (key === "Backspace") {
    if (cell.letterEl.textContent) {
      cell.letterEl.textContent = "";
    } else {
      step(false);
      cells[active.row][active.col].letterEl.textContent = "";
    }
  } else if (key === "Delete") {
    cell.letterEl.textContent = "";
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
