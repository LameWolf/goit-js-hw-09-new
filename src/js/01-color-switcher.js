import "../css/common.css";

const getRandomHexColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const refs = {
  body: document.body,
  startBtn: document.querySelector("button[data-start]"),
  stopBtn: document.querySelector("button[data-stop]"),
  timerId: null,
};

refs.stopBtn.disabled = true;

const changeBodyColor = () => {
  const color = getRandomHexColor();
  refs.body.style.backgroundColor = color;
  console.log("Click!!!");
};

refs.startBtn.addEventListener("click", () => {
  refs.timerId = setInterval(() => {
    changeBodyColor();
  }, 1000);
  if (changeBodyColor) {
    refs.startBtn.disabled = true;
    refs.stopBtn.disabled = false;
  }
});

refs.stopBtn.addEventListener("click", () => {
  clearInterval(refs.timerId);
  console.log(`Interval has stopped!`);
  refs.startBtn.disabled = false;
  refs.stopBtn.disabled = true;
});
