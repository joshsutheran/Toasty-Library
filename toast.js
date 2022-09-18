// Create exported class called Toast.
export default class Toast {
    // Define private toastEl.
    #toastEl

  constructor(options) {
      // Create toast element
      this.#toastEl = document.createElement("div")
      // Add classlist.
      this.#toastEl.classList.add("toast")
      // Loop through arguments given, assign KVPs as necessary
      Object.entries(options).forEach(([key, value]) => {
          this[key] = value
      })
  }
  
  // Define time to close - if false, do not close.
  set autoClose(value) {
      if(value === false) return
      setTimeout(() => this.remove(), value)
  }

  // Define screen position - options: top-right, top-center, top-left, bottom-left, bottom-center, bottom-right.
  set position (value) {
      // Define selector
      const selector = `.toast-selector[data-position=${value}]`
      // If exist, assign to container, else create new container.
      const container = document.querySelector(selector) || createContainer(value)
      // append our toast div
      container.append(this.#toastEl)
  }

  // Set the text message
  set text(value) {
      this.#toastEl.textContent = value
  }

  update() {}

  // Remove the entire container - not just toast div.
  remove() {
      // Assign container 
    const container = this.#toastEl.parentElement
    // Remove toast el
      this.#toastEl.remove()
      // If container has toast el - don't remove
      if ((container.hasChildNodes)) return
      // else remove.
      container.remove()
  }
}

// Create a container to hold toast div.
function createContainer (position) {
    // Create div
    const container = document.createElement("div")
    // add custom class
    container.classList.add("toast-container")
    // define dataset position
    container.dataset.position = position
    // Append to container
    document.body.append(container)
    // return constructed container
    return container
}