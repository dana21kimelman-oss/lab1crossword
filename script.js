const button = document.getElementById("counter");
const output = document.getElementById("count");

let count = 0;

button.addEventListener("click", () => {
  count += 1;
  output.textContent = String(count);
});
