import Toast from "./toast.js";

document.querySelector("button").addEventListener("click", () => {
  const toast = new Toast({
    position: 'top-left',
    text: 'Change this setting!',
    type: 'error'
  });
});
