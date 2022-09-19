let root = document.documentElement

// Create exported class called Toast.
const DEFAULT_OPTIONS = {
    autoClose: 5000,
    position: 'top-right',
    onClose: () => {},
    canClose: true,
    showProgress: true,
    type: 'success'
}

export default class Toast {
    #toastEl
    #removeBinded
    #progressInterval
    #visibleSince
    #autoClose

  constructor(options) {
      this.#toastEl = document.createElement("div")
      this.#toastEl.classList.add("toast")
      this.#visibleSince = new Date()
      requestAnimationFrame(() => {
          this.#toastEl.classList.add('show')
      })
      this.#removeBinded = this.remove.bind(this)
      this.update({...DEFAULT_OPTIONS, ...options})
  }

  set type(value) {
    if (!value || value === 'success') {
      this.#toastEl.classList.add('successful__toast')
      root.style.setProperty("--progress__color", "#226e35")
    }
} 
  
  // Define time to close - if false, do not close.
  set autoClose(value) {
      this.#autoClose = value
      if(value === false) return
      setTimeout(() => this.remove(), value)
  }

  // Define screen position - options: top-right, top-center, top-left, bottom-left, bottom-center, bottom-right.
  set position (value) {
    const currentContainer = this.#toastEl.parentElement
    const selector = `.toast-container[data-position="${value}"]`
    const container = document.querySelector(selector) || createContainer(value)
    container.append(this.#toastEl)
    if (currentContainer == null || currentContainer.hasChildNodes()) return
    currentContainer.remove()
  }

  // Set the text message
  set text(value) {
      this.#toastEl.textContent = value
  }

  set canClose(value) {
      this.#toastEl.classList.toggle("can-close", value)
      if (value) {
        this.#toastEl.addEventListener('click', this.#removeBinded)
      } else {
        this.#toastEl.removeEventListener('click', this.#removeBinded)
      }
  }

  set showProgress(value) {
      this.#toastEl.classList.toggle("progress", value)
      this.#toastEl.style.setProperty("--progress", 1)

      if(value) {
          this.#progressInterval = setInterval(() => {
              const timeVisible = new Date() - this.#visibleSince
              this.#toastEl.style.setProperty("--progress", 1 - timeVisible / this.#autoClose)
          }, 10)
      }
  }

  update(options) {
    Object.entries(options).forEach(([key, value]) => {
        this[key] = value
    })
  }

  // Remove the entire container - not just toast div.
  remove() {
    clearInterval(this.#progressInterval)
    const container = this.#toastEl.parentElement
    this.#toastEl.classList.remove("show")
    this.#toastEl.addEventListener("transitionend", () => {
        this.#toastEl.remove()
        if ((container.hasChildNodes())) return
        container.remove()
    })
    this.onClose()
  }
}

// Create a container to hold toast div.
function createContainer (position) {
    const container = document.createElement("div")
    container.classList.add("toast-container")
    container.dataset.position = position
    document.body.append(container)
    return container
}