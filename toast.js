let root = document.documentElement

// Create exported class called Toast.
const DEFAULT_OPTIONS = {
    autoClose: 500000,
    position: 'top-right',
    onClose: () => {},
    canClose: true,
    showProgress: true,
    type: 'error'
}

export default class Toast {
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
      root.style.setProperty("--progress__color", "#3cba5f")
      this.#iconName = 'check-circle'
    } else if (!value || value === 'information') {
      this.#toastEl.classList.add('information__toast')
      root.style.setProperty("--progress__color", "#006be1")
      this.#iconName = 'info-circle'
    } else if (!value || value === 'warning') {
      this.#toastEl.classList.add('warning__toast')
      root.style.setProperty("--progress__color", "#ef9400")
      this.#iconName = 'error'
    } else if (!value || value === 'error') {
      this.#toastEl.classList.add('error__toast')
      root.style.setProperty("--progress__color", "#ea4e2c")
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
    this.#toastIconEl = document.createElement('div')
    this.#toastIconEl.classList.add('toast__iconEl')
    this.#toastTextEl = document.createElement('div')
    this.#toastTextEl.classList.add('toast__textEl')

    this.#toastEl.append(this.#toastIconEl, this.#toastTextEl)

    /*
    this.#toastIconImgEl = document.createElement('div')
    this.#toastIconImgEl.classList.add('toast_iconel_img')
    */

    this.#selectedIconEl = document.createElement('box-icon')
    this.#selectedIconEl.setAttribute('name', `${this.#iconName}`)
    this.#selectedIconEl.setAttribute('color', `white`)
    this.#selectedIconEl.setAttribute('type', 'solid')
    this.#selectedIconEl.setAttribute('size', 'sm')
    this.#toastIconEl.append(this.#selectedIconEl)
    /*
    this.#toastIconEl.append(this.#toastIconImgEl)
    */
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