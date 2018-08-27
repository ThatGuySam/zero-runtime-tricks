<template>
    <div class="container">
      <template v-if="sheet">
        <div class="table-responsive-lg">
          <table class="table table-hover table-dark">
            <thead>
              <tr>
                <th v-for="heading in headings" scope="col">{{ heading }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in sheet.data">
                  <td v-for="(value, key) in row" :scope="(i) ? 'row' : 'col'">
                      <h3 class="heading small">{{ key }}</h3>
                      <div class="body">{{ value }}</div>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>No data found</template>
    </div>
</template>

<script>
  import axios from 'axios'
  import is from 'is_js'

  require('isomorphic-fetch');
  const gsheets = require('gsheets');

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
    data: function () {
      return {
        loading: true,
        sheet: null,
      }
    },
    computed: {
      headings () {
        // Return empty
        if (!this.sheet || is.empty(this.sheet.data)) return null

        return Object.keys(this.sheet.data[0])
      }
    },
    mounted () {
      gsheets.getWorksheet(this.sheetId, this.worksheet)
        .then(res => {
          console.log(res)
          this.sheet = res
          this.loading = false
        }, err => console.error(err));
    }
  }
</script>
