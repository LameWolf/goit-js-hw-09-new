import "../sass/promice.scss";
import Notiflix from "notiflix";

const form = document.querySelector(".form");

// || ========== onFormSubmit ========== ||

const onFormSubmit = (evt) => {
  evt.preventDefault();

  let delayValue = Number(evt.currentTarget.delay.value);
  let stepValue = Number(evt.currentTarget.step.value);
  let amount = Number(evt.currentTarget.amount.value);

  for (let position = 1; position <= amount; position += 1) {
    createPromise(position, delayValue)
      .then(({ position, delay }) => {
        Notiflix.Notify.success(
          `✅ Fulfilled promise ${position} in ${delay}ms`
        );
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.failure(
          `❌ Rejected promise ${position} in ${delay}ms`
        );
      });
    delayValue += stepValue;
  }
  form.reset();
};

// || ========== createPromise ========== ||

const createPromise = (position, delay) => {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        // Fulfill
        resolve({ position, delay });
      } else {
        // Reject
        reject({ position, delay });
      }
    }, delay);
  });
};

form.addEventListener("submit", onFormSubmit);
