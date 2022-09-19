import Toast from "./toast.js";

document.querySelector("button").addEventListener("click", () => {
  const toast = new Toast({
    text: "hello!",
    position: "top-right",
  });
});
