<template>
  <div
    ref="copy-container"
    v-if="!loading"
    class="copy-container container-fluid">
      <div class="table-responsive-lg py-5">
        <div class="container-fluid">
          <div class="row justify-content-center">
            <form class="form col-lg-6" @submit.prevent>

              <div class="form-group text-center">
                <template v-if="badNumber">                  
                  <div class="display-4 font-weight-bold text-warning">{{ badNumber }}</div>
                  <div class="average-descriptor text-warning">is not averagable</div>
                </template>
                <template v-else>
                  <div class="average-descriptor text-muted">The average is</div>
                  <div class="display-4 font-weight-bold">{{ average }}</div>
                </template>
              </div>

              <div class="form-group">
                <div
                  ref="copy"
                  id="copy"
                  name="copy-input"
                  type="text"
                  class="copy-input form-control form-control-lg text-white-50 bg-transparent border-light shadow-none mb-4"
                  placeholder="Type a few numbers."
                  contenteditable="true"
                  autofocus
                  style="min-height: 8em; height: auto; white-space: pre;"
                  @input="updateCopy">9<br>1<br>8</div>
              </div>

            </form>
          </div>
        </div>
        
      </div>
  </div>
  <div
    v-else
    class="display-4 text-center py-5">Loading...</div>
</template>

<script>
  // import axios from 'axios'
  import is from 'is_js'
  // import { Collapse } from 'bootstrap.native'
  // import Autolinker from 'autolinker'
  import { splitByLineBreaks, saveCopy, loadCopy } from '../helpers'

  export default {
    data () {
      return {
        loading: true,
        shareLinkOpen: false,
        textareaHeight: 'auto',
        copy: ''
      }
    },
    computed: {
      hasCopy () {
        return is.not.empty(this.copy)
      },
      lines () {
        return splitByLineBreaks(this.copy)
      },
      badNumber () {
        let badNumberIndex = null

        this.lines.forEach((line, i) => {
          const isNumber = Number.isInteger(Number(line))

          if (badNumberIndex === null && !isNumber) {
            badNumberIndex = i
            return
          } 
        })

        const badNumber = (badNumberIndex !== null) ? this.lines[badNumberIndex] : null

        return badNumber
      },
      average () {
        // If there's no copy then the average is 0
        if (is.empty(this.copy)) return 0

        // If there's not a bad number save the copy
        if (this.badNumber === null) saveCopy(this.copy)

        // Get the numbers from our lines
        const numbers = this.lines.map(line => Number(line))

        // Get average
        const realAverage = numbers.reduce((a, b) => a + b) / numbers.length

        // Return rounded average
        return Math.round(realAverage)
      }
    },
    methods: {
      updateCopy (event) {
        this.copy = event.target.innerText || event.target.textContent
      },
      getTextareaHeight () {
        if (is.not.domNode(this.$refs.copy)) return 'auto'

        return `${this.$refs.copy.scrollHeight}px`
      }
    },
    mounted () {
      // const path = window.location.pathname.split('/')
      
      // this.copy = decompressed

      this.loading = false

      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been rendered

        // Size textareaHeight
        this.textareaHeight = this.getTextareaHeight()

        // Get the text from the initial load to use as the default copy
        const defaultCopy = this.$refs.copy.innerText
        // Load copy from local cache
        const loadedCopy = loadCopy(defaultCopy)

        // Store loeaded copy
        this.copy = loadedCopy
        // Put the copy into our input since it's not modeled
        this.$refs.copy.innerText = loadedCopy

        console.log('loadedCopy', loadedCopy)

        // Focus copy element
        this.$refs.copy.focus()
      })
    },
    watch: {
      compressedCopy: function (compressedCopy) {
        this.textareaHeight = this.getTextareaHeight()

        if (!this.hasCopy) {
          return history.replaceState(null, null, '/')
        }

        history.replaceState(null, null, compressedCopy)
      }
    }
  }
</script>
