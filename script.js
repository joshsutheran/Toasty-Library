import Toast from "./toast.js";

document.querySelector("button").addEventListener("click", () => {
  const toast = new Toast({
    text: "This is a test",
    type: "success"
  });

  const toast2 = new Toast({
    text: "This is a test",
    type: "information"
  });

  const toast3 = new Toast({
    text: "This is a test",
    type: "error"
  });

  const toast4 = new Toast({
    text: "This is a test",
    type: "warning"
  });
});
