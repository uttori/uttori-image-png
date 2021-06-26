var ImagePNG = (function () {
  'use strict';

  var inflate$3 = {};

  var inflate$2 = {};

  const adler32$1 = (adler, buf, len, pos) => {
    let s1 = adler & 0xffff | 0,
        s2 = adler >>> 16 & 0xffff | 0,
        n = 0;
    while (len !== 0) {
      n = len > 2000 ? 2000 : len;
      len -= n;
      do {
        s1 = s1 + buf[pos++] | 0;
        s2 = s2 + s1 | 0;
      } while (--n);
      s1 %= 65521;
      s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
  };
  var adler32_1 = adler32$1;

  const makeTable = () => {
    let c,
        table = [];
    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) {
        c = c & 1 ? 0xEDB88320 ^ c >>> 1 : c >>> 1;
      }
      table[n] = c;
    }
    return table;
  };
  const crcTable = new Uint32Array(makeTable());
  const crc32$1 = (crc, buf, len, pos) => {
    const t = crcTable;
    const end = pos + len;
    crc ^= -1;
    for (let i = pos; i < end; i++) {
      crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 0xFF];
    }
    return crc ^ -1;
  };
  var crc32_1 = crc32$1;

  const BAD$1 = 30;
  const TYPE$1 = 12;
  var inffast = function inflate_fast(strm, start) {
    let _in;
    let last;
    let _out;
    let beg;
    let end;
    let dmax;
    let wsize;
    let whave;
    let wnext;
    let s_window;
    let hold;
    let bits;
    let lcode;
    let dcode;
    let lmask;
    let dmask;
    let here;
    let op;
    let len;
    let dist;
    let from;
    let from_source;
    let input, output;
    const state = strm.state;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    dmax = state.dmax;
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;
    top: do {
      if (bits < 15) {
        hold += input[_in++] << bits;
        bits += 8;
        hold += input[_in++] << bits;
        bits += 8;
      }
      here = lcode[hold & lmask];
      dolen: for (;;) {
        op = here >>> 24
        ;
        hold >>>= op;
        bits -= op;
        op = here >>> 16 & 0xff
        ;
        if (op === 0) {
          output[_out++] = here & 0xffff
          ;
        } else if (op & 16) {
          len = here & 0xffff
          ;
          op &= 15;
          if (op) {
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
            }
            len += hold & (1 << op) - 1;
            hold >>>= op;
            bits -= op;
          }
          if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
          }
          here = dcode[hold & dmask];
          dodist: for (;;) {
            op = here >>> 24
            ;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 0xff
            ;
            if (op & 16) {
              dist = here & 0xffff
              ;
              op &= 15;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
              }
              dist += hold & (1 << op) - 1;
              if (dist > dmax) {
                strm.msg = 'invalid distance too far back';
                state.mode = BAD$1;
                break top;
              }
              hold >>>= op;
              bits -= op;
              op = _out - beg;
              if (dist > op) {
                op = dist - op;
                if (op > whave) {
                  if (state.sane) {
                    strm.msg = 'invalid distance too far back';
                    state.mode = BAD$1;
                    break top;
                  }
                }
                from = 0;
                from_source = s_window;
                if (wnext === 0) {
                  from += wsize - op;
                  if (op < len) {
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;
                    from_source = output;
                  }
                } else if (wnext < op) {
                  from += wsize + wnext - op;
                  op -= wnext;
                  if (op < len) {
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = 0;
                    if (wnext < len) {
                      op = wnext;
                      len -= op;
                      do {
                        output[_out++] = s_window[from++];
                      } while (--op);
                      from = _out - dist;
                      from_source = output;
                    }
                  }
                } else {
                  from += wnext - op;
                  if (op < len) {
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;
                    from_source = output;
                  }
                }
                while (len > 2) {
                  output[_out++] = from_source[from++];
                  output[_out++] = from_source[from++];
                  output[_out++] = from_source[from++];
                  len -= 3;
                }
                if (len) {
                  output[_out++] = from_source[from++];
                  if (len > 1) {
                    output[_out++] = from_source[from++];
                  }
                }
              } else {
                from = _out - dist;
                do {
                  output[_out++] = output[from++];
                  output[_out++] = output[from++];
                  output[_out++] = output[from++];
                  len -= 3;
                } while (len > 2);
                if (len) {
                  output[_out++] = output[from++];
                  if (len > 1) {
                    output[_out++] = output[from++];
                  }
                }
              }
            } else if ((op & 64) === 0) {
              here = dcode[(here & 0xffff) + (
              hold & (1 << op) - 1)];
              continue dodist;
            } else {
              strm.msg = 'invalid distance code';
              state.mode = BAD$1;
              break top;
            }
            break;
          }
        } else if ((op & 64) === 0) {
          here = lcode[(here & 0xffff) + (
          hold & (1 << op) - 1)];
          continue dolen;
        } else if (op & 32) {
          state.mode = TYPE$1;
          break top;
        } else {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD$1;
          break top;
        }
        break;
      }
    } while (_in < last && _out < end);
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state.hold = hold;
    state.bits = bits;
    return;
  };

  const MAXBITS = 15;
  const ENOUGH_LENS$1 = 852;
  const ENOUGH_DISTS$1 = 592;
  const CODES$1 = 0;
  const LENS$1 = 1;
  const DISTS$1 = 2;
  const lbase = new Uint16Array([
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]);
  const lext = new Uint8Array([
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78]);
  const dbase = new Uint16Array([
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0]);
  const dext = new Uint8Array([
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]);
  const inflate_table$1 = (type, lens, lens_index, codes, table, table_index, work, opts) => {
    const bits = opts.bits;
    let len = 0;
    let sym = 0;
    let min = 0,
        max = 0;
    let root = 0;
    let curr = 0;
    let drop = 0;
    let left = 0;
    let used = 0;
    let huff = 0;
    let incr;
    let fill;
    let low;
    let mask;
    let next;
    let base = null;
    let base_index = 0;
    let end;
    const count = new Uint16Array(MAXBITS + 1);
    const offs = new Uint16Array(MAXBITS + 1);
    let extra = null;
    let extra_index = 0;
    let here_bits, here_op, here_val;
    for (len = 0; len <= MAXBITS; len++) {
      count[len] = 0;
    }
    for (sym = 0; sym < codes; sym++) {
      count[lens[lens_index + sym]]++;
    }
    root = bits;
    for (max = MAXBITS; max >= 1; max--) {
      if (count[max] !== 0) {
        break;
      }
    }
    if (root > max) {
      root = max;
    }
    if (max === 0) {
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      opts.bits = 1;
      return 0;
    }
    for (min = 1; min < max; min++) {
      if (count[min] !== 0) {
        break;
      }
    }
    if (root < min) {
      root = min;
    }
    left = 1;
    for (len = 1; len <= MAXBITS; len++) {
      left <<= 1;
      left -= count[len];
      if (left < 0) {
        return -1;
      }
    }
    if (left > 0 && (type === CODES$1 || max !== 1)) {
      return -1;
    }
    offs[1] = 0;
    for (len = 1; len < MAXBITS; len++) {
      offs[len + 1] = offs[len] + count[len];
    }
    for (sym = 0; sym < codes; sym++) {
      if (lens[lens_index + sym] !== 0) {
        work[offs[lens[lens_index + sym]]++] = sym;
      }
    }
    if (type === CODES$1) {
      base = extra = work;
      end = 19;
    } else if (type === LENS$1) {
      base = lbase;
      base_index -= 257;
      extra = lext;
      extra_index -= 257;
      end = 256;
    } else {
      base = dbase;
      extra = dext;
      end = -1;
    }
    huff = 0;
    sym = 0;
    len = min;
    next = table_index;
    curr = root;
    drop = 0;
    low = -1;
    used = 1 << root;
    mask = used - 1;
    if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
      return 1;
    }
    for (;;) {
      here_bits = len - drop;
      if (work[sym] < end) {
        here_op = 0;
        here_val = work[sym];
      } else if (work[sym] > end) {
        here_op = extra[extra_index + work[sym]];
        here_val = base[base_index + work[sym]];
      } else {
        here_op = 32 + 64;
        here_val = 0;
      }
      incr = 1 << len - drop;
      fill = 1 << curr;
      min = fill;
      do {
        fill -= incr;
        table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
      } while (fill !== 0);
      incr = 1 << len - 1;
      while (huff & incr) {
        incr >>= 1;
      }
      if (incr !== 0) {
        huff &= incr - 1;
        huff += incr;
      } else {
        huff = 0;
      }
      sym++;
      if (--count[len] === 0) {
        if (len === max) {
          break;
        }
        len = lens[lens_index + work[sym]];
      }
      if (len > root && (huff & mask) !== low) {
        if (drop === 0) {
          drop = root;
        }
        next += min;
        curr = len - drop;
        left = 1 << curr;
        while (curr + drop < max) {
          left -= count[curr + drop];
          if (left <= 0) {
            break;
          }
          curr++;
          left <<= 1;
        }
        used += 1 << curr;
        if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
          return 1;
        }
        low = huff & mask;
        table[low] = root << 24 | curr << 16 | next - table_index | 0;
      }
    }
    if (huff !== 0) {
      table[next + huff] = len - drop << 24 | 64 << 16 | 0;
    }
    opts.bits = root;
    return 0;
  };
  var inftrees = inflate_table$1;

  var constants = {
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    Z_BINARY: 0,
    Z_TEXT: 1,
    Z_UNKNOWN: 2,
    Z_DEFLATED: 8
  };

  const adler32 = adler32_1;
  const crc32 = crc32_1;
  const inflate_fast = inffast;
  const inflate_table = inftrees;
  const CODES = 0;
  const LENS = 1;
  const DISTS = 2;
  const {
    Z_FINISH: Z_FINISH$1,
    Z_BLOCK,
    Z_TREES,
    Z_OK: Z_OK$1,
    Z_STREAM_END: Z_STREAM_END$1,
    Z_NEED_DICT: Z_NEED_DICT$1,
    Z_STREAM_ERROR: Z_STREAM_ERROR$1,
    Z_DATA_ERROR: Z_DATA_ERROR$1,
    Z_MEM_ERROR: Z_MEM_ERROR$1,
    Z_BUF_ERROR,
    Z_DEFLATED
  } = constants;
  const HEAD = 1;
  const FLAGS = 2;
  const TIME = 3;
  const OS = 4;
  const EXLEN = 5;
  const EXTRA = 6;
  const NAME = 7;
  const COMMENT = 8;
  const HCRC = 9;
  const DICTID = 10;
  const DICT = 11;
  const TYPE = 12;
  const TYPEDO = 13;
  const STORED = 14;
  const COPY_ = 15;
  const COPY = 16;
  const TABLE = 17;
  const LENLENS = 18;
  const CODELENS = 19;
  const LEN_ = 20;
  const LEN = 21;
  const LENEXT = 22;
  const DIST = 23;
  const DISTEXT = 24;
  const MATCH = 25;
  const LIT = 26;
  const CHECK = 27;
  const LENGTH = 28;
  const DONE = 29;
  const BAD = 30;
  const MEM = 31;
  const SYNC = 32;
  const ENOUGH_LENS = 852;
  const ENOUGH_DISTS = 592;
  const MAX_WBITS = 15;
  const DEF_WBITS = MAX_WBITS;
  const zswap32 = q => {
    return (q >>> 24 & 0xff) + (q >>> 8 & 0xff00) + ((q & 0xff00) << 8) + ((q & 0xff) << 24);
  };
  function InflateState() {
    this.mode = 0;
    this.last = false;
    this.wrap = 0;
    this.havedict = false;
    this.flags = 0;
    this.dmax = 0;
    this.check = 0;
    this.total = 0;
    this.head = null;
    this.wbits = 0;
    this.wsize = 0;
    this.whave = 0;
    this.wnext = 0;
    this.window = null;
    this.hold = 0;
    this.bits = 0;
    this.length = 0;
    this.offset = 0;
    this.extra = 0;
    this.lencode = null;
    this.distcode = null;
    this.lenbits = 0;
    this.distbits = 0;
    this.ncode = 0;
    this.nlen = 0;
    this.ndist = 0;
    this.have = 0;
    this.next = null;
    this.lens = new Uint16Array(320);
    this.work = new Uint16Array(288);
    this.lendyn = null;
    this.distdyn = null;
    this.sane = 0;
    this.back = 0;
    this.was = 0;
  }
  const inflateResetKeep = strm => {
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = '';
    if (state.wrap) {
      strm.adler = state.wrap & 1;
    }
    state.mode = HEAD;
    state.last = 0;
    state.havedict = 0;
    state.dmax = 32768;
    state.head = null
    ;
    state.hold = 0;
    state.bits = 0;
    state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
    state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
    state.sane = 1;
    state.back = -1;
    return Z_OK$1;
  };
  const inflateReset = strm => {
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return inflateResetKeep(strm);
  };
  const inflateReset2 = (strm, windowBits) => {
    let wrap;
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else {
      wrap = (windowBits >> 4) + 1;
      if (windowBits < 48) {
        windowBits &= 15;
      }
    }
    if (windowBits && (windowBits < 8 || windowBits > 15)) {
      return Z_STREAM_ERROR$1;
    }
    if (state.window !== null && state.wbits !== windowBits) {
      state.window = null;
    }
    state.wrap = wrap;
    state.wbits = windowBits;
    return inflateReset(strm);
  };
  const inflateInit2 = (strm, windowBits) => {
    if (!strm) {
      return Z_STREAM_ERROR$1;
    }
    const state = new InflateState();
    strm.state = state;
    state.window = null
    ;
    const ret = inflateReset2(strm, windowBits);
    if (ret !== Z_OK$1) {
      strm.state = null
      ;
    }
    return ret;
  };
  const inflateInit = strm => {
    return inflateInit2(strm, DEF_WBITS);
  };
  let virgin = true;
  let lenfix, distfix;
  const fixedtables = state => {
    if (virgin) {
      lenfix = new Int32Array(512);
      distfix = new Int32Array(32);
      let sym = 0;
      while (sym < 144) {
        state.lens[sym++] = 8;
      }
      while (sym < 256) {
        state.lens[sym++] = 9;
      }
      while (sym < 280) {
        state.lens[sym++] = 7;
      }
      while (sym < 288) {
        state.lens[sym++] = 8;
      }
      inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, {
        bits: 9
      });
      sym = 0;
      while (sym < 32) {
        state.lens[sym++] = 5;
      }
      inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, {
        bits: 5
      });
      virgin = false;
    }
    state.lencode = lenfix;
    state.lenbits = 9;
    state.distcode = distfix;
    state.distbits = 5;
  };
  const updatewindow = (strm, src, end, copy) => {
    let dist;
    const state = strm.state;
    if (state.window === null) {
      state.wsize = 1 << state.wbits;
      state.wnext = 0;
      state.whave = 0;
      state.window = new Uint8Array(state.wsize);
    }
    if (copy >= state.wsize) {
      state.window.set(src.subarray(end - state.wsize, end), 0);
      state.wnext = 0;
      state.whave = state.wsize;
    } else {
      dist = state.wsize - state.wnext;
      if (dist > copy) {
        dist = copy;
      }
      state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
      copy -= dist;
      if (copy) {
        state.window.set(src.subarray(end - copy, end), 0);
        state.wnext = copy;
        state.whave = state.wsize;
      } else {
        state.wnext += dist;
        if (state.wnext === state.wsize) {
          state.wnext = 0;
        }
        if (state.whave < state.wsize) {
          state.whave += dist;
        }
      }
    }
    return 0;
  };
  const inflate$1 = (strm, flush) => {
    let state;
    let input, output;
    let next;
    let put;
    let have, left;
    let hold;
    let bits;
    let _in, _out;
    let copy;
    let from;
    let from_source;
    let here = 0;
    let here_bits, here_op, here_val;
    let last_bits, last_op, last_val;
    let len;
    let ret;
    const hbuf = new Uint8Array(4);
    let opts;
    let n;
    const order =
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
      return Z_STREAM_ERROR$1;
    }
    state = strm.state;
    if (state.mode === TYPE) {
      state.mode = TYPEDO;
    }
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    _in = have;
    _out = left;
    ret = Z_OK$1;
    inf_leave:
    for (;;) {
      switch (state.mode) {
        case HEAD:
          if (state.wrap === 0) {
            state.mode = TYPEDO;
            break;
          }
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.wrap & 2 && hold === 0x8b1f) {
            state.check = 0
            ;
            hbuf[0] = hold & 0xff;
            hbuf[1] = hold >>> 8 & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0);
            hold = 0;
            bits = 0;
            state.mode = FLAGS;
            break;
          }
          state.flags = 0;
          if (state.head) {
            state.head.done = false;
          }
          if (!(state.wrap & 1) ||
          (((hold & 0xff) <<
          8) + (hold >> 8)) % 31) {
            strm.msg = 'incorrect header check';
            state.mode = BAD;
            break;
          }
          if ((hold & 0x0f) !==
          Z_DEFLATED) {
            strm.msg = 'unknown compression method';
            state.mode = BAD;
            break;
          }
          hold >>>= 4;
          bits -= 4;
          len = (hold & 0x0f) +
          8;
          if (state.wbits === 0) {
            state.wbits = len;
          } else if (len > state.wbits) {
            strm.msg = 'invalid window size';
            state.mode = BAD;
            break;
          }
          state.dmax = 1 << state.wbits;
          strm.adler = state.check = 1
          ;
          state.mode = hold & 0x200 ? DICTID : TYPE;
          hold = 0;
          bits = 0;
          break;
        case FLAGS:
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.flags = hold;
          if ((state.flags & 0xff) !== Z_DEFLATED) {
            strm.msg = 'unknown compression method';
            state.mode = BAD;
            break;
          }
          if (state.flags & 0xe000) {
            strm.msg = 'unknown header flags set';
            state.mode = BAD;
            break;
          }
          if (state.head) {
            state.head.text = hold >> 8 & 1;
          }
          if (state.flags & 0x0200) {
            hbuf[0] = hold & 0xff;
            hbuf[1] = hold >>> 8 & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = TIME;
        case TIME:
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.head) {
            state.head.time = hold;
          }
          if (state.flags & 0x0200) {
            hbuf[0] = hold & 0xff;
            hbuf[1] = hold >>> 8 & 0xff;
            hbuf[2] = hold >>> 16 & 0xff;
            hbuf[3] = hold >>> 24 & 0xff;
            state.check = crc32(state.check, hbuf, 4, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = OS;
        case OS:
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.head) {
            state.head.xflags = hold & 0xff;
            state.head.os = hold >> 8;
          }
          if (state.flags & 0x0200) {
            hbuf[0] = hold & 0xff;
            hbuf[1] = hold >>> 8 & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = EXLEN;
        case EXLEN:
          if (state.flags & 0x0400) {
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.length = hold;
            if (state.head) {
              state.head.extra_len = hold;
            }
            if (state.flags & 0x0200) {
              hbuf[0] = hold & 0xff;
              hbuf[1] = hold >>> 8 & 0xff;
              state.check = crc32(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
          } else if (state.head) {
            state.head.extra = null
            ;
          }
          state.mode = EXTRA;
        case EXTRA:
          if (state.flags & 0x0400) {
            copy = state.length;
            if (copy > have) {
              copy = have;
            }
            if (copy) {
              if (state.head) {
                len = state.head.extra_len - state.length;
                if (!state.head.extra) {
                  state.head.extra = new Uint8Array(state.head.extra_len);
                }
                state.head.extra.set(input.subarray(next,
                next + copy),
                len);
              }
              if (state.flags & 0x0200) {
                state.check = crc32(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              state.length -= copy;
            }
            if (state.length) {
              break inf_leave;
            }
          }
          state.length = 0;
          state.mode = NAME;
        case NAME:
          if (state.flags & 0x0800) {
            if (have === 0) {
              break inf_leave;
            }
            copy = 0;
            do {
              len = input[next + copy++];
              if (state.head && len && state.length < 65536
              ) {
                state.head.name += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 0x0200) {
              state.check = crc32(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) {
              break inf_leave;
            }
          } else if (state.head) {
            state.head.name = null;
          }
          state.length = 0;
          state.mode = COMMENT;
        case COMMENT:
          if (state.flags & 0x1000) {
            if (have === 0) {
              break inf_leave;
            }
            copy = 0;
            do {
              len = input[next + copy++];
              if (state.head && len && state.length < 65536
              ) {
                state.head.comment += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 0x0200) {
              state.check = crc32(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) {
              break inf_leave;
            }
          } else if (state.head) {
            state.head.comment = null;
          }
          state.mode = HCRC;
        case HCRC:
          if (state.flags & 0x0200) {
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (hold !== (state.check & 0xffff)) {
              strm.msg = 'header crc mismatch';
              state.mode = BAD;
              break;
            }
            hold = 0;
            bits = 0;
          }
          if (state.head) {
            state.head.hcrc = state.flags >> 9 & 1;
            state.head.done = true;
          }
          strm.adler = state.check = 0;
          state.mode = TYPE;
          break;
        case DICTID:
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          strm.adler = state.check = zswap32(hold);
          hold = 0;
          bits = 0;
          state.mode = DICT;
        case DICT:
          if (state.havedict === 0) {
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            return Z_NEED_DICT$1;
          }
          strm.adler = state.check = 1
          ;
          state.mode = TYPE;
        case TYPE:
          if (flush === Z_BLOCK || flush === Z_TREES) {
            break inf_leave;
          }
        case TYPEDO:
          if (state.last) {
            hold >>>= bits & 7;
            bits -= bits & 7;
            state.mode = CHECK;
            break;
          }
          while (bits < 3) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.last = hold & 0x01
          ;
          hold >>>= 1;
          bits -= 1;
          switch (hold & 0x03) {
            case 0:
              state.mode = STORED;
              break;
            case 1:
              fixedtables(state);
              state.mode = LEN_;
              if (flush === Z_TREES) {
                hold >>>= 2;
                bits -= 2;
                break inf_leave;
              }
              break;
            case 2:
              state.mode = TABLE;
              break;
            case 3:
              strm.msg = 'invalid block type';
              state.mode = BAD;
          }
          hold >>>= 2;
          bits -= 2;
          break;
        case STORED:
          hold >>>= bits & 7;
          bits -= bits & 7;
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if ((hold & 0xffff) !== (hold >>> 16 ^ 0xffff)) {
            strm.msg = 'invalid stored block lengths';
            state.mode = BAD;
            break;
          }
          state.length = hold & 0xffff;
          hold = 0;
          bits = 0;
          state.mode = COPY_;
          if (flush === Z_TREES) {
            break inf_leave;
          }
        case COPY_:
          state.mode = COPY;
        case COPY:
          copy = state.length;
          if (copy) {
            if (copy > have) {
              copy = have;
            }
            if (copy > left) {
              copy = left;
            }
            if (copy === 0) {
              break inf_leave;
            }
            output.set(input.subarray(next, next + copy), put);
            have -= copy;
            next += copy;
            left -= copy;
            put += copy;
            state.length -= copy;
            break;
          }
          state.mode = TYPE;
          break;
        case TABLE:
          while (bits < 14) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.nlen = (hold & 0x1f) +
          257;
          hold >>>= 5;
          bits -= 5;
          state.ndist = (hold & 0x1f) +
          1;
          hold >>>= 5;
          bits -= 5;
          state.ncode = (hold & 0x0f) +
          4;
          hold >>>= 4;
          bits -= 4;
          if (state.nlen > 286 || state.ndist > 30) {
            strm.msg = 'too many length or distance symbols';
            state.mode = BAD;
            break;
          }
          state.have = 0;
          state.mode = LENLENS;
        case LENLENS:
          while (state.have < state.ncode) {
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.lens[order[state.have++]] = hold & 0x07;
            hold >>>= 3;
            bits -= 3;
          }
          while (state.have < 19) {
            state.lens[order[state.have++]] = 0;
          }
          state.lencode = state.lendyn;
          state.lenbits = 7;
          opts = {
            bits: state.lenbits
          };
          ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;
          if (ret) {
            strm.msg = 'invalid code lengths set';
            state.mode = BAD;
            break;
          }
          state.have = 0;
          state.mode = CODELENS;
        case CODELENS:
          while (state.have < state.nlen + state.ndist) {
            for (;;) {
              here = state.lencode[hold & (1 << state.lenbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 0xff;
              here_val = here & 0xffff;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (here_val < 16) {
              hold >>>= here_bits;
              bits -= here_bits;
              state.lens[state.have++] = here_val;
            } else {
              if (here_val === 16) {
                n = here_bits + 2;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                if (state.have === 0) {
                  strm.msg = 'invalid bit length repeat';
                  state.mode = BAD;
                  break;
                }
                len = state.lens[state.have - 1];
                copy = 3 + (hold & 0x03);
                hold >>>= 2;
                bits -= 2;
              } else if (here_val === 17) {
                n = here_bits + 3;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                len = 0;
                copy = 3 + (hold & 0x07);
                hold >>>= 3;
                bits -= 3;
              } else {
                n = here_bits + 7;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                len = 0;
                copy = 11 + (hold & 0x7f);
                hold >>>= 7;
                bits -= 7;
              }
              if (state.have + copy > state.nlen + state.ndist) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              while (copy--) {
                state.lens[state.have++] = len;
              }
            }
          }
          if (state.mode === BAD) {
            break;
          }
          if (state.lens[256] === 0) {
            strm.msg = 'invalid code -- missing end-of-block';
            state.mode = BAD;
            break;
          }
          state.lenbits = 9;
          opts = {
            bits: state.lenbits
          };
          ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;
          if (ret) {
            strm.msg = 'invalid literal/lengths set';
            state.mode = BAD;
            break;
          }
          state.distbits = 6;
          state.distcode = state.distdyn;
          opts = {
            bits: state.distbits
          };
          ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
          state.distbits = opts.bits;
          if (ret) {
            strm.msg = 'invalid distances set';
            state.mode = BAD;
            break;
          }
          state.mode = LEN_;
          if (flush === Z_TREES) {
            break inf_leave;
          }
        case LEN_:
          state.mode = LEN;
        case LEN:
          if (have >= 6 && left >= 258) {
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            inflate_fast(strm, _out);
            put = strm.next_out;
            output = strm.output;
            left = strm.avail_out;
            next = strm.next_in;
            input = strm.input;
            have = strm.avail_in;
            hold = state.hold;
            bits = state.bits;
            if (state.mode === TYPE) {
              state.back = -1;
            }
            break;
          }
          state.back = 0;
          for (;;) {
            here = state.lencode[hold & (1 << state.lenbits) - 1];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 0xff;
            here_val = here & 0xffff;
            if (here_bits <= bits) {
              break;
            }
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (here_op && (here_op & 0xf0) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (;;) {
              here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >>
              last_bits)];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 0xff;
              here_val = here & 0xffff;
              if (last_bits + here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            hold >>>= last_bits;
            bits -= last_bits;
            state.back += last_bits;
          }
          hold >>>= here_bits;
          bits -= here_bits;
          state.back += here_bits;
          state.length = here_val;
          if (here_op === 0) {
            state.mode = LIT;
            break;
          }
          if (here_op & 32) {
            state.back = -1;
            state.mode = TYPE;
            break;
          }
          if (here_op & 64) {
            strm.msg = 'invalid literal/length code';
            state.mode = BAD;
            break;
          }
          state.extra = here_op & 15;
          state.mode = LENEXT;
        case LENEXT:
          if (state.extra) {
            n = state.extra;
            while (bits < n) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.length += hold & (1 << state.extra) - 1
            ;
            hold >>>= state.extra;
            bits -= state.extra;
            state.back += state.extra;
          }
          state.was = state.length;
          state.mode = DIST;
        case DIST:
          for (;;) {
            here = state.distcode[hold & (1 << state.distbits) - 1];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 0xff;
            here_val = here & 0xffff;
            if (here_bits <= bits) {
              break;
            }
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if ((here_op & 0xf0) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (;;) {
              here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >>
              last_bits)];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 0xff;
              here_val = here & 0xffff;
              if (last_bits + here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            hold >>>= last_bits;
            bits -= last_bits;
            state.back += last_bits;
          }
          hold >>>= here_bits;
          bits -= here_bits;
          state.back += here_bits;
          if (here_op & 64) {
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break;
          }
          state.offset = here_val;
          state.extra = here_op & 15;
          state.mode = DISTEXT;
        case DISTEXT:
          if (state.extra) {
            n = state.extra;
            while (bits < n) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.offset += hold & (1 << state.extra) - 1
            ;
            hold >>>= state.extra;
            bits -= state.extra;
            state.back += state.extra;
          }
          if (state.offset > state.dmax) {
            strm.msg = 'invalid distance too far back';
            state.mode = BAD;
            break;
          }
          state.mode = MATCH;
        case MATCH:
          if (left === 0) {
            break inf_leave;
          }
          copy = _out - left;
          if (state.offset > copy) {
            copy = state.offset - copy;
            if (copy > state.whave) {
              if (state.sane) {
                strm.msg = 'invalid distance too far back';
                state.mode = BAD;
                break;
              }
            }
            if (copy > state.wnext) {
              copy -= state.wnext;
              from = state.wsize - copy;
            } else {
              from = state.wnext - copy;
            }
            if (copy > state.length) {
              copy = state.length;
            }
            from_source = state.window;
          } else {
            from_source = output;
            from = put - state.offset;
            copy = state.length;
          }
          if (copy > left) {
            copy = left;
          }
          left -= copy;
          state.length -= copy;
          do {
            output[put++] = from_source[from++];
          } while (--copy);
          if (state.length === 0) {
            state.mode = LEN;
          }
          break;
        case LIT:
          if (left === 0) {
            break inf_leave;
          }
          output[put++] = state.length;
          left--;
          state.mode = LEN;
          break;
        case CHECK:
          if (state.wrap) {
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold |= input[next++] << bits;
              bits += 8;
            }
            _out -= left;
            strm.total_out += _out;
            state.total += _out;
            if (_out) {
              strm.adler = state.check =
              state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
            }
            _out = left;
            if ((state.flags ? hold : zswap32(hold)) !== state.check) {
              strm.msg = 'incorrect data check';
              state.mode = BAD;
              break;
            }
            hold = 0;
            bits = 0;
          }
          state.mode = LENGTH;
        case LENGTH:
          if (state.wrap && state.flags) {
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (hold !== (state.total & 0xffffffff)) {
              strm.msg = 'incorrect length check';
              state.mode = BAD;
              break;
            }
            hold = 0;
            bits = 0;
          }
          state.mode = DONE;
        case DONE:
          ret = Z_STREAM_END$1;
          break inf_leave;
        case BAD:
          ret = Z_DATA_ERROR$1;
          break inf_leave;
        case MEM:
          return Z_MEM_ERROR$1;
        case SYNC:
        default:
          return Z_STREAM_ERROR$1;
      }
    }
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH$1)) {
      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
    }
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if (state.wrap && _out) {
      strm.adler = state.check =
      state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
    }
    strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
    if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) {
      ret = Z_BUF_ERROR;
    }
    return ret;
  };
  const inflateEnd = strm => {
    if (!strm || !strm.state
    ) {
        return Z_STREAM_ERROR$1;
      }
    let state = strm.state;
    if (state.window) {
      state.window = null;
    }
    strm.state = null;
    return Z_OK$1;
  };
  const inflateGetHeader = (strm, head) => {
    if (!strm || !strm.state) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    if ((state.wrap & 2) === 0) {
      return Z_STREAM_ERROR$1;
    }
    state.head = head;
    head.done = false;
    return Z_OK$1;
  };
  const inflateSetDictionary = (strm, dictionary) => {
    const dictLength = dictionary.length;
    let state;
    let dictid;
    let ret;
    if (!strm
    || !strm.state
    ) {
        return Z_STREAM_ERROR$1;
      }
    state = strm.state;
    if (state.wrap !== 0 && state.mode !== DICT) {
      return Z_STREAM_ERROR$1;
    }
    if (state.mode === DICT) {
      dictid = 1;
      dictid = adler32(dictid, dictionary, dictLength, 0);
      if (dictid !== state.check) {
        return Z_DATA_ERROR$1;
      }
    }
    ret = updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
      state.mode = MEM;
      return Z_MEM_ERROR$1;
    }
    state.havedict = 1;
    return Z_OK$1;
  };
  inflate$2.inflateReset = inflateReset;
  inflate$2.inflateReset2 = inflateReset2;
  inflate$2.inflateResetKeep = inflateResetKeep;
  inflate$2.inflateInit = inflateInit;
  inflate$2.inflateInit2 = inflateInit2;
  inflate$2.inflate = inflate$1;
  inflate$2.inflateEnd = inflateEnd;
  inflate$2.inflateGetHeader = inflateGetHeader;
  inflate$2.inflateSetDictionary = inflateSetDictionary;
  inflate$2.inflateInfo = 'pako inflate (from Nodeca project)';

  var common = {};

  const _has = (obj, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
  common.assign = function (obj
  ) {
    const sources = Array.prototype.slice.call(arguments, 1);
    while (sources.length) {
      const source = sources.shift();
      if (!source) {
        continue;
      }
      if (typeof source !== 'object') {
        throw new TypeError(source + 'must be non-object');
      }
      for (const p in source) {
        if (_has(source, p)) {
          obj[p] = source[p];
        }
      }
    }
    return obj;
  };
  common.flattenChunks = chunks => {
    let len = 0;
    for (let i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }
    const result = new Uint8Array(len);
    for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
      let chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }
    return result;
  };

  var strings$1 = {};

  let STR_APPLY_UIA_OK = true;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (__) {
    STR_APPLY_UIA_OK = false;
  }
  const _utf8len = new Uint8Array(256);
  for (let q = 0; q < 256; q++) {
    _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
  }
  _utf8len[254] = _utf8len[254] = 1;
  strings$1.string2buf = str => {
    let buf,
        c,
        c2,
        m_pos,
        i,
        str_len = str.length,
        buf_len = 0;
    for (m_pos = 0; m_pos < str_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 0xfc00) === 0xdc00) {
          c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
          m_pos++;
        }
      }
      buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
    }
    buf = new Uint8Array(buf_len);
    for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 0xfc00) === 0xd800 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 0xfc00) === 0xdc00) {
          c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
          m_pos++;
        }
      }
      if (c < 0x80) {
        buf[i++] = c;
      } else if (c < 0x800) {
        buf[i++] = 0xC0 | c >>> 6;
        buf[i++] = 0x80 | c & 0x3f;
      } else if (c < 0x10000) {
        buf[i++] = 0xE0 | c >>> 12;
        buf[i++] = 0x80 | c >>> 6 & 0x3f;
        buf[i++] = 0x80 | c & 0x3f;
      } else {
        buf[i++] = 0xf0 | c >>> 18;
        buf[i++] = 0x80 | c >>> 12 & 0x3f;
        buf[i++] = 0x80 | c >>> 6 & 0x3f;
        buf[i++] = 0x80 | c & 0x3f;
      }
    }
    return buf;
  };
  const buf2binstring = (buf, len) => {
    if (len < 65534) {
      if (buf.subarray && STR_APPLY_UIA_OK) {
        return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
      }
    }
    let result = '';
    for (let i = 0; i < len; i++) {
      result += String.fromCharCode(buf[i]);
    }
    return result;
  };
  strings$1.buf2string = (buf, max) => {
    let i, out;
    const len = max || buf.length;
    const utf16buf = new Array(len * 2);
    for (out = 0, i = 0; i < len;) {
      let c = buf[i++];
      if (c < 0x80) {
        utf16buf[out++] = c;
        continue;
      }
      let c_len = _utf8len[c];
      if (c_len > 4) {
        utf16buf[out++] = 0xfffd;
        i += c_len - 1;
        continue;
      }
      c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
      while (c_len > 1 && i < len) {
        c = c << 6 | buf[i++] & 0x3f;
        c_len--;
      }
      if (c_len > 1) {
        utf16buf[out++] = 0xfffd;
        continue;
      }
      if (c < 0x10000) {
        utf16buf[out++] = c;
      } else {
        c -= 0x10000;
        utf16buf[out++] = 0xd800 | c >> 10 & 0x3ff;
        utf16buf[out++] = 0xdc00 | c & 0x3ff;
      }
    }
    return buf2binstring(utf16buf, out);
  };
  strings$1.utf8border = (buf, max) => {
    max = max || buf.length;
    if (max > buf.length) {
      max = buf.length;
    }
    let pos = max - 1;
    while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) {
      pos--;
    }
    if (pos < 0) {
      return max;
    }
    if (pos === 0) {
      return max;
    }
    return pos + _utf8len[buf[pos]] > max ? pos : max;
  };

  var messages = {
    2: 'need dictionary',
    1: 'stream end',
    0: '',
    '-1': 'file error',
    '-2': 'stream error',
    '-3': 'data error',
    '-4': 'insufficient memory',
    '-5': 'buffer error',
    '-6': 'incompatible version'
  };

  function ZStream$1() {
    this.input = null;
    this.next_in = 0;
    this.avail_in = 0;
    this.total_in = 0;
    this.output = null;
    this.next_out = 0;
    this.avail_out = 0;
    this.total_out = 0;
    this.msg = ''
    ;
    this.state = null;
    this.data_type = 2
    ;
    this.adler = 0;
  }
  var zstream = ZStream$1;

  function GZheader$1() {
    this.text = 0;
    this.time = 0;
    this.xflags = 0;
    this.os = 0;
    this.extra = null;
    this.extra_len = 0;
    this.name = '';
    this.comment = '';
    this.hcrc = 0;
    this.done = false;
  }
  var gzheader = GZheader$1;

  const zlib_inflate = inflate$2;
  const utils = common;
  const strings = strings$1;
  const msg = messages;
  const ZStream = zstream;
  const GZheader = gzheader;
  const toString = Object.prototype.toString;
  const {
    Z_NO_FLUSH,
    Z_FINISH,
    Z_OK,
    Z_STREAM_END,
    Z_NEED_DICT,
    Z_STREAM_ERROR,
    Z_DATA_ERROR,
    Z_MEM_ERROR
  } = constants;
  function Inflate(options) {
    this.options = utils.assign({
      chunkSize: 1024 * 64,
      windowBits: 15,
      to: ''
    }, options || {});
    const opt = this.options;
    if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
      opt.windowBits = -opt.windowBits;
      if (opt.windowBits === 0) {
        opt.windowBits = -15;
      }
    }
    if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
      opt.windowBits += 32;
    }
    if (opt.windowBits > 15 && opt.windowBits < 48) {
      if ((opt.windowBits & 15) === 0) {
        opt.windowBits |= 15;
      }
    }
    this.err = 0;
    this.msg = '';
    this.ended = false;
    this.chunks = [];
    this.strm = new ZStream();
    this.strm.avail_out = 0;
    let status = zlib_inflate.inflateInit2(this.strm, opt.windowBits);
    if (status !== Z_OK) {
      throw new Error(msg[status]);
    }
    this.header = new GZheader();
    zlib_inflate.inflateGetHeader(this.strm, this.header);
    if (opt.dictionary) {
      if (typeof opt.dictionary === 'string') {
        opt.dictionary = strings.string2buf(opt.dictionary);
      } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
        opt.dictionary = new Uint8Array(opt.dictionary);
      }
      if (opt.raw) {
        status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
        if (status !== Z_OK) {
          throw new Error(msg[status]);
        }
      }
    }
  }
  Inflate.prototype.push = function (data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    const dictionary = this.options.dictionary;
    let status, _flush_mode, last_avail_out;
    if (this.ended) return false;
    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
    if (toString.call(data) === '[object ArrayBuffer]') {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for (;;) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      status = zlib_inflate.inflate(strm, _flush_mode);
      if (status === Z_NEED_DICT && dictionary) {
        status = zlib_inflate.inflateSetDictionary(strm, dictionary);
        if (status === Z_OK) {
          status = zlib_inflate.inflate(strm, _flush_mode);
        } else if (status === Z_DATA_ERROR) {
          status = Z_NEED_DICT;
        }
      }
      while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && data[strm.next_in] !== 0) {
        zlib_inflate.inflateReset(strm);
        status = zlib_inflate.inflate(strm, _flush_mode);
      }
      switch (status) {
        case Z_STREAM_ERROR:
        case Z_DATA_ERROR:
        case Z_NEED_DICT:
        case Z_MEM_ERROR:
          this.onEnd(status);
          this.ended = true;
          return false;
      }
      last_avail_out = strm.avail_out;
      if (strm.next_out) {
        if (strm.avail_out === 0 || status === Z_STREAM_END) {
          if (this.options.to === 'string') {
            let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
            let tail = strm.next_out - next_out_utf8;
            let utf8str = strings.buf2string(strm.output, next_out_utf8);
            strm.next_out = tail;
            strm.avail_out = chunkSize - tail;
            if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
            this.onData(utf8str);
          } else {
            this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
          }
        }
      }
      if (status === Z_OK && last_avail_out === 0) continue;
      if (status === Z_STREAM_END) {
        status = zlib_inflate.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return true;
      }
      if (strm.avail_in === 0) break;
    }
    return true;
  };
  Inflate.prototype.onData = function (chunk) {
    this.chunks.push(chunk);
  };
  Inflate.prototype.onEnd = function (status) {
    if (status === Z_OK) {
      if (this.options.to === 'string') {
        this.result = this.chunks.join('');
      } else {
        this.result = utils.flattenChunks(this.chunks);
      }
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function inflate(input, options) {
    const inflator = new Inflate(options);
    inflator.push(input);
    if (inflator.err) throw inflator.msg || msg[inflator.err];
    return inflator.result;
  }
  function inflateRaw(input, options) {
    options = options || {};
    options.raw = true;
    return inflate(input, options);
  }
  inflate$3.Inflate = Inflate;
  inflate$3.inflate = inflate;
  inflate$3.inflateRaw = inflateRaw;
  inflate$3.ungzip = inflate;
  inflate$3.constants = constants;

  class DataBuffer$2 {
    constructor(input) {
      if (!input) {
        const error = 'Missing input data.';
        throw new TypeError(error);
      }
      this.data = null;
      if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) {
        this.data = Buffer.from(input);
      } else if (typeof input === 'string') {
        this.data = Buffer.from(input);
      } else if (input instanceof Uint8Array) {
        this.data = input;
      } else if (input instanceof ArrayBuffer) {
        this.data = new Uint8Array(input);
      } else if (Array.isArray(input)) {
        this.data = new Uint8Array(input);
      } else if (typeof input === 'number') {
        this.data = new Uint8Array(input);
      } else if (input instanceof DataBuffer$2) {
        this.data = input.data;
      } else if (input.buffer && input.buffer instanceof ArrayBuffer) {
        this.data = new Uint8Array(input.buffer, input.byteOffset, input.length * input.BYTES_PER_ELEMENT);
      } else {
        const error = `Unknown type of input for DataBuffer: ${typeof input}`;
        throw new TypeError(error);
      }
      this.length = this.data.length;
      this.next = null;
      this.prev = null;
    }
    static allocate(size) {
      return new DataBuffer$2(size);
    }
    compare(input, offset = 0) {
      const buffer = new DataBuffer$2(input);
      const {
        length
      } = buffer;
      if (!length) {
        return false;
      }
      const local = this.slice(offset, length);
      const {
        data
      } = buffer;
      for (let i = 0; i < length; i++) {
        if (local.data[i] !== data[i]) {
          return false;
        }
      }
      return true;
    }
    copy() {
      return new DataBuffer$2(new Uint8Array(this.data));
    }
    slice(position, length = this.length) {
      if (position === 0 && length >= this.length) {
        return new DataBuffer$2(this.data);
      }
      return new DataBuffer$2(this.data.subarray(position, position + length));
    }
  }
  var dataBuffer = DataBuffer$2;

  let debug$2 = () => {};
  class DataBufferList$2 {
    constructor(buffers) {
      this.first = null;
      this.last = null;
      this.totalBuffers = 0;
      this.availableBytes = 0;
      this.availableBuffers = 0;
      if (buffers && Array.isArray(buffers)) {
        for (const buffer of buffers) {
          this.append(buffer);
        }
      }
    }
    copy() {
      const result = new DataBufferList$2();
      result.first = this.first;
      result.last = this.last;
      result.totalBuffers = this.totalBuffers;
      result.availableBytes = this.availableBytes;
      result.availableBuffers = this.availableBuffers;
      return result;
    }
    append(buffer) {
      buffer.prev = this.last;
      if (this.last) {
        this.last.next = buffer;
      }
      this.last = buffer;
      if (this.first == null) {
        this.first = buffer;
      }
      this.availableBytes += buffer.length;
      this.availableBuffers++;
      this.totalBuffers++;
      debug$2('append:', this.totalBuffers);
      return this.totalBuffers;
    }
    moreAvailable() {
      if (this.first && this.first.next != null) {
        return true;
      }
      return false;
    }
    advance() {
      if (this.first) {
        this.availableBytes -= this.first.length;
        this.availableBuffers--;
      }
      if (this.first && this.first.next) {
        this.first = this.first.next;
        return true;
      }
      this.first = null;
      return false;
    }
    rewind() {
      if (this.first && !this.first.prev) {
        return false;
      }
      this.first = this.first ? this.first.prev : this.last;
      if (this.first) {
        this.availableBytes += this.first.length;
        this.availableBuffers++;
      }
      return this.first != null;
    }
    reset() {
      while (this.rewind()) {
        continue;
      }
    }
  }
  var dataBufferList = DataBufferList$2;

  let debug$1 = () => {};
  const DataBuffer$1 = dataBuffer;
  const DataBufferList$1 = dataBufferList;
  class UnderflowError extends Error {
    constructor(message) {
      super(message);
      this.name = 'UnderflowError';
      this.stack = new Error(message).stack;
      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  class DataStream$1 {
    constructor(list, options = {}) {
      options.size = options.size || 16;
      if (options && options.size % 8 !== 0) {
        options.size += 8 - options.size % 8;
      }
      this.size = options.size;
      this.buf = new ArrayBuffer(this.size);
      this.uint8 = new Uint8Array(this.buf);
      this.int8 = new Int8Array(this.buf);
      this.uint16 = new Uint16Array(this.buf);
      this.int16 = new Int16Array(this.buf);
      this.uint32 = new Uint32Array(this.buf);
      this.int32 = new Int32Array(this.buf);
      this.float32 = new Float32Array(this.buf);
      this.float64 = new Float64Array(this.buf);
      this.int64 = new BigInt64Array(this.buf);
      this.uint64 = new BigUint64Array(this.buf);
      this.nativeEndian = new Uint16Array(new Uint8Array([0x12, 0x34]).buffer)[0] === 0x3412;
      this.list = list;
      this.localOffset = 0;
      this.offset = 0;
    }
    static fromData(data) {
      const buffer = new DataBuffer$1(data);
      const list = new DataBufferList$1();
      list.append(buffer);
      return new DataStream$1(list, {
        size: buffer.length
      });
    }
    static fromBuffer(buffer) {
      const list = new DataBufferList$1();
      list.append(buffer);
      return new DataStream$1(list, {
        size: buffer.length
      });
    }
    compare(input, offset = 0) {
      if (!input || !input.list || !input.list.availableBytes) {
        return false;
      }
      let {
        availableBytes
      } = input.list;
      if (offset) {
        availableBytes -= offset;
        this.seek(offset);
        input.seek(offset);
      }
      let local;
      let external;
      for (let i = 0; i < availableBytes; i++) {
        local = this.readUInt8();
        external = input.readUInt8();
        if (local !== external) {
          return false;
        }
      }
      return true;
    }
    next(input) {
      if (!input || typeof input.length !== 'number' || input.length === 0) {
        return false;
      }
      if (!this.available(input.length)) {
        debug$1(`Insufficient Bytes: ${input.length} <= ${this.remainingBytes()}`);
        return false;
      }
      debug$1('next: this.offset =', this.offset);
      for (let i = 0; i < input.length; i++) {
        const data = this.peekUInt8(this.offset + i);
        if (input[i] !== data) {
          debug$1('next: first failed match at', i, ', where:', input[i]);
          return false;
        }
      }
      return true;
    }
    copy() {
      const result = new DataStream$1(this.list.copy(), {
        size: this.size
      });
      result.localOffset = this.localOffset;
      result.offset = this.offset;
      return result;
    }
    available(bytes) {
      return bytes <= this.remainingBytes();
    }
    availableAt(bytes, offset) {
      return bytes <= this.list.availableBytes - offset;
    }
    remainingBytes() {
      return this.list.availableBytes - this.localOffset;
    }
    advance(bytes) {
      if (!this.available(bytes)) {
        throw new UnderflowError(`Insufficient Bytes: ${bytes} <= ${this.remainingBytes()}`);
      }
      this.localOffset += bytes;
      this.offset += bytes;
      while (this.list.first && this.localOffset >= this.list.first.length && this.list.moreAvailable()) {
        this.localOffset -= this.list.first.length;
        this.list.advance();
      }
      return this;
    }
    rewind(bytes) {
      if (bytes > this.offset) {
        throw new UnderflowError(`Insufficient Bytes: ${bytes} > ${this.offset}`);
      }
      this.localOffset -= bytes;
      this.offset -= bytes;
      while (this.list.first.prev && this.localOffset < 0) {
        this.list.rewind();
        this.localOffset += this.list.first.length;
      }
      return this;
    }
    seek(position) {
      if (position > this.offset) {
        return this.advance(position - this.offset);
      }
      if (position < this.offset) {
        return this.rewind(this.offset - position);
      }
      return this;
    }
    readUInt8() {
      if (!this.available(1)) {
        throw new UnderflowError('Insufficient Bytes: 1');
      }
      const output = this.list.first.data[this.localOffset];
      this.localOffset += 1;
      this.offset += 1;
      if (this.localOffset === this.list.first.length) {
        this.localOffset = 0;
        this.list.advance();
      }
      return output;
    }
    peekUInt8(offset = 0) {
      if (!this.availableAt(1, offset)) {
        throw new UnderflowError(`Insufficient Bytes: ${offset} + 1`);
      }
      let buffer = this.list.first;
      while (buffer) {
        if (buffer.length > offset) {
          return buffer.data[offset];
        }
        offset -= buffer.length;
        buffer = buffer.next;
      }
      return 0;
    }
    read(bytes, littleEndian = false) {
      if (littleEndian === this.nativeEndian) {
        for (let i = 0; i < bytes; i++) {
          this.uint8[i] = this.readUInt8();
        }
      } else {
        for (let i = bytes - 1; i >= 0; i--) {
          this.uint8[i] = this.readUInt8();
        }
      }
      const output = this.uint8.slice(0, bytes);
      return output;
    }
    peek(bytes, offset = 0, littleEndian = false) {
      if (littleEndian === this.nativeEndian) {
        for (let i = 0; i < bytes; i++) {
          this.uint8[i] = this.peekUInt8(offset + i);
        }
      } else {
        for (let i = 0; i < bytes; i++) {
          this.uint8[bytes - i - 1] = this.peekUInt8(offset + i);
        }
      }
      const output = this.uint8.slice(0, bytes);
      return output;
    }
    peekBit(position, length = 1, offset = 0) {
      if (Number.isNaN(position) || !Number.isInteger(position) || position < 0 || position > 7) {
        throw new Error(`peekBit position is invalid: ${position}, must be an Integer between 0 and 7`);
      }
      if (Number.isNaN(length) || !Number.isInteger(length) || length < 1 || length > 8) {
        throw new Error(`peekBit length is invalid: ${length}, must be an Integer between 1 and 8`);
      }
      const value = this.peekUInt8(offset);
      return (value << position & 0xFF) >>> 8 - length;
    }
    readInt8() {
      this.read(1);
      return this.int8[0];
    }
    peekInt8(offset = 0) {
      this.peek(1, offset);
      return this.int8[0];
    }
    readUInt16(littleEndian) {
      this.read(2, littleEndian);
      return this.uint16[0];
    }
    peekUInt16(offset = 0, littleEndian = false) {
      this.peek(2, offset, littleEndian);
      return this.uint16[0];
    }
    readInt16(littleEndian = false) {
      this.read(2, littleEndian);
      return this.int16[0];
    }
    peekInt16(offset = 0, littleEndian = false) {
      this.peek(2, offset, littleEndian);
      return this.int16[0];
    }
    readUInt24(littleEndian = false) {
      if (littleEndian) {
        return this.readUInt16(true) + (this.readUInt8() << 16);
      }
      return (this.readUInt16() << 8) + this.readUInt8();
    }
    peekUInt24(offset = 0, littleEndian = false) {
      if (littleEndian) {
        return this.peekUInt16(offset, true) + (this.peekUInt8(offset + 2) << 16);
      }
      return (this.peekUInt16(offset) << 8) + this.peekUInt8(offset + 2);
    }
    readInt24(littleEndian = false) {
      if (littleEndian) {
        return this.readUInt16(true) + (this.readInt8() << 16);
      }
      return (this.readInt16() << 8) + this.readUInt8();
    }
    peekInt24(offset = 0, littleEndian = false) {
      if (littleEndian) {
        return this.peekUInt16(offset, true) + (this.peekInt8(offset + 2) << 16);
      }
      return (this.peekInt16(offset) << 8) + this.peekUInt8(offset + 2);
    }
    readUInt32(littleEndian = false) {
      this.read(4, littleEndian);
      return this.uint32[0];
    }
    peekUInt32(offset = 0, littleEndian = false) {
      this.peek(4, offset, littleEndian);
      return this.uint32[0];
    }
    readInt32(littleEndian = false) {
      this.read(4, littleEndian);
      return this.int32[0];
    }
    peekInt32(offset = 0, littleEndian = false) {
      this.peek(4, offset, littleEndian);
      return this.int32[0];
    }
    readFloat32(littleEndian = false) {
      this.read(4, littleEndian);
      return this.float32[0];
    }
    peekFloat32(offset = 0, littleEndian = false) {
      this.peek(4, offset, littleEndian);
      return this.float32[0];
    }
    readFloat48(littleEndian = false) {
      this.read(6, littleEndian);
      return this.float48();
    }
    peekFloat48(offset, littleEndian = false) {
      this.peek(6, offset, littleEndian);
      return this.float48();
    }
    readFloat64(littleEndian = false) {
      this.read(8, littleEndian);
      return this.float64[0];
    }
    peekFloat64(offset = 0, littleEndian = false) {
      this.peek(8, offset, littleEndian);
      return this.float64[0];
    }
    readFloat80(littleEndian = false) {
      this.read(10, littleEndian);
      return this.float80();
    }
    peekFloat80(offset = 0, littleEndian = false) {
      this.peek(10, offset, littleEndian);
      return this.float80();
    }
    readBuffer(length) {
      const result = DataBuffer$1.allocate(length);
      const to = result.data;
      for (let i = 0; i < length; i++) {
        to[i] = this.readUInt8();
      }
      return result;
    }
    peekBuffer(offset, length) {
      const result = DataBuffer$1.allocate(length);
      const to = result.data;
      for (let i = 0; i < length; i++) {
        to[i] = this.peekUInt8(offset + i);
      }
      return result;
    }
    readSingleBuffer(length) {
      const result = this.list.first.slice(this.localOffset, length);
      this.advance(result.length);
      return result;
    }
    peekSingleBuffer(offset, length) {
      return this.list.first.slice(this.localOffset + offset, length);
    }
    readString(length, encoding = 'ascii') {
      return this.decodeString(this.offset, length, encoding, true);
    }
    peekString(offset, length, encoding = 'ascii') {
      return this.decodeString(offset, length, encoding, false);
    }
    float48() {
      let mantissa = 0;
      let exponent = this.uint8[0];
      if (exponent === 0) {
        return 0;
      }
      exponent = this.uint8[0] - 0x81;
      for (let i = 1; i <= 4; i++) {
        mantissa += this.uint8[i];
        mantissa /= 256;
      }
      mantissa += this.uint8[5] & 0x7F;
      mantissa /= 128;
      mantissa += 1;
      if (this.uint8[5] & 0x80) {
        mantissa = -mantissa;
      }
      const output = mantissa * 2 ** exponent;
      return Number.parseFloat(output.toFixed(4));
    }
    float80() {
      const [high, low] = [...this.uint32];
      const a0 = this.uint8[9];
      const a1 = this.uint8[8];
      const sign = 1 - (a0 >>> 7) * 2;
      let exponent = (a0 & 0x7F) << 8 | a1;
      if (exponent === 0 && low === 0 && high === 0) {
        return 0;
      }
      if (exponent === 0x7FFF) {
        if (low === 0 && high === 0) {
          return sign * Number.POSITIVE_INFINITY;
        }
        return Number.NaN;
      }
      exponent -= 0x3FFF;
      let out = low * 2 ** (exponent - 31);
      out += high * 2 ** (exponent - 63);
      return sign * out;
    }
    reset() {
      this.localOffset = 0;
      this.offset = 0;
    }
    decodeString(offset, length, encoding, advance) {
      encoding = encoding.toLowerCase();
      const nullEnd = length === null ? 0 : -1;
      if (!length) {
        length = this.remainingBytes();
      }
      const end = offset + length;
      let result = '';
      switch (encoding) {
        case 'ascii':
        case 'latin1':
          {
            while (offset < end) {
              const char = this.peekUInt8(offset++);
              if (char === nullEnd) {
                break;
              }
              result += String.fromCharCode(char);
            }
            break;
          }
        case 'utf8':
        case 'utf-8':
          {
            while (offset < end) {
              const b1 = this.peekUInt8(offset++);
              if (b1 === nullEnd) {
                break;
              }
              let b2;
              let b3;
              if ((b1 & 0x80) === 0) {
                result += String.fromCharCode(b1);
              } else if ((b1 & 0xE0) === 0xC0) {
                b2 = this.peekUInt8(offset++) & 0x3F;
                result += String.fromCharCode((b1 & 0x1F) << 6 | b2);
              } else if ((b1 & 0xF0) === 0xE0) {
                b2 = this.peekUInt8(offset++) & 0x3F;
                b3 = this.peekUInt8(offset++) & 0x3F;
                result += String.fromCharCode((b1 & 0x0F) << 12 | b2 << 6 | b3);
              } else if ((b1 & 0xF8) === 0xF0) {
                b2 = this.peekUInt8(offset++) & 0x3F;
                b3 = this.peekUInt8(offset++) & 0x3F;
                const b4 = this.peekUInt8(offset++) & 0x3F;
                const pt = ((b1 & 0x0F) << 18 | b2 << 12 | b3 << 6 | b4) - 0x10000;
                result += String.fromCharCode(0xD800 + (pt >> 10), 0xDC00 + (pt & 0x3FF));
              }
            }
            break;
          }
        case 'utf16-be':
        case 'utf16be':
        case 'utf16le':
        case 'utf16-le':
        case 'utf16bom':
        case 'utf16-bom':
          {
            let littleEndian;
            switch (encoding) {
              case 'utf16be':
              case 'utf16-be':
                {
                  littleEndian = false;
                  break;
                }
              case 'utf16le':
              case 'utf16-le':
                {
                  littleEndian = true;
                  break;
                }
              case 'utf16bom':
              case 'utf16-bom':
              default:
                {
                  const bom = this.peekUInt16(offset);
                  if (length < 2 || bom === nullEnd) {
                    if (advance) {
                      this.advance(offset += 2);
                    }
                    return result;
                  }
                  littleEndian = bom === 0xFFFE;
                  offset += 2;
                  break;
                }
            }
            let w1;
            while (offset < end && (w1 = this.peekUInt16(offset, littleEndian)) !== nullEnd) {
              offset += 2;
              if (w1 < 0xD800 || w1 > 0xDFFF) {
                result += String.fromCharCode(w1);
              } else {
                const w2 = this.peekUInt16(offset, littleEndian);
                if (w2 < 0xDC00 || w2 > 0xDFFF) {
                  throw new Error('Invalid utf16 sequence.');
                }
                result += String.fromCharCode(w1, w2);
                offset += 2;
              }
            }
            if (w1 === nullEnd) {
              offset += 2;
            }
            break;
          }
        default:
          {
            throw new Error(`Unknown encoding: ${encoding}`);
          }
      }
      if (advance) {
        this.advance(length);
      }
      return result;
    }
  }
  var dataStream = DataStream$1;

  let debug = () => {};
  const pako = inflate$3;
  const DataBuffer = dataBuffer;
  const DataBufferList = dataBufferList;
  const DataStream = dataStream;
  class ImagePNG extends DataStream {
    constructor(list, overrides = {}) {
      const options = {
        size: 16,
        ...overrides
      };
      super(list, options);
      this.width = 0;
      this.height = 0;
      this.bitDepth = 0;
      this.colorType = 0;
      this.compressionMethod = 0;
      this.filterMethod = 0;
      this.interlaceMethod = 0;
      this.colors = 0;
      this.alpha = false;
      this.palette = [];
      this.pixels = undefined;
      this.transparency = undefined;
      this.physical = {
        width: 0,
        height: 0,
        unit: 0
      };
      this.dataChunks = [];
      this.parse();
    }
    static fromFile(data) {
      debug('fromFile:', data.length, data.byteLength);
      const buffer = new DataBuffer(data);
      const list = new DataBufferList();
      list.append(buffer);
      return new ImagePNG(list, {
        size: buffer.length
      });
    }
    static fromBuffer(buffer) {
      debug('fromBuffer:', buffer.length);
      const list = new DataBufferList();
      list.append(buffer);
      return new ImagePNG(list, {
        size: buffer.length
      });
    }
    setBitDepth(bitDepth) {
      if (![1, 2, 4, 8, 16].includes(bitDepth)) {
        throw new Error(`Invalid Bit Depth: ${bitDepth}, can be one of: 1, 2, 4, 8, 16`);
      }
      this.bitDepth = bitDepth;
    }
    setColorType(colorType) {
      let colors = 0;
      let alpha = false;
      switch (colorType) {
        case 0:
          colors = 1;
          break;
        case 2:
          colors = 3;
          break;
        case 3:
          colors = 1;
          break;
        case 4:
          colors = 2;
          alpha = true;
          break;
        case 6:
          colors = 4;
          alpha = true;
          break;
        default:
          throw new Error(`Invalid Color Type: ${colorType}, can be one of: 0, 2, 3, 4, 6`);
      }
      this.colors = colors;
      this.alpha = alpha;
      this.colorType = colorType;
    }
    setCompressionMethod(compressionMethod) {
      if (compressionMethod !== 0) {
        throw new Error(`Unsupported Compression Method: ${compressionMethod}, should be 0`);
      }
      this.compressionMethod = compressionMethod;
    }
    setFilterMethod(filterMethod) {
      if (filterMethod !== 0) {
        throw new Error(`Unsupported Filter Method: ${filterMethod}, should be 0`);
      }
      this.filterMethod = filterMethod;
    }
    setInterlaceMethod(interlaceMethod) {
      if (interlaceMethod !== 0 && interlaceMethod !== 1) {
        throw new Error(`Unsupported Interlace Method: ${interlaceMethod}`);
      }
      this.interlaceMethod = interlaceMethod;
    }
    setPalette(palette) {
      if (!Array.isArray(palette) && !ArrayBuffer.isView(palette)) {
        return;
      }
      if (palette.length === 0) {
        throw new Error('Palette contains no colors');
      }
      if (palette.length > 2 ** this.bitDepth * 3) {
        throw new Error(`Palette contains more colors than ${2 ** this.bitDepth * 3} ((2 ^ ${this.bitDepth}) * 3)`);
      }
      this.palette = palette;
    }
    getPixel(x, y) {
      if (!this.pixels) {
        throw new Error('Pixel data has not been decoded.');
      }
      if (!Number.isInteger(x) || x >= this.width || x < 0) {
        throw new Error(`x position out of bounds or invalid: ${x}`);
      }
      if (!Number.isInteger(y) || y >= this.height || y < 0) {
        throw new Error(`y position out of bounds or invalid: ${y}`);
      }
      debug('getPixel x:', x, 'y:', y, 'colorType:', this.colorType, 'colors:', this.colors, 'bitDepth:', this.bitDepth);
      const i = this.colors * this.bitDepth / 8 * (y * this.width + x);
      switch (this.colorType) {
        case 0:
          {
            return [this.pixels[i], this.pixels[i], this.pixels[i], 255];
          }
        case 2:
          {
            return [this.pixels[i], this.pixels[i + 1], this.pixels[i + 2], 255];
          }
        case 3:
          {
            let alpha = 255;
            if (this.transparency != null && this.transparency[this.pixels[i]] != null) {
              alpha = this.transparency[this.pixels[i]];
            }
            return [this.palette[this.pixels[i] * 3 + 0], this.palette[this.pixels[i] * 3 + 1], this.palette[this.pixels[i] * 3 + 2], alpha];
          }
        case 4:
          {
            if (this.bitDepth === 8) {
              return [this.pixels[i], this.pixels[i], this.pixels[i], this.pixels[i + 1]];
            }
            return [this.pixels[i + 1], this.pixels[i + 1], this.pixels[i + 1], this.pixels[i + 3]];
          }
        case 6:
          {
            if (this.bitDepth === 8) {
              return [this.pixels[i], this.pixels[i + 1], this.pixels[i + 2], this.pixels[i + 3]];
            }
            return [this.pixels[i + 1], this.pixels[i + 3], this.pixels[i + 5], this.pixels[i + 7]];
          }
        default:
          {
            throw new Error(`Unknown Color Type: ${this.colorType}`);
          }
      }
    }
    parse() {
      this.decodeHeader();
      while (this.remainingBytes()) {
        const type = this.decodeChunk();
        if (type === 'IEND') {
          this.remainingBytes();
          break;
        }
      }
    }
    decodeHeader() {
      debug('decodeHeader: offset =', this.offset);
      if (this.offset !== 0) ;
      const header = this.read(8, this.nativeEndian);
      const header_buffer = new DataBuffer(header);
      if (!header_buffer.compare([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
        throw new Error('Missing or invalid PNG header.');
      }
      this.header = header;
    }
    decodeChunk() {
      const length = this.readUInt32();
      if (length < 0) {
        throw new Error(`Invalid Chunk Length: ${0xFFFFFFFF & length}`);
      }
      const type = this.readString(4);
      const chunk = this.read(length, this.nativeEndian);
      const crc = this.readUInt32();
      debug('decodeChunk type', type, 'chunk size', length, 'crc', crc.toString(16).toUpperCase());
      switch (type) {
        case 'IHDR':
          this.decodeIHDR(chunk);
          break;
        case 'PLTE':
          this.decodePLTE(chunk);
          break;
        case 'IDAT':
          this.decodeIDAT(chunk);
          break;
        case 'IEND':
          this.decodeIEND(chunk);
          break;
        case 'tRNS':
          this.decodeTRNS(chunk);
          break;
        case 'pHYs':
          this.decodePHYS(chunk);
          break;
      }
      return type;
    }
    decodeIHDR(chunk) {
      const header = DataStream.fromData(chunk);
      const width = header.readUInt32();
      const height = header.readUInt32();
      const bit_depth = header.readUInt8();
      const color_type = header.readUInt8();
      const compression_method = header.readUInt8();
      const filter_method = header.readUInt8();
      const interlace_method = header.readUInt8();
      this.width = width;
      this.height = height;
      this.setBitDepth(bit_depth);
      this.setColorType(color_type);
      this.setCompressionMethod(compression_method);
      this.setFilterMethod(filter_method);
      this.setInterlaceMethod(interlace_method);
      debug('decodeIHDR =', JSON.stringify({
        width,
        height,
        bit_depth,
        color_type,
        compression_method,
        filter_method,
        interlace_method
      }));
    }
    decodePLTE(chunk) {
      this.setPalette(chunk);
    }
    decodeIDAT(chunk) {
      debug('decodeIDAT:', chunk.length);
      this.dataChunks.push(chunk);
    }
    decodeTRNS(chunk) {
      this.transparency = chunk;
    }
    decodePHYS(chunk) {
      const INCH_TO_METERS = 0.0254;
      const buffer = DataStream.fromData(chunk);
      let width = buffer.readUInt32();
      let height = buffer.readUInt32();
      const unit = buffer.readUInt8();
      switch (unit) {
        case 1:
          {
            width = Math.floor(width * INCH_TO_METERS);
            height = Math.floor(height * INCH_TO_METERS);
            break;
          }
      }
      this.physical = {
        width,
        height,
        unit
      };
    }
    decodeIEND(_chunk) {
    }
    decodePixels() {
      if (this.dataChunks.length === 0) {
        throw new Error('No IDAT chunks to decode.');
      }
      const length = this.dataChunks.reduce((accumulator, chunk) => accumulator + chunk.length, 0);
      const data = new Uint8Array(length);
      for (let i = 0, k = 0, l = this.dataChunks.length; i < l; i++) {
        const chunk = this.dataChunks[i];
        for (let j = 0; j < chunk.length; j++) {
          data[k++] = chunk[j];
        }
      }
      let out;
      try {
        out = pako.inflate(data);
      } catch (err) {
        throw err;
      }
      debug('Inflated Size:', out.length);
      try {
        if (this.interlaceMethod === 0) {
          this.interlaceNone(out);
        } else {
          throw new Error('Adam7 interlaced format is unsupported.');
        }
      } catch (e) {
        throw e;
      }
    }
    interlaceNone(data) {
      const bytes_per_pixel = Math.max(1, this.colors * this.bitDepth / 8);
      const color_bytes_per_row = bytes_per_pixel * this.width;
      this.pixels = new Uint8Array(bytes_per_pixel * this.width * this.height);
      const chunk = DataStream.fromData(data);
      debug('interlaceNone: bytes:', chunk.remainingBytes());
      let offset = 0;
      while (chunk.remainingBytes() > 0) {
        const type = chunk.readUInt8();
        const scanline = chunk.remainingBytes() < color_bytes_per_row ? chunk.read(chunk.remainingBytes(), this.nativeEndian) : chunk.read(color_bytes_per_row, this.nativeEndian);
        switch (type) {
          case 0:
            {
              this.unFilterNone(scanline, bytes_per_pixel, offset, color_bytes_per_row);
              break;
            }
          case 1:
            {
              this.unFilterSub(scanline, bytes_per_pixel, offset, color_bytes_per_row);
              break;
            }
          case 2:
            {
              this.unFilterUp(scanline, bytes_per_pixel, offset, color_bytes_per_row);
              break;
            }
          case 3:
            {
              this.unFilterAverage(scanline, bytes_per_pixel, offset, color_bytes_per_row);
              break;
            }
          case 4:
            {
              this.unFilterPaeth(scanline, bytes_per_pixel, offset, color_bytes_per_row);
              break;
            }
        }
        offset += chunk.offset;
      }
    }
    unFilterNone(scanline, bpp, offset, length) {
      for (let i = 0, to = length; i < to; i++) {
        this.pixels[offset + i] = scanline[i];
      }
    }
    unFilterSub(scanline, bpp, offset, length) {
      let i = 0;
      for (; i < bpp; i++) {
        this.pixels[offset + i] = scanline[i];
      }
      for (; i < length; i++) {
        this.pixels[offset + i] = scanline[i] + this.pixels[offset + i - bpp] & 0xFF;
      }
    }
    unFilterUp(scanline, _bpp, offset, length) {
      let i = 0;
      let byte;
      let prev;
      if (offset - length < 0) {
        for (; i < length; i++) {
          this.pixels[offset + i] = scanline[i];
        }
      } else {
        for (; i < length; i++) {
          byte = scanline[i];
          prev = this.pixels[offset + i - length];
          this.pixels[offset + i] = byte + prev & 0xFF;
        }
      }
    }
    unFilterAverage(scanline, bpp, offset, length) {
      let i = 0;
      let byte;
      let prev;
      let prior;
      if (offset - length < 0) {
        for (; i < bpp; i++) {
          this.pixels[offset + i] = scanline[i];
        }
        for (; i < length; i++) {
          this.pixels[offset + i] = scanline[i] + (this.pixels[offset + i - bpp] >> 1) & 0xFF;
        }
      } else {
        for (; i < bpp; i++) {
          this.pixels[offset + i] = scanline[i] + (this.pixels[offset - length + i] >> 1) & 0xFF;
        }
        for (; i < length; i++) {
          byte = scanline[i];
          prev = this.pixels[offset + i - bpp];
          prior = this.pixels[offset + i - length];
          this.pixels[offset + i] = byte + (prev + prior >> 1) & 0xFF;
        }
      }
    }
    unFilterPaeth(scanline, bpp, offset, length) {
      let i = 0;
      let raw;
      let a;
      let b;
      let c;
      let p;
      let pa;
      let pb;
      let pc;
      let pr;
      if (offset - length < 0) {
        for (; i < bpp; i++) {
          this.pixels[offset + i] = scanline[i];
        }
        for (; i < length; i++) {
          this.pixels[offset + i] = scanline[i] + this.pixels[offset + i - bpp] & 0xFF;
        }
      } else {
        for (; i < bpp; i++) {
          this.pixels[offset + i] = scanline[i] + this.pixels[offset + i - length] & 0xFF;
        }
        for (; i < length; i++) {
          raw = scanline[i];
          a = this.pixels[offset + i - bpp];
          b = this.pixels[offset + i - length];
          c = this.pixels[offset + i - length - bpp];
          p = a + b - c;
          pa = Math.abs(p - a);
          pb = Math.abs(p - b);
          pc = Math.abs(p - c);
          if (pa <= pb && pa <= pc) pr = a;else if (pb <= pc) pr = b;else pr = c;
          this.pixels[offset + i] = raw + pr & 0xFF;
        }
      }
    }
  }
  var dataImagePng = ImagePNG;

  return dataImagePng;

}());
//# sourceMappingURL=data-image-png.js.map
