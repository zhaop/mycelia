/*
A <div> table where each row has a label and a few <button> options.

Methods:
- constructor(config): construct the object
  config: {
    id: ID attribute of wrapper div,
    rows: [
      {
        label: String label for the row,
        action: (value) => {...}, called with `option.value` when an `option` is selected,
        options: [
          {
            label: String label for this option,
            value: String value for this option,
          },
          ...
        ],
      },
      ...
    ]
  }
- dom(): return the wrapper div element
*/

export class OptionsTable {
  constructor(config = {}) {
    this.config = {
      id: null,         // ID attribute of div around options panel
      rows: [],         // row definitions, where each row is {label: String, options: [{label: String, action: () => {...}}, ...], selected: String}
      ...config
    }

    this.state = {
      selected: Object.fromEntries(this.config.rows.map(row => [row.label, row.selected])), // row label -> selected option label
    }

    this.rowEls = {}  // row label -> row element
    this.optionElsByRow = {} // row label -> {option label -> option element}

    // Wrapper div
    this.el = document.createElement('div')
    this.el.classList.add('options-table')

    for (const row of this.config.rows) {
      const {label: rowLabel, action, options, selected} = row

      // Make row
      const rowEl = document.createElement('div')
      rowEl.classList.add('row')
      this.el.append(rowEl)
      this.rowEls[rowLabel] = rowEl

      const labelEl = document.createElement('div')
      labelEl.classList.add('row-label')
      labelEl.innerText = rowLabel
      rowEl.append(labelEl)

      const optionsEl = document.createElement('div')
      optionsEl.classList.add('row-options')
      rowEl.append(optionsEl)

      this.optionElsByRow[rowLabel] = {}

      for (const option of options) {
        const {label: optionLabel, value} = option

        // Make option
        const optionEl = document.createElement('button')
        optionEl.innerText = optionLabel
        optionEl.title = value
        optionsEl.append(optionEl)
        this.optionElsByRow[rowLabel][optionLabel] = optionEl

        optionEl.addEventListener('click', ev => {
          if (this.state.selected[rowLabel] == optionLabel)
            return;

          this.state.selected[rowLabel] = optionLabel
          this._render()

          action(value)
        })
      }
    }

    this._render()
  }

  _render() {
    for (const [rowLabel, selected] of Object.entries(this.state.selected)) {
      for (const [optionLabel, optionEl] of Object.entries(this.optionElsByRow[rowLabel])) {
        const isSelected = optionEl.classList.contains('selected')
        const shouldBeSelected = (optionLabel == selected)

        // Set disabled attribute
        if (shouldBeSelected && !optionEl.disabled)
          optionEl.disabled = true;
        else if (!shouldBeSelected && optionEl.disabled)
          optionEl.disabled = false;

        // Set selected class
        if (shouldBeSelected && !isSelected)
          optionEl.classList.add('selected');
        else if (!shouldBeSelected && isSelected)
          optionEl.classList.remove('selected');
      }
    }
  }

  dom() {
    return this.el
  }
}