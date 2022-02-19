import "../sass/timer.scss";
import "flatpickr/dist/flatpickr.min.css";
require("flatpickr/dist/themes/dark.css");
import "notiflix/dist/notiflix-3.2.4.min.css";
import flatpickr from "flatpickr";
import Notiflix from "notiflix";

// || ========== Reference ========== ||

const refs = {
  inputEl: document.querySelector("#datetime-picker"),
  btnStart: document.querySelector("[data-start]"),
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
};

// || ========== Initial Button Attributes ========== ||

refs.btnStart.disabled = true;
refs.btnStart.style.backgroundColor = "#ff0000";

// || ========== Flatpickr initialization ========== ||

const options = {
  enableTime: true,
  time_24hr: true,
  dateFormat: "d.m.Y H:i",
  weekNumbers: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentDate = Date.now();
    const selectedTime = selectedDates[0];

    if (selectedTime <= currentDate) {
      Notiflix.Notify.failure("Please choose a date in the future!");
    } else {
      refs.btnStart.disabled = false;
      refs.btnStart.style.backgroundColor = "#19ff04";
    }
  },
};

flatpickr("#datetime-picker", options);
const callendars = refs.inputEl._flatpickr;

// || ========== Timer ========== ||

class Timer {
  constructor({ onTick }) {
    this.onTick = onTick;
    this.intervalId = null;
    this.isActive = false;
  }

  start() {
    if (this.isActive) {
      return;
    }
    const selectedTime = callendars.selectedDates[0].getTime();
    Notiflix.Notify.success("Conglaturations! Timer has started!");
    refs.inputEl.disabled = true;
    refs.inputEl.style.textShadow = "none";

    this.isActive = true;
    this.intervalId = setInterval(() => {
      const currentDate = Date.now();
      const deltaMs = selectedTime - currentDate;
      const convertedTime = convertMs(deltaMs);
      this.onTick(convertedTime);

      if (deltaMs <= 0) {
        this.stop();
      }
    }, 1000);

    refs.btnStart.disabled = true;
    refs.btnStart.style.backgroundColor = "#fc0404";
  }

  stop() {
    clearInterval(this.intervalId);
    this.isActive = false;
    const convertedTime = convertMs(0);
    this.onTick(convertedTime);

    Notiflix.Notify.info("Timer has stopped!");

    refs.inputEl.disabled = false;
    refs.inputEl.style.textShadow = "grey 1px 1px";
  }
}

// || ========== Convert ms ========== ||

const convertMs = (ms) => {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
};

// || ========== Add Leading Zero ========== ||

const addLeadingZero = (value) => {
  return String(value).padStart(2, 0);
};

// || ========== Render function ========== ||

const renderTimerUi = ({ days, hours, minutes, seconds }) => {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
};

// || ========== Handle Timer Start ========== ||

const timer = new Timer({ onTick: renderTimerUi });

const handleTimerStart = () => {
  timer.start();
};

refs.btnStart.addEventListener("click", handleTimerStart);
