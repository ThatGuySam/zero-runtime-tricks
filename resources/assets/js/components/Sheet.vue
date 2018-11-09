<template>
  <div
    ref="sheet-container"
    v-if="!loading"
    class="sheet-container container-fluid">
    <template v-if="sheet">
      <div class="table-responsive-lg py-5">
        <div class="container-fluid">
          <div class="row justify-content-center">
            <form class="form col-lg-6" @submit.prevent>
              <div class="form-group">
                <label
                  class="sr-only"
                  for="searchCapabilities">Search Capabilities</label>
                <input
                  id="searchCapabilities"
                  name="capabilities-search"
                  v-model="search"
                  type="text"
                  class="capabilities-search-input form-control form-control-lg bg-transparent mb-4 "
                  placeholder="Search" />
                <small id="search-help" class="form-text text-muted">ex: Keyword or Part Number</small>
              </div>
            </form>
          </div>
        </div>
        <table
          v-if="hasSearchInputText"
          class="table table-hover bg-transparent"
        >
          <thead
            v-if="hasVisibleRows"
            class="bg-light">
            <tr>
              <th
                v-for="(heading, i) in headings"
                :key="i"
                scope="col"
                :class="`table-heading-${i} table-heading-${makeSlug(heading)}`">{{ heading }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, i) in visibleRows"
              :key="i"
              class="border-secondary border-bottom">
              <td
                v-for="(value, key) in row"
                :key="key"
                :scope="(i) ? 'row' : 'col'"
                class="d-block d-sm-table-cell border-0">
                <h3 class="badge text-left d-block d-sm-none bg-light p-3">{{ key }}</h3>
                <div class="table-cell body px-4 px-sm-0">{{ value }}</div>
              </td>
            </tr>
            <div v-if="!hasVisibleRows">
              <div class="h2 text-center p-5">
                <strong>{{ search }}</strong> did not match anything
              </div>
            </div>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else>No data found</template>
  </div>
  <div
    v-else
    class="display-4 text-center py-5">Loading...</div>
</template>

<script>
  // import axios from 'axios'
  import is from 'is_js'
  import { makeSlug } from '../helpers'
  // import {default as gsheets} from 'gsheets'

  require('isomorphic-fetch')
  const gsheets = require('gsheets')

  const urlParams = new URLSearchParams(window.location.search)

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
        sheet: null,
        search: ''
      }
    },
    computed: {
      hasSearchInputText () {
        return is.not.empty(this.search)
      },
      urlSearchParameter () {
        return urlParams.get('capabilities-search')
      },
      headings () {
        // Return empty
        if (!this.sheet || is.empty(this.sheet.data)) return null

        return Object.keys(this.sheet.data[0])
      },
      // A list of functions populated by conditions
      activeFilters () {
        const filters = []

        // If there is something in the search field
        // then add the searchFilter to activeFilters
        if (this.hasSearchInputText) filters.push(this.searchFilter)

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
    async mounted () {
      await gsheets.getWorksheet(this.sheetId, this.worksheet).
        then((res) => {
          // console.log(res)
          this.sheet = res
          this.loading = false
        }, (err) => {
          throw new Error(err)
        })

        if (is.string(this.urlSearchParameter)) {
          this.search = this.urlSearchParameter
          this.$refs['sheet-container'].scrollIntoView()
        }
    },
    methods: {
      makeSlug,
      searchFilter (row) {
        // Get the search string and convert
        // it to lowercase so we can compare
        // it in a case insensitive way
        const searchString = this.search.toLowerCase()

        // Determine if the searchString is in
        // the cell we are current looking at.
        // Converts the cell contents to lowercase.
        const includesSearchValue = (cell) => String(cell).toLowerCase().
includes(searchString)

        // Map through the row to see if cells
        // match the search value.
        // ex: [true, false, false, true, etc...]
        const results = Object.values(row).map((cell) => includesSearchValue(cell))

        // Return true if any cells match
        return is.any.truthy(results)
      }
    },
  }
</script>
