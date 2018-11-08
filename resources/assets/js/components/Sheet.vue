<template>
    <div v-if="!loading" class="sheet-container container">
      <template v-if="sheet">
        <div class="table-responsive-lg py-5">
          <form class="form-inline justify-content-end">
            <label class="sr-only" for="searchCapabilities">Search Capabilities</label>
            <input
              type="text"
              class="form-control text-light bg-transparent mb-2 ml-sm-2"
              id="searchCapabilities"
              placeholder="Search"

              v-model="search">
          </form>
          <table class="table table-hover bg-transparent">
            <thead v-if="hasVisibleRows" class="bg-light">
              <tr>
                <th v-for="heading in headings" scope="col">{{ heading }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in visibleRows"
                class="border-secondary border-bottom">
                  <td v-for="(value, key) in row" :scope="(i) ? 'row' : 'col'" class="d-block d-sm-table-cell border-0">
                      <h3 class="badge text-left d-block d-sm-none bg-dark p-3">{{ key }}</h3>
                      <div class="body px-4 px-sm-0">{{ value }}</div>
                  </td>
              </tr>
              <div v-if="!hasVisibleRows">
                <div class="h2 text-center p-5">
                  <strong>{{ this.search }}</strong> did not match anything
                </div>
              </div>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>No data found</template>
    </div>
    <div v-else class="display-4 text-center py-5">Loading...</div>
</template>

<script>
  import axios from 'axios'
  import is from 'is_js'
  // import {default as gsheets} from 'gsheets'

  require('isomorphic-fetch')
  const gsheets = require('gsheets')

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
        search: ''
      }
    },
    computed: {
      headings () {
        // Return empty
        if (!this.sheet || is.empty(this.sheet.data)) return null

        return Object.keys(this.sheet.data[0])
      },
      // A list of functions populated by conditions
      activeFilters () {
        let filters = []

        // If there is something in the search field
        // then add the searchFilter to activeFilters
        if (is.not.empty(this.search)) filters.push(this.searchFilter)

        return filters
      },
      visibleRows () {
        // We'll set this and make it mutable
        let rows = this.sheet.data

        // We'll loop through any active filters
        this.activeFilters.forEach((activeFilter) => {
          // Write over previous row set
          rows = rows.filter(activeFilter)
          // and since we're in a loop do it again
          // if there's another activeFilter but
          // this time with possibly less rows
          // so the filtering gets progressively
          // faster
        })

        // Return what's left
        return rows
      },
      hasVisibleRows () {
        return this.visibleRows.length !== 0
      }
    },
    methods: {
      searchFilter (row) {
        // Get the search string and convert
        // it to lowercase so we can compare
        // it in a case insensitive way
        const searchString = this.search.toLowerCase()

        // Determine if the searchString is in
        // the cell we are current looking at.
        // Converts the cell contents to lowercase.
        const includesSearchValue = (cell) => String(cell).toLowerCase().includes(searchString)

        // Map through the row to see if cells
        // match the search value.
        // ex: [true, false, false, true, etc...]
        const results = Object.values(row).map((cell) => includesSearchValue(cell))

        // Return true if any cells match
        return is.any.truthy(results)
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
