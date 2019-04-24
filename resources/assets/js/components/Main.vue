<template>
  <div
    ref="copy-container"
    v-if="!loading"
    class="copy-container container">
    <div class="container-fluid minh-60 py-5">

      <div class="row justify-content-center">
        <div class="col-sm-4 text-center">
          <div class="h5">
            Looks like you meant to go to hiretulsatechgrads.com
          </div>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-sm-8 text-center py-5">
          <div class="display-4">
            Redirecting you in
          </div>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-sm-8 text-center">
          <div class="display-1 font-weight-bold">
            {{ timeLeft }}
          </div>
        </div>
      </div>

    </div>
    
    <div class="container text-center">
      This redirect brought to you courtesy of Sam Carlton - Tulsa Tech Grad
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

  var getTimeout = (function() { // IIFE
    var _setTimeout = setTimeout, // Reference to the original setTimeout
        map = {}; // Map of all timeouts with their start date and delay

    setTimeout = function(callback, delay) { // Modify setTimeout
        var id = _setTimeout(callback, delay); // Run the original, and store the id

        map[id] = [Date.now(), delay]; // Store the start date and delay

        return id; // Return the id
    };

    return function(id) { // The actual getTimeLeft function
        var m = map[id]; // Find the timeout in map

        // If there was no timeout with that id, return NaN, otherwise, return the time left clamped to 0
        return m ? Math.max(m[1] - Date.now() + m[0], 0) : NaN;
    }
  })()

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
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10)

            minutes = minutes < 10 ? "0" + minutes : minutes
            // seconds = seconds < 10 ? "0" + seconds : seconds;

            // display.textContent = minutes + ":" + seconds;
            this.timeLeft = seconds

            if (--timer < 0) {
                timer = duration

                callback()
            }
        }, 1000)
      }
    },
    mounted () {
      // const path = window.location.pathname.split('/')
      
      // this.copy = decompressed

      this.loading = false

      this.startTimer(10, () => {
        console.log('done')

        window.location.href = 'http://hiretulsatechgrads.com'
      })

      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been rendered
        
      })
    }
  }
</script>
