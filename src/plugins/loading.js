import { Vue } from '../../deps'
import { QSpinner } from '../spinner'

let
  vm,
  appIsInProgress = false,
  timeout,
  props = {}

const staticClass = 'q-loading animate-fade fullscreen column flex-center z-max'

function isActive () {
  return appIsInProgress
}

function show ({
  delay = 500,
  message = false,
  spinnerSize = 80,
  spinnerColor = 'white',
  messageColor = 'white',
  spinner = QSpinner,
  customClass = false
} = {}) {
  props.spinner = spinner
  props.message = message
  props.spinnerSize = spinnerSize
  props.spinnerColor = spinnerColor
  props.messageColor = messageColor

  if (customClass && typeof customClass === 'string') {
    props.customClass = ` ${customClass.trim()}`
  }

  if (appIsInProgress) {
    vm && vm.$forceUpdate()
    return
  }

  timeout = setTimeout(() => {
    timeout = null

    const node = document.createElement('div')
    document.body.appendChild(node)
    document.body.classList.add('with-loading')

    vm = new Vue({
      name: 'q-loading',
      el: node,
      functional: true,
      render (h) {
        const child = [
          h(props.spinner, {
            props: {
              color: props.spinnerColor,
              size: props.spinnerSize
            }
          })
        ]

        if (message) {
          child.push(h('div', {
            staticClass: `text-${props.messageColor}`,
            domProps: {
              innerHTML: props.message
            }
          }))
        }

        return h('div', {staticClass: staticClass + props.customClass}, child)
      }
    })
  }, delay)

  appIsInProgress = true
}

function hide () {
  if (!appIsInProgress) {
    return
  }

  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  else {
    vm.$destroy()
    document.body.classList.remove('with-loading')
    document.body.removeChild(vm.$el)
    vm = null
  }

  appIsInProgress = false
}

const Loading = {
  isActive,
  show,
  hide,

  __installed: false,
  install ({ Quasar }) {
    if (this.__installed) { return }
    this.__installed = true

    Quasar.loading = Loading
  }
}

export default Loading