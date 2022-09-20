import Toast from "./toast.js";

document.querySelector("button").addEventListener("click", () => {
  const toast = new Toast({
    text: "This text can be changed!",
  });
});
