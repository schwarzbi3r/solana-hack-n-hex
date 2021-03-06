<script lang="js">

import { ref, reactive } from 'vue'
import { binary_to_base58 } from 'base58-js'
import PublicAddress from './PublicAddress.vue';

let pageSize = 512

DataView.prototype.getUint64 = function(byteOffset, littleEndian) {
  // split 64-bit number into two 32-bit (4-byte) parts
  const left =  this.getUint32(byteOffset, littleEndian);
  const right = this.getUint32(byteOffset + 4, littleEndian);

  // combine the two 32-bit values
  const combined = littleEndian ? left + 2 ** 32 * right : 2 ** 32 * left + right;

  if (!Number.isSafeInteger(combined)) {
    // Don't spam the logs for now
    // console.warn(combined, 'exceeds MAX_SAFE_INTEGER. Precision may be lost');
  }

  return combined;
}

function getOffset(idx, cidx) {
  return idx * 16 + cidx
}

function activeLine(offset, lineIdx) {
  if (offset >= lineIdx * 16 && offset < (lineIdx + 1) * 16) {
    return true
  }
  return false
}

export default {
  components: { PublicAddress },
  props: {
    dataView: {
      type: DataView,
      required: true,
    }
  },

  setup() {
    const offset = ref(0)
    const row = reactive({
        start: 0,
        end:  pageSize / 16,
      }
    )
    const updateOffset = (newVal) => {
      offset.value = newVal
      const currentRow = Math.floor(newVal/16)
      if (currentRow >= row.end) {
        row.start = row.start + 1
      } else if (currentRow < row.start) {
        row.start = row.start - 1
      }
      if (currentRow < row.start || currentRow >= row.end) {
        row.start = currentRow
      }
      row.end = row.start + pageSize / 16
    }
    const updateStartAndEnd = (start, end) => {
      row.start.value = start
      row.end.value = end
    }
    return {
      row,
      offset,
      updateOffset,
      updateStartAndEnd,
    }
  },

  created() {
    if (this.dataView.byteLength === 0) {
      throw new TypeError('DataView is empty')
    }
    document.addEventListener('keydown', this.handleKey)
  },
  destroyed: function() {
    window.removeEventListener('keydown', this.handleKey);
  },

  methods: {
    getRows(fn) {
      const rows = []
      for (let row = this.row.start; row < this.rowsLen; row++) {
        const values = []
        for (let column = 0; column < this.rowLength; column++) {
          const offset = row * this.rowLength + column
          const value = offset < this.dataView.byteLength ? this.dataView.getUint8(offset) : '  '
          values.push(fn(value))
        }
        rows.push(values)
      }
      return rows
    },
    clickByte(idx, cidx) {
      this.updateOffset(getOffset(idx, cidx))
    },
    handleKey(key) {
      switch(key.key) {
        case 'ArrowUp': {
          if (this.offset - 16 >= 0) {
            this.updateOffset(this.offset - 16)
            key.preventDefault();
          }
          break;
        }
        case 'ArrowDown': {
          if (this.offset + 16 < this.dataView.byteLength) {
            this.updateOffset(this.offset + 16)
            key.preventDefault();
          }
          break;
        }
        case 'ArrowLeft': {
          if (this.offset - 1 >= 0) {
            this.updateOffset(this.offset - 1)
            key.preventDefault();
          }
          break;
        }
        case 'ArrowRight': {
          if (this.offset + 1 < this.dataView.byteLength) {
            this.updateOffset(this.offset + 1)
            key.preventDefault();
          }
          break;
        }
        case 'PageDown': {
          if (this.dataView.byteLength === this.offset + 1) { return }
          if (this.offset + Math.floor(pageSize/2) < this.dataView.byteLength) {
            this.updateOffset(this.offset + Math.floor(pageSize/2))
            key.preventDefault();
          } else {
            this.updateOffset(this.dataView.byteLength - 1)
            key.preventDefault();
          }
          break;
        }
        case 'PageUp': {
          if (this.offset === 0) { return }
          if (this.offset - Math.floor(pageSize/2) > 0) {
            this.updateOffset(this.offset - Math.floor(pageSize/2))
            key.preventDefault();
          } else {
            this.updateOffset(0)
            key.preventDefault();
          }
          break;
        }
      }
    },
    getOffset,
    activeLine,
  },
  data() {
    return {
      rowLength: 16,
    }
  },
  computed: {
    relativeOffset() {
      return this.offset - this.row.start * 16
    },
    currentLine() {
      return Math.floor(this.relativeOffset / 16)
    },
    size() {
      return this.dataView.byteLength
    },
    maxStartRow() {
      return this.maxRows - (this.rows - 1)
    },
    maxRows() {
      return Math.ceil(this.dataView.byteLength / this.rowLength)
    },
    // Only display a subset of the data if it's large
    rowsLen() {
      return this.row.end <= this.maxRows ? this.row.end : this.maxRows
    },
    offsets() {
      const rows = []
      for (let row = this.row.start; row < this.rowsLen; row++) {
        rows.push((row * this.rowLength).toString(16).padStart(8,'0'))
      }
      return rows
    },

    hex() {
      return this.getRows((value) => value.toString(16).padStart(2,'0').toUpperCase())
    },
    ascii() {
      return this.getRows((value) => {
        if (value === '  ') {
          return ' '
        }
        return value >= 32 && value <= 127 ? String.fromCharCode(value) : '.'
      })
    },
    decodePubKey() {
      if (this.offset + 32 <= this.dataView.byteLength) {
        return binary_to_base58(new Uint8Array(this.dataView.buffer.slice(this.offset, this.offset + 32)))
      }
      return ''
    },

    decodeUint8() {
      return this.dataView.getUint8(this.offset, true)
    },

    decodeUint16() {
      if (this.offset + 2 <= this.dataView.byteLength) {
        return this.dataView.getUint16(this.offset, true)
      }
      return ''
    },

    decodeUint32() {
      if (this.offset + 4 <= this.dataView.byteLength) {
        return this.dataView.getUint32(this.offset, true)
      }
      return ''
    },
    
    decodeUint64() {
      if (this.offset + 8 <= this.dataView.byteLength) {
        return this.dataView.getUint64(this.offset, true)
      }
      return ''
    }

  }
}
</script>

<template>
  <div class="hexContainer">
    <div class='offsets'>
      <div v-for="(hexOffset, idx) in offsets" :key="hexOffset" class="line"
        :class="{ activeLine: currentLine == idx}"
        >
        {{ hexOffset }}
      </div>
    </div>
    <div class='hexs'>
      <div v-for="(r, idx) in hex" class="line"
        :class="{ activeLine: currentLine == idx}"
        :key="'row'+idx">
        <div v-for="(col, cidx) in r" :key="'row'+idx+'col'+cidx">
          <span v-on:click="clickByte(idx, cidx)"
            :class="{'active': relativeOffset === getOffset(idx, cidx)}"
          >{{ col }}</span>
          <span v-if="cidx < this.rowLength - 1">&nbsp;</span>
        </div>
      </div>
    </div>
    <div class='asciis'>
      <div v-for="(r, idx) in ascii" class='line' :key="'row'+idx"
            :class="{ activeLine: currentLine == idx}">
        <div v-for="(col, cidx) in r" :key="'row'+idx+'col'+cidx">
          <span v-on:click="clickByte(idx, cidx)"
            :class="{'active': relativeOffset === getOffset(idx, cidx)}"
          >{{ col }}</span>
        </div>
      </div>
    </div>
    <div class="info ml-3">
      <table>
        <tr>
          <td> <span>Offset:</span> </td>
          <td> <span>{{ offset }}</span> </td>
        </tr>
        <tr>
          <td> <span>PubKey:</span> </td>
          <td>
            <span v-if="decodePubKey">
              <public-address :address="decodePubKey"/>
            </span>
          </td>
        </tr>
        <tr> <td> <span>Uint8:</span> </td> <td> <span>{{ decodeUint8 }}</span> </td> </tr>
        <tr> <td> <span>Uint32:</span> </td> <td> <span>{{ decodeUint32 }}</span> </td> </tr>
        <tr> <td> <span>Uint64:</span> </td> <td> <span>{{ decodeUint64 }}</span> </td> </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
#app  {
  text-align: left;
}
a {
  color: #42b983;
}
.hexContainer {
  font-family: monospace;
  display: flex;
  flex-direction: row;
  width: 100%;
}
.line {
  display: flex;
  flex-direction: row;
}
.offsets {
  display: flex;
  flex-direction: column;
  align-items:flex-end;
}
.offsets .line {
  padding-right: 1em;
}
.offsets .activeLine {
  background-color: rgb(240, 240, 240);
  color: rgb(10, 1, 1);
}
.hexs {
  display: flex;
  flex-direction: column;
}
.hexs .line {
  padding-right: 1em;
}
.hexs .activeLine {
  background-color: rgb(209, 209, 209);
  color: rgb(10, 1, 1);
}
.asciis {
  display: flex;
  flex-direction: column;
}
.asciis .line{
  padding-left: 0em;
}
.asciis .activeLine {
  background-color: rgb(240, 240, 240);
  color: rgb(10, 1, 1);
}
.active {
  background-color: rgb(247, 68, 98);
  color: rgb(10, 1, 1);
}
table td:nth-child(1) {
  font-weight: 600;
}
table td:nth-child(2) {
  font-family: monospace;
  padding-left: 2em;
}
</style>