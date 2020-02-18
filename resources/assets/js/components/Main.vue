<template>
  <div
    ref="copy-container"
    v-if="!loading"
    class="copy-container container">
    <div class="container-fluid minh-60 py-5">

      <div class="row justify-content-center">
        <div class="col-sm-4 text-center">
          <div class="h5">
            Looks like you meant to go to <a href="http://hiretulsatechgrads.com/"><em>hire</em>tulsatechgrads.com</a>
            <br>
            <br>
            <a
              href="http://hiretulsatechgrads.com/"
              class="btn btn-default"
            >Go there now</a>
          </div>
        </div>
      </div>

    </div>
    
    <div class="container text-center">
      This message brought to you courtesy of <br><a href="https://samcarlton.com/">Sam Carlton</a> - Tulsa Tech Grad
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
        redirectDelay: 10,
        timeLeft: 10,
      }
    },
    computed: {
      
    },
    methods: {
      startTimer (duration, callback) {
        var timer = duration, minutes, seconds

        setInterval(() => {
            if (timer < 0) return

            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10)

            minutes = minutes < 10 ? "0" + minutes : minutes
            // seconds = seconds < 10 ? "0" + seconds : seconds;

            // display.textContent = minutes + ":" + seconds;
            this.timeLeft = seconds

            if (--timer < 0) {
              // Reset Timer
              // timer = duration

                callback()
            }
        }, 1000)
      }
    },
    mounted () {
      // const path = window.location.pathname.split('/')
      
      // this.copy = decompressed

      this.loading = false

      // this.startTimer(10, () => {
      //   console.log('done')

      //   window.location.href = 'http://hiretulsatechgrads.com'
      // })

      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been rendered
        
      })
    }
  }
</script>
