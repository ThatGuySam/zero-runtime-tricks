<template>
  <div
    ref="sheet-container"
    v-if="!loading"
    class="sheet-container container-fluid">
      <div class="table-responsive-lg py-5">
        <div class="container-fluid">
          <div class="row justify-content-center">
            <form class="form col-lg-6" @submit.prevent>

              <div class="form-row justify-content-end" :style="`opacity: ${Number(hasCopy)}`">
                <button
                  class="btn btn-link text-secondary"
                  type="button"
                  @click="shareLinkOpen = !shareLinkOpen"
                >Share</button>
              </div>

              <div v-if="shareLinkOpen" class="form-group">
                <input
                  name="sharelink-input"
                  v-model="shareLink"
                  type="text"
                  class="sharelink-input form-control text-center mb-4"
                  placeholder="Type anything..."
                  readonly />
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
  import LZString from 'lznext'
  // import { Collapse } from 'bootstrap.native'

  export default {
    // props: {
    //   sheetId: {
    //     type: String,
    //     required: true
    //   },
    //   worksheet: {
    //     type: String,
    //     required: true
    //   }
    // },
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
      compressedCopy () {
        // If it's an empty string then just return nothing
        if (!this.hasCopy) return ''

        return LZString.compressToUTF16(this.copy)
      },
      shareLink () {
        return `${window.location.protocol}//${window.location.host}/${this.compressedCopy}`
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
      const path = window.location.pathname.split('/')
      const compressedCopy = decodeURI(path[1])
      const decompressed = LZString.decompressFromUTF16(compressedCopy)
      
      this.copy = decompressed

      this.loading = false

      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been rendered

        // Size textareaHeight
        this.textareaHeight = this.getTextareaHeight()

        this.$refs.copy.innerHTML = this.copy
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
