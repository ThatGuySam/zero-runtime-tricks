<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div v-if="questions">

                    <form :name="`form_${this.formId}`" @submit.prevent="submit" >
                      <input type="hidden" name="formID" :value="formId" />

                      <div v-for="(question, k) in questions">
                        <component
                          :is="question.type"
                          :question="question"
                          v-model="model[question.fieldName]"
                        />
                        {{ question.fieldName }}: {{ model[question.fieldName] }}
                      </div>

                    </form>

                </div>
            </div>
            <div class="col-sm-6">
              model
              <pre>{{ model }}</pre>
              <hr>
            </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import fieldMixins from './fields/fieldMixins'
  import ControlInput from './fields/Input'
  import ControlDropdown from './fields/Dropdown'
  import ControlButton from './fields/Submit'
  import ControlDivider from './fields/Divider'

  export default {
    props: {
      formId: {
        type: String,
        required: true
      }
    },
    mixins: [fieldMixins],
    components: {
      'control_textbox':      ControlInput,
      'control_calculation':  ControlInput,
      'control_number':       ControlInput,
      'control_email':        ControlInput,
      'control_dropdown':     ControlDropdown,
      'control_divider':      ControlDivider,
      'control_button':       ControlButton
    },
    data: function () {
      return {
        data: null,
        questions: null,
        model: {}
      }
    },
    methods: {
      byOrder (a,b) {
        if (+a.order < +b.order)
          return -1
        if (+a.order > +b.order)
          return 1
        return 0
      },
      parseQuestions (rawQuestions) {
        let parsedQuestions = []

        for (var key in rawQuestions) {

            let question = rawQuestions[key]

            question.fieldName = this.makeFieldName(question)
            question.value = question.defaultValue

            // this.formstate[question.fieldName] = {}
            // this.$set(this.formstate, question.fieldName, {})
            parsedQuestions.push(question)
        }

        parsedQuestions = parsedQuestions.sort(this.byOrder)

        console.log('sorted', parsedQuestions)

        return parsedQuestions
      },
      getFormData: async () => {

        const response = await axios.get(`https://api.jotform.com/form/${this.formId}/questions`, {
          params: {
            apiKey: process.env.JOTFORM_KEY
          }
        })

        this.response = response.data
        this.questions = this.parseQuestions(response.data.content)

        this.questions.map((question) => {
          this.model[question.fieldName] = ''
        })
      },
      submit () {
        // TODO: Figure out validation then e.preventDefault
        console.log('Clicked!')
        // :action="`https://submit.jotform.us/submit/${this.formId}/`"
      }
    },
    mounted() {
      this.getFormData()
    }
  }
</script>
