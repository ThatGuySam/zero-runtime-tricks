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
                  <div class="display-4 font-weight-bold">{{ badNumber }}</div>
                  <div class="average-descriptor text-muted">is not averagable</div>
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
                  class="copy-input form-control form-control-lg bg-transparent border-0 shadow-none mb-4"
                  placeholder="Type anything..."
                  contenteditable="true"
                  autofocus
                  style="height: auto; white-space: pre;"
                  @input="updateCopy" />
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
  import { splitByLineBreaks } from '../helpers'

  export default {
    data () {
      return {
        loading: true,
        shareLinkOpen: false,
        textareaHeight: 'auto',
        // badNumber: null,
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

          console.log('line', line, i)
          console.log('isNumber', isNumber)

          if (!isNumber) {
            badNumberIndex = i
            return
          } 
        })

        const badNumber = (Number(badNumberIndex) !== null) ? this.lines[badNumberIndex] : null

        // console.log('badNumber', badNumber)
        console.log('badNumberIndex', badNumberIndex)
        console.log('badNumber', badNumber)

        return badNumber
      },
      average () {
        // If there's a bad number stop
        // if (this.badNumber !== null) return

        const numbers = this.lines.map(line => Number(line))

        const realAverage = numbers.reduce((a, b) => a + b) / numbers.length
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

        // this.$refs.copy.innerHTML = linked
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
