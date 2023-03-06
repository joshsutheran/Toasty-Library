let root = document.documentElement

const DEFAULT_OPTIONS = {
    autoClose: 5000,
    position: 'top-right',
    onClose: () => {},
    canClose: true,
    showProgress: true,
    type: 'success',
    text: "This text can be changed!"
}

class Toast {
    #toastEl
    #removeBinded
    #progressInterval
    #visibleSince
    #autoClose
    #toastTextEl
    #toastIconEl
    #selectedIconEl
    #iconName
    #iconColor


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
      this.#toastIconEl = document.createElement('div')
      // this.#toastIconEl.classList.add('toast__iconEl')
      this.#toastIconEl.classList.add('successful_toast_icon')
      this.#iconName = 'check-circle'
    } else if (!value || value === 'information') {
      this.#toastEl.classList.add('information__toast')
      this.#toastIconEl = document.createElement('div')
      this.#toastIconEl.classList.add('toast__iconEl')
      this.#toastIconEl.classList.add('information_toast_icon')
      this.#iconName = 'info-circle'
    } else if (!value || value === 'warning') {
      this.#toastEl.classList.add('warning__toast')
      this.#toastIconEl = document.createElement('div')
      this.#toastIconEl.classList.add('toast__iconEl')
      this.#toastIconEl.classList.add('warning_toast_icon')
      this.#iconName = 'error'
    } else if (!value || value === 'error') {
      this.#toastEl.classList.add('error__toast')
      this.#toastIconEl = document.createElement('div')
      this.#toastIconEl.classList.add('toast__iconEl')
      this.#toastIconEl.classList.add('error_toast_icon')
      this.#iconName = 'error'
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

  // Set the text and icon values
  set text(value) {
    this.#toastTextEl = document.createElement('div')
    this.#toastTextEl.classList.add('toast__textEl')

    this.#toastEl.append(this.#toastIconEl, this.#toastTextEl)
      
    this.#selectedIconEl = document.createElement('box-icon')
    this.#selectedIconEl.setAttribute('name', `${this.#iconName}`)
    this.#selectedIconEl.setAttribute('color', `white`)
    this.#selectedIconEl.setAttribute('type', 'solid')
    this.#selectedIconEl.setAttribute('size', 'sm')
    this.#toastIconEl.append(this.#selectedIconEl)

    this.#toastTextEl.textContent = value
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
