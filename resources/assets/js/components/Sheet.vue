<template>
  <div
    ref="sheet-container"
    v-if="!loading"
    class="sheet-container container-fluid">
      <div class="table-responsive-lg py-5">
        <div class="container-fluid">
          <div class="row justify-content-center">
            <form class="form col-lg-6" @submit.prevent>
              <div class="form-group">
                <textarea
                  ref="copy"
                  id="copy"
                  name="copy-input"
                  v-model="copy"
                  type="text"
                  class="copy-input form-control form-control-lg bg-transparent border-0 shadow-none mb-4"
                  placeholder="Type anything..."
                  :style="textareaStyles"
                  autofocus />
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

  export default {
    props: {
      sheetId: {
        type: String,
        required: true
      },
      worksheet: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        loading: true,
        textareaHeight: 'auto',
        copy: ''
      }
    },
    computed: {
      textareaStyles () {
        console.log('this.$refs.copy', this.$refs.copy)

        return {
          height: this.textareaHeight,
          overflowY: 'hidden'
        }
      }
    },
    methods: {
      getTextareaHeight () {
        console.log('this.$refs.copy', typeof this.$refs.copy)
        if (is.not.domNode(this.$refs.copy)) return 'auto'

        return `${this.$refs.copy.scrollHeight}px`
      }
    },
    async mounted () {
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
      })
    },
    watch: {
      copy: function (copy) {
        this.textareaHeight = this.getTextareaHeight()

        const compressedCopy = LZString.compressToUTF16(copy)
        history.replaceState(null, null, compressedCopy)
      }
    }
  }
</script>
