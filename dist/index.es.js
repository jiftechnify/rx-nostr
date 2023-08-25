var Br = Object.defineProperty;
var Or = (t, e, n) => e in t ? Br(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var C = (t, e, n) => (Or(t, typeof e != "symbol" ? e + "" : e, n), n);
function ss() {
  return Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
}
function On(t) {
  return "length" in t ? t.map(sn) : [sn(t)];
}
function sn(t) {
  return {
    ...t,
    since: t.since ? cn(t.since) : void 0,
    until: t.until ? cn(t.until) : void 0
  };
}
function cn(t) {
  return typeof t == "number" ? t : t();
}
const pt = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ut = (t) => t instanceof Uint8Array, yt = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), J = (t, e) => t << 32 - e | t >>> e, _r = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!_r)
  throw new Error("Non little-endian hardware is not supported");
const Tr = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function it(t) {
  if (!Ut(t))
    throw new Error("Uint8Array expected");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Tr[t[n]];
  return e;
}
function $r(t) {
  if (typeof t != "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof t}`);
  return new Uint8Array(new TextEncoder().encode(t));
}
function Lt(t) {
  if (typeof t == "string" && (t = $r(t)), !Ut(t))
    throw new Error(`expected Uint8Array, got ${typeof t}`);
  return t;
}
function kr(...t) {
  const e = new Uint8Array(t.reduce((r, o) => r + o.length, 0));
  let n = 0;
  return t.forEach((r) => {
    if (!Ut(r))
      throw new Error("Uint8Array expected");
    e.set(r, n), n += r.length;
  }), e;
}
class _n {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Tn(t) {
  const e = (r) => t().update(Lt(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function $n(t = 32) {
  if (pt && typeof pt.getRandomValues == "function")
    return pt.getRandomValues(new Uint8Array(t));
  throw new Error("crypto.getRandomValues must be defined");
}
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Le(t) {
  if (!Number.isSafeInteger(t))
    throw new Error(`Wrong integer: ${t}`);
}
function ae(...t) {
  const e = (o, i) => (s) => o(i(s)), n = Array.from(t).reverse().reduce((o, i) => o ? e(o, i.encode) : i.encode, void 0), r = t.reduce((o, i) => o ? e(o, i.decode) : i.decode, void 0);
  return { encode: n, decode: r };
}
function ue(t) {
  return {
    encode: (e) => {
      if (!Array.isArray(e) || e.length && typeof e[0] != "number")
        throw new Error("alphabet.encode input should be an array of numbers");
      return e.map((n) => {
        if (Le(n), n < 0 || n >= t.length)
          throw new Error(`Digit index outside alphabet: ${n} (alphabet: ${t.length})`);
        return t[n];
      });
    },
    decode: (e) => {
      if (!Array.isArray(e) || e.length && typeof e[0] != "string")
        throw new Error("alphabet.decode input should be array of strings");
      return e.map((n) => {
        if (typeof n != "string")
          throw new Error(`alphabet.decode: not string element=${n}`);
        const r = t.indexOf(n);
        if (r === -1)
          throw new Error(`Unknown letter: "${n}". Allowed: ${t}`);
        return r;
      });
    }
  };
}
function fe(t = "") {
  if (typeof t != "string")
    throw new Error("join separator should be string");
  return {
    encode: (e) => {
      if (!Array.isArray(e) || e.length && typeof e[0] != "string")
        throw new Error("join.encode input should be array of strings");
      for (let n of e)
        if (typeof n != "string")
          throw new Error(`join.encode: non-string input=${n}`);
      return e.join(t);
    },
    decode: (e) => {
      if (typeof e != "string")
        throw new Error("join.decode input should be string");
      return e.split(t);
    }
  };
}
function st(t, e = "=") {
  if (Le(t), typeof e != "string")
    throw new Error("padding chr should be string");
  return {
    encode(n) {
      if (!Array.isArray(n) || n.length && typeof n[0] != "string")
        throw new Error("padding.encode input should be array of strings");
      for (let r of n)
        if (typeof r != "string")
          throw new Error(`padding.encode: non-string input=${r}`);
      for (; n.length * t % 8; )
        n.push(e);
      return n;
    },
    decode(n) {
      if (!Array.isArray(n) || n.length && typeof n[0] != "string")
        throw new Error("padding.encode input should be array of strings");
      for (let o of n)
        if (typeof o != "string")
          throw new Error(`padding.decode: non-string input=${o}`);
      let r = n.length;
      if (r * t % 8)
        throw new Error("Invalid padding: string should have whole number of bytes");
      for (; r > 0 && n[r - 1] === e; r--)
        if (!((r - 1) * t % 8))
          throw new Error("Invalid padding: string has too much padding");
      return n.slice(0, r);
    }
  };
}
function kn(t) {
  if (typeof t != "function")
    throw new Error("normalize fn should be function");
  return { encode: (e) => e, decode: (e) => t(e) };
}
function an(t, e, n) {
  if (e < 2)
    throw new Error(`convertRadix: wrong from=${e}, base cannot be less than 2`);
  if (n < 2)
    throw new Error(`convertRadix: wrong to=${n}, base cannot be less than 2`);
  if (!Array.isArray(t))
    throw new Error("convertRadix: data should be array");
  if (!t.length)
    return [];
  let r = 0;
  const o = [], i = Array.from(t);
  for (i.forEach((s) => {
    if (Le(s), s < 0 || s >= e)
      throw new Error(`Wrong integer: ${s}`);
  }); ; ) {
    let s = 0, c = !0;
    for (let a = r; a < i.length; a++) {
      const u = i[a], f = e * s + u;
      if (!Number.isSafeInteger(f) || e * s / e !== s || f - u !== e * s)
        throw new Error("convertRadix: carry overflow");
      if (s = f % n, i[a] = Math.floor(f / n), !Number.isSafeInteger(i[a]) || i[a] * n + s !== f)
        throw new Error("convertRadix: carry overflow");
      if (c)
        i[a] ? c = !1 : r = a;
      else
        continue;
    }
    if (o.push(s), c)
      break;
  }
  for (let s = 0; s < t.length - 1 && t[s] === 0; s++)
    o.push(0);
  return o.reverse();
}
const qn = (t, e) => e ? qn(e, t % e) : t, Ge = (t, e) => t + (e - qn(t, e));
function It(t, e, n, r) {
  if (!Array.isArray(t))
    throw new Error("convertRadix2: data should be array");
  if (e <= 0 || e > 32)
    throw new Error(`convertRadix2: wrong from=${e}`);
  if (n <= 0 || n > 32)
    throw new Error(`convertRadix2: wrong to=${n}`);
  if (Ge(e, n) > 32)
    throw new Error(`convertRadix2: carry overflow from=${e} to=${n} carryBits=${Ge(e, n)}`);
  let o = 0, i = 0;
  const s = 2 ** n - 1, c = [];
  for (const a of t) {
    if (Le(a), a >= 2 ** e)
      throw new Error(`convertRadix2: invalid data word=${a} from=${e}`);
    if (o = o << e | a, i + e > 32)
      throw new Error(`convertRadix2: carry overflow pos=${i} from=${e}`);
    for (i += e; i >= n; i -= n)
      c.push((o >> i - n & s) >>> 0);
    o &= 2 ** i - 1;
  }
  if (o = o << n - i & s, !r && i >= e)
    throw new Error("Excess padding");
  if (!r && o)
    throw new Error(`Non-zero padding: ${o}`);
  return r && i > 0 && c.push(o >>> 0), c;
}
function qr(t) {
  return Le(t), {
    encode: (e) => {
      if (!(e instanceof Uint8Array))
        throw new Error("radix.encode input should be Uint8Array");
      return an(Array.from(e), 2 ** 8, t);
    },
    decode: (e) => {
      if (!Array.isArray(e) || e.length && typeof e[0] != "number")
        throw new Error("radix.decode input should be array of strings");
      return Uint8Array.from(an(e, t, 2 ** 8));
    }
  };
}
function me(t, e = !1) {
  if (Le(t), t <= 0 || t > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (Ge(8, t) > 32 || Ge(t, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (n) => {
      if (!(n instanceof Uint8Array))
        throw new Error("radix2.encode input should be Uint8Array");
      return It(Array.from(n), 8, t, !e);
    },
    decode: (n) => {
      if (!Array.isArray(n) || n.length && typeof n[0] != "number")
        throw new Error("radix2.decode input should be array of strings");
      return Uint8Array.from(It(n, t, 8, e));
    }
  };
}
function un(t) {
  if (typeof t != "function")
    throw new Error("unsafeWrapper fn should be function");
  return function(...e) {
    try {
      return t.apply(null, e);
    } catch {
    }
  };
}
const Cr = ae(me(4), ue("0123456789ABCDEF"), fe("")), Pr = ae(me(5), ue("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), st(5), fe(""));
ae(me(5), ue("0123456789ABCDEFGHIJKLMNOPQRSTUV"), st(5), fe(""));
ae(me(5), ue("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), fe(""), kn((t) => t.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
const Nr = ae(me(6), ue("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), st(6), fe("")), Ur = ae(me(6), ue("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), st(6), fe("")), Ht = (t) => ae(qr(58), ue(t), fe("")), Rt = Ht("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
Ht("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ");
Ht("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
const fn = [0, 2, 3, 5, 6, 7, 9, 10, 11], Lr = {
  encode(t) {
    let e = "";
    for (let n = 0; n < t.length; n += 8) {
      const r = t.subarray(n, n + 8);
      e += Rt.encode(r).padStart(fn[r.length], "1");
    }
    return e;
  },
  decode(t) {
    let e = [];
    for (let n = 0; n < t.length; n += 11) {
      const r = t.slice(n, n + 11), o = fn.indexOf(r.length), i = Rt.decode(r);
      for (let s = 0; s < i.length - o; s++)
        if (i[s] !== 0)
          throw new Error("base58xmr: wrong padding");
      e = e.concat(Array.from(i.slice(i.length - o)));
    }
    return Uint8Array.from(e);
  }
}, Bt = ae(ue("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), fe("")), ln = [996825010, 642813549, 513874426, 1027748829, 705979059];
function je(t) {
  const e = t >> 25;
  let n = (t & 33554431) << 5;
  for (let r = 0; r < ln.length; r++)
    (e >> r & 1) === 1 && (n ^= ln[r]);
  return n;
}
function hn(t, e, n = 1) {
  const r = t.length;
  let o = 1;
  for (let i = 0; i < r; i++) {
    const s = t.charCodeAt(i);
    if (s < 33 || s > 126)
      throw new Error(`Invalid prefix (${t})`);
    o = je(o) ^ s >> 5;
  }
  o = je(o);
  for (let i = 0; i < r; i++)
    o = je(o) ^ t.charCodeAt(i) & 31;
  for (let i of e)
    o = je(o) ^ i;
  for (let i = 0; i < 6; i++)
    o = je(o);
  return o ^= n, Bt.encode(It([o % 2 ** 30], 30, 5, !1));
}
function Cn(t) {
  const e = t === "bech32" ? 1 : 734539939, n = me(5), r = n.decode, o = n.encode, i = un(r);
  function s(f, l, p = 90) {
    if (typeof f != "string")
      throw new Error(`bech32.encode prefix should be string, not ${typeof f}`);
    if (!Array.isArray(l) || l.length && typeof l[0] != "number")
      throw new Error(`bech32.encode words should be array of numbers, not ${typeof l}`);
    const w = f.length + 7 + l.length;
    if (p !== !1 && w > p)
      throw new TypeError(`Length ${w} exceeds limit ${p}`);
    return f = f.toLowerCase(), `${f}1${Bt.encode(l)}${hn(f, l, e)}`;
  }
  function c(f, l = 90) {
    if (typeof f != "string")
      throw new Error(`bech32.decode input should be string, not ${typeof f}`);
    if (f.length < 8 || l !== !1 && f.length > l)
      throw new TypeError(`Wrong string length: ${f.length} (${f}). Expected (8..${l})`);
    const p = f.toLowerCase();
    if (f !== p && f !== f.toUpperCase())
      throw new Error("String must be lowercase or uppercase");
    f = p;
    const w = f.lastIndexOf("1");
    if (w === 0 || w === -1)
      throw new Error('Letter "1" must be present between prefix and data only');
    const d = f.slice(0, w), h = f.slice(w + 1);
    if (h.length < 6)
      throw new Error("Data must be at least 6 characters long");
    const y = Bt.decode(h).slice(0, -6), g = hn(d, y, e);
    if (!h.endsWith(g))
      throw new Error(`Invalid checksum in ${f}: expected "${g}"`);
    return { prefix: d, words: y };
  }
  const a = un(c);
  function u(f) {
    const { prefix: l, words: p } = c(f, !1);
    return { prefix: l, words: p, bytes: r(p) };
  }
  return { encode: s, decode: c, decodeToBytes: u, decodeUnsafe: a, fromWords: r, fromWordsUnsafe: i, toWords: o };
}
const dn = Cn("bech32");
Cn("bech32m");
const Hr = {
  encode: (t) => new TextDecoder().decode(t),
  decode: (t) => new TextEncoder().encode(t)
}, jr = ae(me(4), ue("0123456789abcdef"), fe(""), kn((t) => {
  if (typeof t != "string" || t.length % 2)
    throw new TypeError(`hex.decode: expected string, got ${typeof t} with length ${t.length}`);
  return t.toLowerCase();
})), zr = {
  utf8: Hr,
  hex: jr,
  base16: Cr,
  base32: Pr,
  base64: Nr,
  base64url: Ur,
  base58: Rt,
  base58xmr: Lr
};
`${Object.keys(zr).join(", ")}`;
function gt(t) {
  const { words: e } = dn.decode(t), n = new Uint8Array(dn.fromWords(e));
  return it(n);
}
function Ot(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Wr(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Pn(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Dr(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ot(t.outputLen), Ot(t.blockLen);
}
function Vr(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Fr(t, e) {
  Pn(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Se = {
  number: Ot,
  bool: Wr,
  bytes: Pn,
  hash: Dr,
  exists: Vr,
  output: Fr
};
function Mr(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const o = BigInt(32), i = BigInt(4294967295), s = Number(n >> o & i), c = Number(n & i), a = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + a, s, r), t.setUint32(e + u, c, r);
}
class Yr extends _n {
  constructor(e, n, r, o) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = yt(this.buffer);
  }
  update(e) {
    Se.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    e = Lt(e);
    const i = e.length;
    for (let s = 0; s < i; ) {
      const c = Math.min(o - this.pos, i - s);
      if (c === o) {
        const a = yt(e);
        for (; o <= i - s; s += o)
          this.process(a, s);
        continue;
      }
      r.set(e.subarray(s, s + c), this.pos), this.pos += c, s += c, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Se.exists(this), Se.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: i } = this;
    let { pos: s } = this;
    n[s++] = 128, this.buffer.subarray(s).fill(0), this.padOffset > o - s && (this.process(r, 0), s = 0);
    for (let l = s; l < o; l++)
      n[l] = 0;
    Mr(r, o - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const c = yt(e), a = this.outputLen;
    if (a % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = a / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      c.setUint32(4 * l, f[l], i);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: i, destroyed: s, pos: c } = this;
    return e.length = o, e.pos = c, e.finished = i, e.destroyed = s, o % n && e.buffer.set(r), e;
  }
}
const Kr = (t, e, n) => t & e ^ ~t & n, Zr = (t, e, n) => t & e ^ t & n ^ e & n, Gr = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), ye = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ge = new Uint32Array(64);
class Nn extends Yr {
  constructor() {
    super(64, 32, 8, !1), this.A = ye[0] | 0, this.B = ye[1] | 0, this.C = ye[2] | 0, this.D = ye[3] | 0, this.E = ye[4] | 0, this.F = ye[5] | 0, this.G = ye[6] | 0, this.H = ye[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: o, E: i, F: s, G: c, H: a } = this;
    return [e, n, r, o, i, s, c, a];
  }
  // prettier-ignore
  set(e, n, r, o, i, s, c, a) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = i | 0, this.F = s | 0, this.G = c | 0, this.H = a | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      ge[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const p = ge[l - 15], w = ge[l - 2], d = J(p, 7) ^ J(p, 18) ^ p >>> 3, h = J(w, 17) ^ J(w, 19) ^ w >>> 10;
      ge[l] = h + ge[l - 7] + d + ge[l - 16] | 0;
    }
    let { A: r, B: o, C: i, D: s, E: c, F: a, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const p = J(c, 6) ^ J(c, 11) ^ J(c, 25), w = f + p + Kr(c, a, u) + Gr[l] + ge[l] | 0, h = (J(r, 2) ^ J(r, 13) ^ J(r, 22)) + Zr(r, o, i) | 0;
      f = u, u = a, a = c, c = s + w | 0, s = i, i = o, o = r, r = w + h | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, i = i + this.C | 0, s = s + this.D | 0, c = c + this.E | 0, a = a + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, o, i, s, c, a, u, f);
  }
  roundClean() {
    ge.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Qr extends Nn {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Qe = Tn(() => new Nn());
Tn(() => new Qr());
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Un = BigInt(0), ct = BigInt(1), Xr = BigInt(2), at = (t) => t instanceof Uint8Array, Jr = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function qe(t) {
  if (!at(t))
    throw new Error("Uint8Array expected");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Jr[t[n]];
  return e;
}
function Ln(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function jt(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  return BigInt(t === "" ? "0" : `0x${t}`);
}
function Ce(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  const e = t.length;
  if (e % 2)
    throw new Error("padded hex string expected, got unpadded hex of length " + e);
  const n = new Uint8Array(e / 2);
  for (let r = 0; r < n.length; r++) {
    const o = r * 2, i = t.slice(o, o + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    n[r] = s;
  }
  return n;
}
function D(t) {
  return jt(qe(t));
}
function zt(t) {
  if (!at(t))
    throw new Error("Uint8Array expected");
  return jt(qe(Uint8Array.from(t).reverse()));
}
function we(t, e) {
  return Ce(t.toString(16).padStart(e * 2, "0"));
}
function Hn(t, e) {
  return we(t, e).reverse();
}
function eo(t) {
  return Ce(Ln(t));
}
function z(t, e, n) {
  let r;
  if (typeof e == "string")
    try {
      r = Ce(e);
    } catch (i) {
      throw new Error(`${t} must be valid hex string, got "${e}". Cause: ${i}`);
    }
  else if (at(e))
    r = Uint8Array.from(e);
  else
    throw new Error(`${t} must be hex string or Uint8Array`);
  const o = r.length;
  if (typeof n == "number" && o !== n)
    throw new Error(`${t} expected ${n} bytes, got ${o}`);
  return r;
}
function Re(...t) {
  const e = new Uint8Array(t.reduce((r, o) => r + o.length, 0));
  let n = 0;
  return t.forEach((r) => {
    if (!at(r))
      throw new Error("Uint8Array expected");
    e.set(r, n), n += r.length;
  }), e;
}
function to(t, e) {
  if (t.length !== e.length)
    return !1;
  for (let n = 0; n < t.length; n++)
    if (t[n] !== e[n])
      return !1;
  return !0;
}
function no(t) {
  if (typeof t != "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof t}`);
  return new Uint8Array(new TextEncoder().encode(t));
}
function ro(t) {
  let e;
  for (e = 0; t > Un; t >>= ct, e += 1)
    ;
  return e;
}
function oo(t, e) {
  return t >> BigInt(e) & ct;
}
const io = (t, e, n) => t | (n ? ct : Un) << BigInt(e), Wt = (t) => (Xr << BigInt(t - 1)) - ct, wt = (t) => new Uint8Array(t), pn = (t) => Uint8Array.from(t);
function jn(t, e, n) {
  if (typeof t != "number" || t < 2)
    throw new Error("hashLen must be a number");
  if (typeof e != "number" || e < 2)
    throw new Error("qByteLen must be a number");
  if (typeof n != "function")
    throw new Error("hmacFn must be a function");
  let r = wt(t), o = wt(t), i = 0;
  const s = () => {
    r.fill(1), o.fill(0), i = 0;
  }, c = (...l) => n(o, r, ...l), a = (l = wt()) => {
    o = c(pn([0]), l), r = c(), l.length !== 0 && (o = c(pn([1]), l), r = c());
  }, u = () => {
    if (i++ >= 1e3)
      throw new Error("drbg: tried 1000 values");
    let l = 0;
    const p = [];
    for (; l < e; ) {
      r = c();
      const w = r.slice();
      p.push(w), l += r.length;
    }
    return Re(...p);
  };
  return (l, p) => {
    s(), a(l);
    let w;
    for (; !(w = p(u())); )
      a();
    return s(), w;
  };
}
const so = {
  bigint: (t) => typeof t == "bigint",
  function: (t) => typeof t == "function",
  boolean: (t) => typeof t == "boolean",
  string: (t) => typeof t == "string",
  isSafeInteger: (t) => Number.isSafeInteger(t),
  array: (t) => Array.isArray(t),
  field: (t, e) => e.Fp.isValid(t),
  hash: (t) => typeof t == "function" && Number.isSafeInteger(t.outputLen)
};
function Ve(t, e, n = {}) {
  const r = (o, i, s) => {
    const c = so[i];
    if (typeof c != "function")
      throw new Error(`Invalid validator "${i}", expected function`);
    const a = t[o];
    if (!(s && a === void 0) && !c(a, t))
      throw new Error(`Invalid param ${String(o)}=${a} (${typeof a}), expected ${i}`);
  };
  for (const [o, i] of Object.entries(e))
    r(o, i, !1);
  for (const [o, i] of Object.entries(n))
    r(o, i, !0);
  return t;
}
const co = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bitGet: oo,
  bitLen: ro,
  bitMask: Wt,
  bitSet: io,
  bytesToHex: qe,
  bytesToNumberBE: D,
  bytesToNumberLE: zt,
  concatBytes: Re,
  createHmacDrbg: jn,
  ensureBytes: z,
  equalBytes: to,
  hexToBytes: Ce,
  hexToNumber: jt,
  numberToBytesBE: we,
  numberToBytesLE: Hn,
  numberToHexUnpadded: Ln,
  numberToVarBytesBE: eo,
  utf8ToBytes: no,
  validateObject: Ve
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const H = BigInt(0), k = BigInt(1), xe = BigInt(2), ao = BigInt(3), _t = BigInt(4), yn = BigInt(5), gn = BigInt(8);
BigInt(9);
BigInt(16);
function W(t, e) {
  const n = t % e;
  return n >= H ? n : e + n;
}
function uo(t, e, n) {
  if (n <= H || e < H)
    throw new Error("Expected power/modulo > 0");
  if (n === k)
    return H;
  let r = k;
  for (; e > H; )
    e & k && (r = r * t % n), t = t * t % n, e >>= k;
  return r;
}
function G(t, e, n) {
  let r = t;
  for (; e-- > H; )
    r *= r, r %= n;
  return r;
}
function Tt(t, e) {
  if (t === H || e <= H)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = W(t, e), r = e, o = H, i = k;
  for (; n !== H; ) {
    const c = r / n, a = r % n, u = o - i * c;
    r = n, n = a, o = i, i = u;
  }
  if (r !== k)
    throw new Error("invert: does not exist");
  return W(o, e);
}
function fo(t) {
  const e = (t - k) / xe;
  let n, r, o;
  for (n = t - k, r = 0; n % xe === H; n /= xe, r++)
    ;
  for (o = xe; o < t && uo(o, e, t) !== t - k; o++)
    ;
  if (r === 1) {
    const s = (t + k) / _t;
    return function(a, u) {
      const f = a.pow(u, s);
      if (!a.eql(a.sqr(f), u))
        throw new Error("Cannot find square root");
      return f;
    };
  }
  const i = (n + k) / xe;
  return function(c, a) {
    if (c.pow(a, e) === c.neg(c.ONE))
      throw new Error("Cannot find square root");
    let u = r, f = c.pow(c.mul(c.ONE, o), n), l = c.pow(a, i), p = c.pow(a, n);
    for (; !c.eql(p, c.ONE); ) {
      if (c.eql(p, c.ZERO))
        return c.ZERO;
      let w = 1;
      for (let h = c.sqr(p); w < u && !c.eql(h, c.ONE); w++)
        h = c.sqr(h);
      const d = c.pow(f, k << BigInt(u - w - 1));
      f = c.sqr(d), l = c.mul(l, d), p = c.mul(p, f), u = w;
    }
    return l;
  };
}
function lo(t) {
  if (t % _t === ao) {
    const e = (t + k) / _t;
    return function(r, o) {
      const i = r.pow(o, e);
      if (!r.eql(r.sqr(i), o))
        throw new Error("Cannot find square root");
      return i;
    };
  }
  if (t % gn === yn) {
    const e = (t - yn) / gn;
    return function(r, o) {
      const i = r.mul(o, xe), s = r.pow(i, e), c = r.mul(o, s), a = r.mul(r.mul(c, xe), s), u = r.mul(c, r.sub(a, r.ONE));
      if (!r.eql(r.sqr(u), o))
        throw new Error("Cannot find square root");
      return u;
    };
  }
  return fo(t);
}
const ho = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function po(t) {
  const e = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  }, n = ho.reduce((r, o) => (r[o] = "function", r), e);
  return Ve(t, n);
}
function yo(t, e, n) {
  if (n < H)
    throw new Error("Expected power > 0");
  if (n === H)
    return t.ONE;
  if (n === k)
    return e;
  let r = t.ONE, o = e;
  for (; n > H; )
    n & k && (r = t.mul(r, o)), o = t.sqr(o), n >>= k;
  return r;
}
function go(t, e) {
  const n = new Array(e.length), r = e.reduce((i, s, c) => t.is0(s) ? i : (n[c] = i, t.mul(i, s)), t.ONE), o = t.inv(r);
  return e.reduceRight((i, s, c) => t.is0(s) ? i : (n[c] = t.mul(i, n[c]), t.mul(i, s)), o), n;
}
function Dt(t, e) {
  const n = e !== void 0 ? e : t.toString(2).length, r = Math.ceil(n / 8);
  return { nBitLength: n, nByteLength: r };
}
function wo(t, e, n = !1, r = {}) {
  if (t <= H)
    throw new Error(`Expected Fp ORDER > 0, got ${t}`);
  const { nBitLength: o, nByteLength: i } = Dt(t, e);
  if (i > 2048)
    throw new Error("Field lengths over 2048 bytes are not supported");
  const s = lo(t), c = Object.freeze({
    ORDER: t,
    BITS: o,
    BYTES: i,
    MASK: Wt(o),
    ZERO: H,
    ONE: k,
    create: (a) => W(a, t),
    isValid: (a) => {
      if (typeof a != "bigint")
        throw new Error(`Invalid field element: expected bigint, got ${typeof a}`);
      return H <= a && a < t;
    },
    is0: (a) => a === H,
    isOdd: (a) => (a & k) === k,
    neg: (a) => W(-a, t),
    eql: (a, u) => a === u,
    sqr: (a) => W(a * a, t),
    add: (a, u) => W(a + u, t),
    sub: (a, u) => W(a - u, t),
    mul: (a, u) => W(a * u, t),
    pow: (a, u) => yo(c, a, u),
    div: (a, u) => W(a * Tt(u, t), t),
    // Same as above, but doesn't normalize
    sqrN: (a) => a * a,
    addN: (a, u) => a + u,
    subN: (a, u) => a - u,
    mulN: (a, u) => a * u,
    inv: (a) => Tt(a, t),
    sqrt: r.sqrt || ((a) => s(c, a)),
    invertBatch: (a) => go(c, a),
    // TODO: do we really need constant cmov?
    // We don't have const-time bigints anyway, so probably will be not very useful
    cmov: (a, u, f) => f ? u : a,
    toBytes: (a) => n ? Hn(a, i) : we(a, i),
    fromBytes: (a) => {
      if (a.length !== i)
        throw new Error(`Fp.fromBytes: expected ${i}, got ${a.length}`);
      return n ? zt(a) : D(a);
    }
  });
  return Object.freeze(c);
}
function bo(t, e, n = !1) {
  t = z("privateHash", t);
  const r = t.length, o = Dt(e).nByteLength + 8;
  if (o < 24 || r < o || r > 1024)
    throw new Error(`hashToPrivateScalar: expected ${o}-1024 bytes of input, got ${r}`);
  const i = n ? zt(t) : D(t);
  return W(i, e - k) + k;
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const vo = BigInt(0), bt = BigInt(1);
function mo(t, e) {
  const n = (o, i) => {
    const s = i.negate();
    return o ? s : i;
  }, r = (o) => {
    const i = Math.ceil(e / o) + 1, s = 2 ** (o - 1);
    return { windows: i, windowSize: s };
  };
  return {
    constTimeNegate: n,
    // non-const time multiplication ladder
    unsafeLadder(o, i) {
      let s = t.ZERO, c = o;
      for (; i > vo; )
        i & bt && (s = s.add(c)), c = c.double(), i >>= bt;
      return s;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(o, i) {
      const { windows: s, windowSize: c } = r(i), a = [];
      let u = o, f = u;
      for (let l = 0; l < s; l++) {
        f = u, a.push(f);
        for (let p = 1; p < c; p++)
          f = f.add(u), a.push(f);
        u = f.double();
      }
      return a;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(o, i, s) {
      const { windows: c, windowSize: a } = r(o);
      let u = t.ZERO, f = t.BASE;
      const l = BigInt(2 ** o - 1), p = 2 ** o, w = BigInt(o);
      for (let d = 0; d < c; d++) {
        const h = d * a;
        let y = Number(s & l);
        s >>= w, y > a && (y -= p, s += bt);
        const g = h, m = h + Math.abs(y) - 1, I = d % 2 !== 0, S = y < 0;
        y === 0 ? f = f.add(n(I, i[g])) : u = u.add(n(S, i[m]));
      }
      return { p: u, f };
    },
    wNAFCached(o, i, s, c) {
      const a = o._WINDOW_SIZE || 1;
      let u = i.get(o);
      return u || (u = this.precomputeWindow(o, a), a !== 1 && i.set(o, c(u))), this.wNAF(a, u, s);
    }
  };
}
function zn(t) {
  return po(t.Fp), Ve(t, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  }), Object.freeze({
    ...Dt(t.n, t.nBitLength),
    ...t,
    p: t.Fp.ORDER
  });
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Eo(t) {
  const e = zn(t);
  Ve(e, {
    a: "field",
    b: "field"
  }, {
    allowedPrivateKeyLengths: "array",
    wrapPrivateKey: "boolean",
    isTorsionFree: "function",
    clearCofactor: "function",
    allowInfinityPoint: "boolean",
    fromBytes: "function",
    toBytes: "function"
  });
  const { endo: n, Fp: r, a: o } = e;
  if (n) {
    if (!r.eql(o, r.ZERO))
      throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
    if (typeof n != "object" || typeof n.beta != "bigint" || typeof n.splitScalar != "function")
      throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
  }
  return Object.freeze({ ...e });
}
const { bytesToNumberBE: xo, hexToBytes: So } = co, Ae = {
  // asn.1 DER encoding utils
  Err: class extends Error {
    constructor(e = "") {
      super(e);
    }
  },
  _parseInt(t) {
    const { Err: e } = Ae;
    if (t.length < 2 || t[0] !== 2)
      throw new e("Invalid signature integer tag");
    const n = t[1], r = t.subarray(2, n + 2);
    if (!n || r.length !== n)
      throw new e("Invalid signature integer: wrong length");
    if (r[0] & 128)
      throw new e("Invalid signature integer: negative");
    if (r[0] === 0 && !(r[1] & 128))
      throw new e("Invalid signature integer: unnecessary leading zero");
    return { d: xo(r), l: t.subarray(n + 2) };
  },
  toSig(t) {
    const { Err: e } = Ae, n = typeof t == "string" ? So(t) : t;
    if (!(n instanceof Uint8Array))
      throw new Error("ui8a expected");
    let r = n.length;
    if (r < 2 || n[0] != 48)
      throw new e("Invalid signature tag");
    if (n[1] !== r - 2)
      throw new e("Invalid signature: incorrect length");
    const { d: o, l: i } = Ae._parseInt(n.subarray(2)), { d: s, l: c } = Ae._parseInt(i);
    if (c.length)
      throw new e("Invalid signature: left bytes after parsing");
    return { r: o, s };
  },
  hexFromSig(t) {
    const e = (u) => Number.parseInt(u[0], 16) & 8 ? "00" + u : u, n = (u) => {
      const f = u.toString(16);
      return f.length & 1 ? `0${f}` : f;
    }, r = e(n(t.s)), o = e(n(t.r)), i = r.length / 2, s = o.length / 2, c = n(i), a = n(s);
    return `30${n(s + i + 4)}02${a}${o}02${c}${r}`;
  }
}, oe = BigInt(0), Q = BigInt(1);
BigInt(2);
const wn = BigInt(3);
BigInt(4);
function Ao(t) {
  const e = Eo(t), { Fp: n } = e, r = e.toBytes || ((d, h, y) => {
    const g = h.toAffine();
    return Re(Uint8Array.from([4]), n.toBytes(g.x), n.toBytes(g.y));
  }), o = e.fromBytes || ((d) => {
    const h = d.subarray(1), y = n.fromBytes(h.subarray(0, n.BYTES)), g = n.fromBytes(h.subarray(n.BYTES, 2 * n.BYTES));
    return { x: y, y: g };
  });
  function i(d) {
    const { a: h, b: y } = e, g = n.sqr(d), m = n.mul(g, d);
    return n.add(n.add(m, n.mul(d, h)), y);
  }
  if (!n.eql(n.sqr(e.Gy), i(e.Gx)))
    throw new Error("bad generator point: equation left != right");
  function s(d) {
    return typeof d == "bigint" && oe < d && d < e.n;
  }
  function c(d) {
    if (!s(d))
      throw new Error("Expected valid bigint: 0 < bigint < curve.n");
  }
  function a(d) {
    const { allowedPrivateKeyLengths: h, nByteLength: y, wrapPrivateKey: g, n: m } = e;
    if (h && typeof d != "bigint") {
      if (d instanceof Uint8Array && (d = qe(d)), typeof d != "string" || !h.includes(d.length))
        throw new Error("Invalid key");
      d = d.padStart(y * 2, "0");
    }
    let I;
    try {
      I = typeof d == "bigint" ? d : D(z("private key", d, y));
    } catch {
      throw new Error(`private key must be ${y} bytes, hex or bigint, not ${typeof d}`);
    }
    return g && (I = W(I, m)), c(I), I;
  }
  const u = /* @__PURE__ */ new Map();
  function f(d) {
    if (!(d instanceof l))
      throw new Error("ProjectivePoint expected");
  }
  class l {
    constructor(h, y, g) {
      if (this.px = h, this.py = y, this.pz = g, h == null || !n.isValid(h))
        throw new Error("x required");
      if (y == null || !n.isValid(y))
        throw new Error("y required");
      if (g == null || !n.isValid(g))
        throw new Error("z required");
    }
    // Does not validate if the point is on-curve.
    // Use fromHex instead, or call assertValidity() later.
    static fromAffine(h) {
      const { x: y, y: g } = h || {};
      if (!h || !n.isValid(y) || !n.isValid(g))
        throw new Error("invalid affine point");
      if (h instanceof l)
        throw new Error("projective point not allowed");
      const m = (I) => n.eql(I, n.ZERO);
      return m(y) && m(g) ? l.ZERO : new l(y, g, n.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * Takes a bunch of Projective Points but executes only one
     * inversion on all of them. Inversion is very slow operation,
     * so this improves performance massively.
     * Optimization: converts a list of projective points to a list of identical points with Z=1.
     */
    static normalizeZ(h) {
      const y = n.invertBatch(h.map((g) => g.pz));
      return h.map((g, m) => g.toAffine(y[m])).map(l.fromAffine);
    }
    /**
     * Converts hash string or Uint8Array to Point.
     * @param hex short/long ECDSA hex
     */
    static fromHex(h) {
      const y = l.fromAffine(o(z("pointHex", h)));
      return y.assertValidity(), y;
    }
    // Multiplies generator point by privateKey.
    static fromPrivateKey(h) {
      return l.BASE.multiply(a(h));
    }
    // "Private method", don't use it directly
    _setWindowSize(h) {
      this._WINDOW_SIZE = h, u.delete(this);
    }
    // A point on curve is valid if it conforms to equation.
    assertValidity() {
      if (this.is0()) {
        if (e.allowInfinityPoint)
          return;
        throw new Error("bad point: ZERO");
      }
      const { x: h, y } = this.toAffine();
      if (!n.isValid(h) || !n.isValid(y))
        throw new Error("bad point: x or y not FE");
      const g = n.sqr(y), m = i(h);
      if (!n.eql(g, m))
        throw new Error("bad point: equation left != right");
      if (!this.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
    }
    hasEvenY() {
      const { y: h } = this.toAffine();
      if (n.isOdd)
        return !n.isOdd(h);
      throw new Error("Field doesn't support isOdd");
    }
    /**
     * Compare one point to another.
     */
    equals(h) {
      f(h);
      const { px: y, py: g, pz: m } = this, { px: I, py: S, pz: x } = h, v = n.eql(n.mul(y, x), n.mul(I, m)), A = n.eql(n.mul(g, x), n.mul(S, m));
      return v && A;
    }
    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     */
    negate() {
      return new l(this.px, n.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a: h, b: y } = e, g = n.mul(y, wn), { px: m, py: I, pz: S } = this;
      let x = n.ZERO, v = n.ZERO, A = n.ZERO, R = n.mul(m, m), q = n.mul(I, I), T = n.mul(S, S), O = n.mul(m, I);
      return O = n.add(O, O), A = n.mul(m, S), A = n.add(A, A), x = n.mul(h, A), v = n.mul(g, T), v = n.add(x, v), x = n.sub(q, v), v = n.add(q, v), v = n.mul(x, v), x = n.mul(O, x), A = n.mul(g, A), T = n.mul(h, T), O = n.sub(R, T), O = n.mul(h, O), O = n.add(O, A), A = n.add(R, R), R = n.add(A, R), R = n.add(R, T), R = n.mul(R, O), v = n.add(v, R), T = n.mul(I, S), T = n.add(T, T), R = n.mul(T, O), x = n.sub(x, R), A = n.mul(T, q), A = n.add(A, A), A = n.add(A, A), new l(x, v, A);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(h) {
      f(h);
      const { px: y, py: g, pz: m } = this, { px: I, py: S, pz: x } = h;
      let v = n.ZERO, A = n.ZERO, R = n.ZERO;
      const q = e.a, T = n.mul(e.b, wn);
      let O = n.mul(y, I), j = n.mul(g, S), F = n.mul(m, x), le = n.add(y, g), b = n.add(I, S);
      le = n.mul(le, b), b = n.add(O, j), le = n.sub(le, b), b = n.add(y, m);
      let E = n.add(I, x);
      return b = n.mul(b, E), E = n.add(O, F), b = n.sub(b, E), E = n.add(g, m), v = n.add(S, x), E = n.mul(E, v), v = n.add(j, F), E = n.sub(E, v), R = n.mul(q, b), v = n.mul(T, F), R = n.add(v, R), v = n.sub(j, R), R = n.add(j, R), A = n.mul(v, R), j = n.add(O, O), j = n.add(j, O), F = n.mul(q, F), b = n.mul(T, b), j = n.add(j, F), F = n.sub(O, F), F = n.mul(q, F), b = n.add(b, F), O = n.mul(j, b), A = n.add(A, O), O = n.mul(E, b), v = n.mul(le, v), v = n.sub(v, O), O = n.mul(le, j), R = n.mul(E, R), R = n.add(R, O), new l(v, A, R);
    }
    subtract(h) {
      return this.add(h.negate());
    }
    is0() {
      return this.equals(l.ZERO);
    }
    wNAF(h) {
      return w.wNAFCached(this, u, h, (y) => {
        const g = n.invertBatch(y.map((m) => m.pz));
        return y.map((m, I) => m.toAffine(g[I])).map(l.fromAffine);
      });
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(h) {
      const y = l.ZERO;
      if (h === oe)
        return y;
      if (c(h), h === Q)
        return this;
      const { endo: g } = e;
      if (!g)
        return w.unsafeLadder(this, h);
      let { k1neg: m, k1: I, k2neg: S, k2: x } = g.splitScalar(h), v = y, A = y, R = this;
      for (; I > oe || x > oe; )
        I & Q && (v = v.add(R)), x & Q && (A = A.add(R)), R = R.double(), I >>= Q, x >>= Q;
      return m && (v = v.negate()), S && (A = A.negate()), A = new l(n.mul(A.px, g.beta), A.py, A.pz), v.add(A);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(h) {
      c(h);
      let y = h, g, m;
      const { endo: I } = e;
      if (I) {
        const { k1neg: S, k1: x, k2neg: v, k2: A } = I.splitScalar(y);
        let { p: R, f: q } = this.wNAF(x), { p: T, f: O } = this.wNAF(A);
        R = w.constTimeNegate(S, R), T = w.constTimeNegate(v, T), T = new l(n.mul(T.px, I.beta), T.py, T.pz), g = R.add(T), m = q.add(O);
      } else {
        const { p: S, f: x } = this.wNAF(y);
        g = S, m = x;
      }
      return l.normalizeZ([g, m])[0];
    }
    /**
     * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
     * Not using Strauss-Shamir trick: precomputation tables are faster.
     * The trick could be useful if both P and Q are not G (not in our case).
     * @returns non-zero affine point
     */
    multiplyAndAddUnsafe(h, y, g) {
      const m = l.BASE, I = (x, v) => v === oe || v === Q || !x.equals(m) ? x.multiplyUnsafe(v) : x.multiply(v), S = I(this, y).add(I(h, g));
      return S.is0() ? void 0 : S;
    }
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    toAffine(h) {
      const { px: y, py: g, pz: m } = this, I = this.is0();
      h == null && (h = I ? n.ONE : n.inv(m));
      const S = n.mul(y, h), x = n.mul(g, h), v = n.mul(m, h);
      if (I)
        return { x: n.ZERO, y: n.ZERO };
      if (!n.eql(v, n.ONE))
        throw new Error("invZ was invalid");
      return { x: S, y: x };
    }
    isTorsionFree() {
      const { h, isTorsionFree: y } = e;
      if (h === Q)
        return !0;
      if (y)
        return y(l, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h, clearCofactor: y } = e;
      return h === Q ? this : y ? y(l, this) : this.multiplyUnsafe(e.h);
    }
    toRawBytes(h = !0) {
      return this.assertValidity(), r(l, this, h);
    }
    toHex(h = !0) {
      return qe(this.toRawBytes(h));
    }
  }
  l.BASE = new l(e.Gx, e.Gy, n.ONE), l.ZERO = new l(n.ZERO, n.ONE, n.ZERO);
  const p = e.nBitLength, w = mo(l, e.endo ? Math.ceil(p / 2) : p);
  return {
    CURVE: e,
    ProjectivePoint: l,
    normPrivateKeyToScalar: a,
    weierstrassEquation: i,
    isWithinCurveOrder: s
  };
}
function Io(t) {
  const e = zn(t);
  return Ve(e, {
    hash: "hash",
    hmac: "function",
    randomBytes: "function"
  }, {
    bits2int: "function",
    bits2int_modN: "function",
    lowS: "boolean"
  }), Object.freeze({ lowS: !0, ...e });
}
function Ro(t) {
  const e = Io(t), { Fp: n, n: r } = e, o = n.BYTES + 1, i = 2 * n.BYTES + 1;
  function s(b) {
    return oe < b && b < n.ORDER;
  }
  function c(b) {
    return W(b, r);
  }
  function a(b) {
    return Tt(b, r);
  }
  const { ProjectivePoint: u, normPrivateKeyToScalar: f, weierstrassEquation: l, isWithinCurveOrder: p } = Ao({
    ...e,
    toBytes(b, E, B) {
      const $ = E.toAffine(), _ = n.toBytes($.x), L = Re;
      return B ? L(Uint8Array.from([E.hasEvenY() ? 2 : 3]), _) : L(Uint8Array.from([4]), _, n.toBytes($.y));
    },
    fromBytes(b) {
      const E = b.length, B = b[0], $ = b.subarray(1);
      if (E === o && (B === 2 || B === 3)) {
        const _ = D($);
        if (!s(_))
          throw new Error("Point is not on curve");
        const L = l(_);
        let M = n.sqrt(L);
        const Y = (M & Q) === Q;
        return (B & 1) === 1 !== Y && (M = n.neg(M)), { x: _, y: M };
      } else if (E === i && B === 4) {
        const _ = n.fromBytes($.subarray(0, n.BYTES)), L = n.fromBytes($.subarray(n.BYTES, 2 * n.BYTES));
        return { x: _, y: L };
      } else
        throw new Error(`Point of length ${E} was invalid. Expected ${o} compressed bytes or ${i} uncompressed bytes`);
    }
  }), w = (b) => qe(we(b, e.nByteLength));
  function d(b) {
    const E = r >> Q;
    return b > E;
  }
  function h(b) {
    return d(b) ? c(-b) : b;
  }
  const y = (b, E, B) => D(b.slice(E, B));
  class g {
    constructor(E, B, $) {
      this.r = E, this.s = B, this.recovery = $, this.assertValidity();
    }
    // pair (bytes of r, bytes of s)
    static fromCompact(E) {
      const B = e.nByteLength;
      return E = z("compactSignature", E, B * 2), new g(y(E, 0, B), y(E, B, 2 * B));
    }
    // DER encoded ECDSA signature
    // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
    static fromDER(E) {
      const { r: B, s: $ } = Ae.toSig(z("DER", E));
      return new g(B, $);
    }
    assertValidity() {
      if (!p(this.r))
        throw new Error("r must be 0 < r < CURVE.n");
      if (!p(this.s))
        throw new Error("s must be 0 < s < CURVE.n");
    }
    addRecoveryBit(E) {
      return new g(this.r, this.s, E);
    }
    recoverPublicKey(E) {
      const { r: B, s: $, recovery: _ } = this, L = A(z("msgHash", E));
      if (_ == null || ![0, 1, 2, 3].includes(_))
        throw new Error("recovery id invalid");
      const M = _ === 2 || _ === 3 ? B + e.n : B;
      if (M >= n.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const Y = _ & 1 ? "03" : "02", he = u.fromHex(Y + w(M)), de = a(M), Be = c(-L * de), He = c($ * de), pe = u.BASE.multiplyAndAddUnsafe(he, Be, He);
      if (!pe)
        throw new Error("point at infinify");
      return pe.assertValidity(), pe;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return d(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new g(this.r, c(-this.s), this.recovery) : this;
    }
    // DER-encoded
    toDERRawBytes() {
      return Ce(this.toDERHex());
    }
    toDERHex() {
      return Ae.hexFromSig({ r: this.r, s: this.s });
    }
    // padded bytes of r, then padded bytes of s
    toCompactRawBytes() {
      return Ce(this.toCompactHex());
    }
    toCompactHex() {
      return w(this.r) + w(this.s);
    }
  }
  const m = {
    isValidPrivateKey(b) {
      try {
        return f(b), !0;
      } catch {
        return !1;
      }
    },
    normPrivateKeyToScalar: f,
    /**
     * Produces cryptographically secure private key from random of size (nBitLength+64)
     * as per FIPS 186 B.4.1 with modulo bias being neglible.
     */
    randomPrivateKey: () => {
      const b = e.randomBytes(n.BYTES + 8), E = bo(b, r);
      return we(E, e.nByteLength);
    },
    /**
     * Creates precompute table for an arbitrary EC point. Makes point "cached".
     * Allows to massively speed-up `point.multiply(scalar)`.
     * @returns cached point
     * @example
     * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
     * fast.multiply(privKey); // much faster ECDH now
     */
    precompute(b = 8, E = u.BASE) {
      return E._setWindowSize(b), E.multiply(BigInt(3)), E;
    }
  };
  function I(b, E = !0) {
    return u.fromPrivateKey(b).toRawBytes(E);
  }
  function S(b) {
    const E = b instanceof Uint8Array, B = typeof b == "string", $ = (E || B) && b.length;
    return E ? $ === o || $ === i : B ? $ === 2 * o || $ === 2 * i : b instanceof u;
  }
  function x(b, E, B = !0) {
    if (S(b))
      throw new Error("first arg must be private key");
    if (!S(E))
      throw new Error("second arg must be public key");
    return u.fromHex(E).multiply(f(b)).toRawBytes(B);
  }
  const v = e.bits2int || function(b) {
    const E = D(b), B = b.length * 8 - e.nBitLength;
    return B > 0 ? E >> BigInt(B) : E;
  }, A = e.bits2int_modN || function(b) {
    return c(v(b));
  }, R = Wt(e.nBitLength);
  function q(b) {
    if (typeof b != "bigint")
      throw new Error("bigint expected");
    if (!(oe <= b && b < R))
      throw new Error(`bigint expected < 2^${e.nBitLength}`);
    return we(b, e.nByteLength);
  }
  function T(b, E, B = O) {
    if (["recovered", "canonical"].some((Ee) => Ee in B))
      throw new Error("sign() legacy options not supported");
    const { hash: $, randomBytes: _ } = e;
    let { lowS: L, prehash: M, extraEntropy: Y } = B;
    L == null && (L = !0), b = z("msgHash", b), M && (b = z("prehashed msgHash", $(b)));
    const he = A(b), de = f(E), Be = [q(de), q(he)];
    if (Y != null) {
      const Ee = Y === !0 ? _(n.BYTES) : Y;
      Be.push(z("extraEntropy", Ee, n.BYTES));
    }
    const He = Re(...Be), pe = he;
    function dt(Ee) {
      const Oe = v(Ee);
      if (!p(Oe))
        return;
      const nn = a(Oe), _e = u.BASE.multiply(Oe).toAffine(), X = c(_e.x);
      if (X === oe)
        return;
      const Te = c(nn * c(pe + X * de));
      if (Te === oe)
        return;
      let rn = (_e.x === X ? 0 : 2) | Number(_e.y & Q), on = Te;
      return L && d(Te) && (on = h(Te), rn ^= 1), new g(X, on, rn);
    }
    return { seed: He, k2sig: dt };
  }
  const O = { lowS: e.lowS, prehash: !1 }, j = { lowS: e.lowS, prehash: !1 };
  function F(b, E, B = O) {
    const { seed: $, k2sig: _ } = T(b, E, B), L = e;
    return jn(L.hash.outputLen, L.nByteLength, L.hmac)($, _);
  }
  u.BASE._setWindowSize(8);
  function le(b, E, B, $ = j) {
    var _e;
    const _ = b;
    if (E = z("msgHash", E), B = z("publicKey", B), "strict" in $)
      throw new Error("options.strict was renamed to lowS");
    const { lowS: L, prehash: M } = $;
    let Y, he;
    try {
      if (typeof _ == "string" || _ instanceof Uint8Array)
        try {
          Y = g.fromDER(_);
        } catch (X) {
          if (!(X instanceof Ae.Err))
            throw X;
          Y = g.fromCompact(_);
        }
      else if (typeof _ == "object" && typeof _.r == "bigint" && typeof _.s == "bigint") {
        const { r: X, s: Te } = _;
        Y = new g(X, Te);
      } else
        throw new Error("PARSE");
      he = u.fromHex(B);
    } catch (X) {
      if (X.message === "PARSE")
        throw new Error("signature must be Signature instance, Uint8Array or hex string");
      return !1;
    }
    if (L && Y.hasHighS())
      return !1;
    M && (E = e.hash(E));
    const { r: de, s: Be } = Y, He = A(E), pe = a(Be), dt = c(He * pe), Ee = c(de * pe), Oe = (_e = u.BASE.multiplyAndAddUnsafe(he, dt, Ee)) == null ? void 0 : _e.toAffine();
    return Oe ? c(Oe.x) === de : !1;
  }
  return {
    CURVE: e,
    getPublicKey: I,
    getSharedSecret: x,
    sign: F,
    verify: le,
    ProjectivePoint: u,
    Signature: g,
    utils: m
  };
}
class Wn extends _n {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Se.hash(e);
    const r = Lt(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, i = new Uint8Array(o);
    i.set(r.length > o ? e.create().update(r).digest() : r);
    for (let s = 0; s < i.length; s++)
      i[s] ^= 54;
    this.iHash.update(i), this.oHash = e.create();
    for (let s = 0; s < i.length; s++)
      i[s] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(e) {
    return Se.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Se.exists(this), Se.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: i, blockLen: s, outputLen: c } = this;
    return e = e, e.finished = o, e.destroyed = i, e.blockLen = s, e.outputLen = c, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Dn = (t, e, n) => new Wn(t, e).update(n).digest();
Dn.create = (t, e) => new Wn(t, e);
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Bo(t) {
  return {
    hash: t,
    hmac: (e, ...n) => Dn(t, e, kr(...n)),
    randomBytes: $n
  };
}
function Oo(t, e) {
  const n = (r) => Ro({ ...t, ...Bo(r) });
  return Object.freeze({ ...n(e), create: n });
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ut = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"), Xe = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), Vn = BigInt(1), Je = BigInt(2), bn = (t, e) => (t + e / Je) / e;
function Fn(t) {
  const e = ut, n = BigInt(3), r = BigInt(6), o = BigInt(11), i = BigInt(22), s = BigInt(23), c = BigInt(44), a = BigInt(88), u = t * t * t % e, f = u * u * t % e, l = G(f, n, e) * f % e, p = G(l, n, e) * f % e, w = G(p, Je, e) * u % e, d = G(w, o, e) * w % e, h = G(d, i, e) * d % e, y = G(h, c, e) * h % e, g = G(y, a, e) * y % e, m = G(g, c, e) * h % e, I = G(m, n, e) * f % e, S = G(I, s, e) * d % e, x = G(S, r, e) * u % e, v = G(x, Je, e);
  if (!$t.eql($t.sqr(v), t))
    throw new Error("Cannot find square root");
  return v;
}
const $t = wo(ut, void 0, void 0, { sqrt: Fn }), Vt = Oo({
  a: BigInt(0),
  b: BigInt(7),
  Fp: $t,
  n: Xe,
  // Base point (x, y) aka generator point
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  h: BigInt(1),
  lowS: !0,
  /**
   * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
   * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
   * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
   * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
   */
  endo: {
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    splitScalar: (t) => {
      const e = Xe, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Vn * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), o = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, s = BigInt("0x100000000000000000000000000000000"), c = bn(i * t, e), a = bn(-r * t, e);
      let u = W(t - c * n - a * o, e), f = W(-c * r - a * i, e);
      const l = u > s, p = f > s;
      if (l && (u = e - u), p && (f = e - f), u > s || f > s)
        throw new Error("splitScalar: Endomorphism failed, k=" + t);
      return { k1neg: l, k1: u, k2neg: p, k2: f };
    }
  }
}, Qe), ft = BigInt(0), Mn = (t) => typeof t == "bigint" && ft < t && t < ut, _o = (t) => typeof t == "bigint" && ft < t && t < Xe, vn = {};
function et(t, ...e) {
  let n = vn[t];
  if (n === void 0) {
    const r = Qe(Uint8Array.from(t, (o) => o.charCodeAt(0)));
    n = Re(r, r), vn[t] = n;
  }
  return Qe(Re(n, ...e));
}
const Ft = (t) => t.toRawBytes(!0).slice(1), kt = (t) => we(t, 32), vt = (t) => W(t, ut), ze = (t) => W(t, Xe), Mt = Vt.ProjectivePoint, To = (t, e, n) => Mt.BASE.multiplyAndAddUnsafe(t, e, n);
function qt(t) {
  let e = Vt.utils.normPrivateKeyToScalar(t), n = Mt.fromPrivateKey(e);
  return { scalar: n.hasEvenY() ? e : ze(-e), bytes: Ft(n) };
}
function Yn(t) {
  if (!Mn(t))
    throw new Error("bad x: need 0 < x < p");
  const e = vt(t * t), n = vt(e * t + BigInt(7));
  let r = Fn(n);
  r % Je !== ft && (r = vt(-r));
  const o = new Mt(t, r, Vn);
  return o.assertValidity(), o;
}
function Kn(...t) {
  return ze(D(et("BIP0340/challenge", ...t)));
}
function $o(t) {
  return qt(t).bytes;
}
function ko(t, e, n = $n(32)) {
  const r = z("message", t), { bytes: o, scalar: i } = qt(e), s = z("auxRand", n, 32), c = kt(i ^ D(et("BIP0340/aux", s))), a = et("BIP0340/nonce", c, o, r), u = ze(D(a));
  if (u === ft)
    throw new Error("sign failed: k is zero");
  const { bytes: f, scalar: l } = qt(u), p = Kn(f, o, r), w = new Uint8Array(64);
  if (w.set(f, 0), w.set(kt(ze(l + p * i)), 32), !Zn(w, r, o))
    throw new Error("sign: Invalid signature produced");
  return w;
}
function Zn(t, e, n) {
  const r = z("signature", t, 64), o = z("message", e), i = z("publicKey", n, 32);
  try {
    const s = Yn(D(i)), c = D(r.subarray(0, 32));
    if (!Mn(c))
      return !1;
    const a = D(r.subarray(32, 64));
    if (!_o(a))
      return !1;
    const u = Kn(kt(c), Ft(s), o), f = To(s, a, ze(-u));
    return !(!f || !f.hasEvenY() || f.toAffine().x !== c);
  } catch {
    return !1;
  }
}
const Yt = /* @__PURE__ */ (() => ({
  getPublicKey: $o,
  sign: ko,
  verify: Zn,
  utils: {
    randomPrivateKey: Vt.utils.randomPrivateKey,
    lift_x: Yn,
    pointToBytes: Ft,
    numberToBytesBE: we,
    bytesToNumberBE: D,
    taggedHash: et,
    mod: W
  }
}))(), qo = new TextEncoder();
async function Co(t, e) {
  var o;
  const n = {
    ...t,
    pubkey: t.pubkey ?? await r(),
    tags: t.tags ?? [],
    created_at: t.created_at ?? Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3)
  };
  if (Uo(t))
    return t;
  if (e) {
    const i = n.id ?? Gn(n), s = e.startsWith("nsec1") ? gt(e) : e;
    return {
      ...n,
      id: i,
      sig: n.sig ?? Po(i, s)
    };
  } else {
    const i = (o = window ?? {}) == null ? void 0 : o.nostr;
    if (!i)
      throw new Error(
        "Couldn't get sig. To automatically calculate signature, a seckey argument or NIP-07 environment is required."
      );
    return i.signEvent({
      kind: n.kind,
      tags: n.tags,
      content: n.content,
      created_at: n.created_at
    });
  }
  async function r() {
    var i;
    if (t.pubkey)
      return t.pubkey.startsWith("npub1") ? gt(t.pubkey) : t.pubkey;
    if (e)
      return e.startsWith("nsec1") ? mn(gt(e)) : mn(e);
    {
      const s = await ((i = window == null ? void 0 : window.nostr) == null ? void 0 : i.getPublicKey());
      if (!s)
        throw new Error(
          "Couldn't get pubkey. To automatically calculate pubkey, a seckey argument or NIP-07 environment is required."
        );
      return s;
    }
  }
}
function mn(t) {
  return it(Yt.getPublicKey(t));
}
function Gn(t) {
  const e = JSON.stringify([
    0,
    t.pubkey,
    t.created_at,
    t.kind,
    t.tags,
    t.content
  ]);
  return it(Qe(qo.encode(e)));
}
function Po(t, e) {
  return it(Yt.sign(t, e));
}
function No(t) {
  try {
    return Yt.verify(t.sig, Gn(t), t.pubkey);
  } catch (e) {
    return console.warn("The following error occurred during verify():", e), !1;
  }
}
function Uo(t) {
  if (typeof t.id != "string" || typeof t.sig != "string" || typeof t.kind != "number" || typeof t.pubkey != "string" || typeof t.content != "string" || typeof t.created_at != "number" || !Array.isArray(t.tags))
    return !1;
  for (let e = 0; e < t.tags.length; e++) {
    const n = t.tags[e];
    if (!Array.isArray(n))
      return !1;
    for (let r = 0; r < n.length; r++)
      if (typeof n[r] == "object")
        return !1;
  }
  return !0;
}
function as(t, e) {
  return Fe(t, e) < 0 ? t : e;
}
function us(t, e) {
  return Fe(t, e) < 0 ? e : t;
}
function Fe(t, e) {
  return t.id === e.id ? 0 : t.created_at < e.created_at || // https://github.com/nostr-protocol/nips/blob/master/16.md#replaceable-events
  t.created_at === e.created_at && t.id < e.id ? -1 : 1;
}
const Lo = "text/plain", Ho = "us-ascii", mt = (t, e) => e.some((n) => n instanceof RegExp ? n.test(t) : n === t), jo = /* @__PURE__ */ new Set([
  "https:",
  "http:",
  "file:"
]), zo = (t) => {
  try {
    const { protocol: e } = new URL(t);
    return e.endsWith(":") && !jo.has(e);
  } catch {
    return !1;
  }
}, Wo = (t, { stripHash: e }) => {
  var l;
  const n = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(t);
  if (!n)
    throw new Error(`Invalid URL: ${t}`);
  let { type: r, data: o, hash: i } = n.groups;
  const s = r.split(";");
  i = e ? "" : i;
  let c = !1;
  s[s.length - 1] === "base64" && (s.pop(), c = !0);
  const a = ((l = s.shift()) == null ? void 0 : l.toLowerCase()) ?? "", f = [
    ...s.map((p) => {
      let [w, d = ""] = p.split("=").map((h) => h.trim());
      return w === "charset" && (d = d.toLowerCase(), d === Ho) ? "" : `${w}${d ? `=${d}` : ""}`;
    }).filter(Boolean)
  ];
  return c && f.push("base64"), (f.length > 0 || a && a !== Lo) && f.unshift(a), `data:${f.join(";")},${c ? o.trim() : o}${i ? `#${i}` : ""}`;
};
function Do(t, e) {
  if (e = {
    defaultProtocol: "http",
    normalizeProtocol: !0,
    forceHttp: !1,
    forceHttps: !1,
    stripAuthentication: !0,
    stripHash: !1,
    stripTextFragment: !0,
    stripWWW: !0,
    removeQueryParameters: [/^utm_\w+/i],
    removeTrailingSlash: !0,
    removeSingleSlash: !0,
    removeDirectoryIndex: !1,
    removeExplicitPort: !1,
    sortQueryParameters: !0,
    ...e
  }, typeof e.defaultProtocol == "string" && !e.defaultProtocol.endsWith(":") && (e.defaultProtocol = `${e.defaultProtocol}:`), t = t.trim(), /^data:/i.test(t))
    return Wo(t, e);
  if (zo(t))
    return t;
  const n = t.startsWith("//");
  !n && /^\.*\//.test(t) || (t = t.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, e.defaultProtocol));
  const o = new URL(t);
  if (e.forceHttp && e.forceHttps)
    throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
  if (e.forceHttp && o.protocol === "https:" && (o.protocol = "http:"), e.forceHttps && o.protocol === "http:" && (o.protocol = "https:"), e.stripAuthentication && (o.username = "", o.password = ""), e.stripHash ? o.hash = "" : e.stripTextFragment && (o.hash = o.hash.replace(/#?:~:text.*?$/i, "")), o.pathname) {
    const s = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;
    let c = 0, a = "";
    for (; ; ) {
      const f = s.exec(o.pathname);
      if (!f)
        break;
      const l = f[0], p = f.index, w = o.pathname.slice(c, p);
      a += w.replace(/\/{2,}/g, "/"), a += l, c = p + l.length;
    }
    const u = o.pathname.slice(c, o.pathname.length);
    a += u.replace(/\/{2,}/g, "/"), o.pathname = a;
  }
  if (o.pathname)
    try {
      o.pathname = decodeURI(o.pathname);
    } catch {
    }
  if (e.removeDirectoryIndex === !0 && (e.removeDirectoryIndex = [/^index\.[a-z]+$/]), Array.isArray(e.removeDirectoryIndex) && e.removeDirectoryIndex.length > 0) {
    let s = o.pathname.split("/");
    const c = s[s.length - 1];
    mt(c, e.removeDirectoryIndex) && (s = s.slice(0, -1), o.pathname = s.slice(1).join("/") + "/");
  }
  if (o.hostname && (o.hostname = o.hostname.replace(/\.$/, ""), e.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(o.hostname) && (o.hostname = o.hostname.replace(/^www\./, ""))), Array.isArray(e.removeQueryParameters))
    for (const s of [...o.searchParams.keys()])
      mt(s, e.removeQueryParameters) && o.searchParams.delete(s);
  if (!Array.isArray(e.keepQueryParameters) && e.removeQueryParameters === !0 && (o.search = ""), Array.isArray(e.keepQueryParameters) && e.keepQueryParameters.length > 0)
    for (const s of [...o.searchParams.keys()])
      mt(s, e.keepQueryParameters) || o.searchParams.delete(s);
  if (e.sortQueryParameters) {
    o.searchParams.sort();
    try {
      o.search = decodeURIComponent(o.search);
    } catch {
    }
  }
  e.removeTrailingSlash && (o.pathname = o.pathname.replace(/\/$/, "")), e.removeExplicitPort && o.port && (o.port = "");
  const i = t;
  return t = o.toString(), !e.removeSingleSlash && o.pathname === "/" && !i.endsWith("/") && o.hash === "" && (t = t.replace(/\/$/, "")), (e.removeTrailingSlash || o.pathname === "/") && o.hash === "" && e.removeSingleSlash && (t = t.replace(/\/$/, "")), n && !e.normalizeProtocol && (t = t.replace(/^http:\/\//, "//")), e.stripProtocol && (t = t.replace(/^(?:https?:)?\/\//, "")), t;
}
function Me(t) {
  return (e) => Object.fromEntries(
    Object.keys(t).map((n) => [
      n,
      (e == null ? void 0 : e[n]) ?? t[n]
    ])
  );
}
function ee(t) {
  return Do(t, {
    normalizeProtocol: !1,
    removeTrailingSlash: !0
  });
}
const Vo = Me({
  sinceInclusive: !0,
  untilInclusive: !0
});
function Qn(t, e, n) {
  return Array.isArray(e) ? e.some((r) => En(t, r, n)) : En(t, e, n);
}
function En(t, e, n) {
  const { sinceInclusive: r, untilInclusive: o } = Vo(n);
  if (e.ids && e.ids.every((i) => !t.id.startsWith(i)) || e.kinds && !e.kinds.includes(t.kind) || e.authors && e.authors.every((i) => !t.pubkey.startsWith(i)) || e.since && (r && !(e.since <= t.created_at) || !r && !(e.since < t.created_at)) || e.until && (o && !(t.created_at <= e.until) || !o && !(t.created_at < e.until)))
    return !1;
  for (const [i, s] of Object.entries(e)) {
    if (!i.startsWith("#") || !Array.isArray(s))
      continue;
    const c = i.slice(1);
    if (!t.tags.find(
      ([a, u]) => c === a && s.includes(u)
    ))
      return !1;
  }
  return !0;
}
async function Xn(t) {
  const e = new URL(t);
  return e.protocol = e.protocol.replace(/^ws(s?):/, "http$1:"), (await fetch(e.toString(), {
    headers: { Accept: "application/nostr+json" }
  })).json();
}
var Ct = function(t, e) {
  return Ct = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var o in r)
      Object.prototype.hasOwnProperty.call(r, o) && (n[o] = r[o]);
  }, Ct(t, e);
};
function re(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Ct(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
function Fo(t, e, n, r) {
  function o(i) {
    return i instanceof n ? i : new n(function(s) {
      s(i);
    });
  }
  return new (n || (n = Promise))(function(i, s) {
    function c(f) {
      try {
        u(r.next(f));
      } catch (l) {
        s(l);
      }
    }
    function a(f) {
      try {
        u(r.throw(f));
      } catch (l) {
        s(l);
      }
    }
    function u(f) {
      f.done ? i(f.value) : o(f.value).then(c, a);
    }
    u((r = r.apply(t, e || [])).next());
  });
}
function Jn(t, e) {
  var n = { label: 0, sent: function() {
    if (i[0] & 1)
      throw i[1];
    return i[1];
  }, trys: [], ops: [] }, r, o, i, s;
  return s = { next: c(0), throw: c(1), return: c(2) }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function c(u) {
    return function(f) {
      return a([u, f]);
    };
  }
  function a(u) {
    if (r)
      throw new TypeError("Generator is already executing.");
    for (; s && (s = 0, u[0] && (n = 0)), n; )
      try {
        if (r = 1, o && (i = u[0] & 2 ? o.return : u[0] ? o.throw || ((i = o.return) && i.call(o), 0) : o.next) && !(i = i.call(o, u[1])).done)
          return i;
        switch (o = 0, i && (u = [u[0] & 2, i.value]), u[0]) {
          case 0:
          case 1:
            i = u;
            break;
          case 4:
            return n.label++, { value: u[1], done: !1 };
          case 5:
            n.label++, o = u[1], u = [0];
            continue;
          case 7:
            u = n.ops.pop(), n.trys.pop();
            continue;
          default:
            if (i = n.trys, !(i = i.length > 0 && i[i.length - 1]) && (u[0] === 6 || u[0] === 2)) {
              n = 0;
              continue;
            }
            if (u[0] === 3 && (!i || u[1] > i[0] && u[1] < i[3])) {
              n.label = u[1];
              break;
            }
            if (u[0] === 6 && n.label < i[1]) {
              n.label = i[1], i = u;
              break;
            }
            if (i && n.label < i[2]) {
              n.label = i[2], n.ops.push(u);
              break;
            }
            i[2] && n.ops.pop(), n.trys.pop();
            continue;
        }
        u = e.call(t, n);
      } catch (f) {
        u = [6, f], o = 0;
      } finally {
        r = i = 0;
      }
    if (u[0] & 5)
      throw u[1];
    return { value: u[0] ? u[1] : void 0, done: !0 };
  }
}
function Pe(t) {
  var e = typeof Symbol == "function" && Symbol.iterator, n = e && t[e], r = 0;
  if (n)
    return n.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function() {
        return t && r >= t.length && (t = void 0), { value: t && t[r++], done: !t };
      }
    };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function Ne(t, e) {
  var n = typeof Symbol == "function" && t[Symbol.iterator];
  if (!n)
    return t;
  var r = n.call(t), o, i = [], s;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = r.next()).done; )
      i.push(o.value);
  } catch (c) {
    s = { error: c };
  } finally {
    try {
      o && !o.done && (n = r.return) && n.call(r);
    } finally {
      if (s)
        throw s.error;
    }
  }
  return i;
}
function Ue(t, e, n) {
  if (n || arguments.length === 2)
    for (var r = 0, o = e.length, i; r < o; r++)
      (i || !(r in e)) && (i || (i = Array.prototype.slice.call(e, 0, r)), i[r] = e[r]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function ke(t) {
  return this instanceof ke ? (this.v = t, this) : new ke(t);
}
function Mo(t, e, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(t, e || []), o, i = [];
  return o = {}, s("next"), s("throw"), s("return"), o[Symbol.asyncIterator] = function() {
    return this;
  }, o;
  function s(p) {
    r[p] && (o[p] = function(w) {
      return new Promise(function(d, h) {
        i.push([p, w, d, h]) > 1 || c(p, w);
      });
    });
  }
  function c(p, w) {
    try {
      a(r[p](w));
    } catch (d) {
      l(i[0][3], d);
    }
  }
  function a(p) {
    p.value instanceof ke ? Promise.resolve(p.value.v).then(u, f) : l(i[0][2], p);
  }
  function u(p) {
    c("next", p);
  }
  function f(p) {
    c("throw", p);
  }
  function l(p, w) {
    p(w), i.shift(), i.length && c(i[0][0], i[0][1]);
  }
}
function Yo(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator], n;
  return e ? e.call(t) : (t = typeof Pe == "function" ? Pe(t) : t[Symbol.iterator](), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function() {
    return this;
  }, n);
  function r(i) {
    n[i] = t[i] && function(s) {
      return new Promise(function(c, a) {
        s = t[i](s), o(c, a, s.done, s.value);
      });
    };
  }
  function o(i, s, c, a) {
    Promise.resolve(a).then(function(u) {
      i({ value: u, done: c });
    }, s);
  }
}
function P(t) {
  return typeof t == "function";
}
function lt(t) {
  var e = function(r) {
    Error.call(r), r.stack = new Error().stack;
  }, n = t(e);
  return n.prototype = Object.create(Error.prototype), n.prototype.constructor = n, n;
}
var Et = lt(function(t) {
  return function(n) {
    t(this), this.message = n ? n.length + ` errors occurred during unsubscription:
` + n.map(function(r, o) {
      return o + 1 + ") " + r.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = n;
  };
});
function tt(t, e) {
  if (t) {
    var n = t.indexOf(e);
    0 <= n && t.splice(n, 1);
  }
}
var Ye = function() {
  function t(e) {
    this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return t.prototype.unsubscribe = function() {
    var e, n, r, o, i;
    if (!this.closed) {
      this.closed = !0;
      var s = this._parentage;
      if (s)
        if (this._parentage = null, Array.isArray(s))
          try {
            for (var c = Pe(s), a = c.next(); !a.done; a = c.next()) {
              var u = a.value;
              u.remove(this);
            }
          } catch (h) {
            e = { error: h };
          } finally {
            try {
              a && !a.done && (n = c.return) && n.call(c);
            } finally {
              if (e)
                throw e.error;
            }
          }
        else
          s.remove(this);
      var f = this.initialTeardown;
      if (P(f))
        try {
          f();
        } catch (h) {
          i = h instanceof Et ? h.errors : [h];
        }
      var l = this._finalizers;
      if (l) {
        this._finalizers = null;
        try {
          for (var p = Pe(l), w = p.next(); !w.done; w = p.next()) {
            var d = w.value;
            try {
              xn(d);
            } catch (h) {
              i = i ?? [], h instanceof Et ? i = Ue(Ue([], Ne(i)), Ne(h.errors)) : i.push(h);
            }
          }
        } catch (h) {
          r = { error: h };
        } finally {
          try {
            w && !w.done && (o = p.return) && o.call(p);
          } finally {
            if (r)
              throw r.error;
          }
        }
      }
      if (i)
        throw new Et(i);
    }
  }, t.prototype.add = function(e) {
    var n;
    if (e && e !== this)
      if (this.closed)
        xn(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this))
            return;
          e._addParent(this);
        }
        (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(e);
      }
  }, t.prototype._hasParent = function(e) {
    var n = this._parentage;
    return n === e || Array.isArray(n) && n.includes(e);
  }, t.prototype._addParent = function(e) {
    var n = this._parentage;
    this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e;
  }, t.prototype._removeParent = function(e) {
    var n = this._parentage;
    n === e ? this._parentage = null : Array.isArray(n) && tt(n, e);
  }, t.prototype.remove = function(e) {
    var n = this._finalizers;
    n && tt(n, e), e instanceof t && e._removeParent(this);
  }, t.EMPTY = function() {
    var e = new t();
    return e.closed = !0, e;
  }(), t;
}(), er = Ye.EMPTY;
function tr(t) {
  return t instanceof Ye || t && "closed" in t && P(t.remove) && P(t.add) && P(t.unsubscribe);
}
function xn(t) {
  P(t) ? t() : t.unsubscribe();
}
var nr = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1
}, Pt = {
  setTimeout: function(t, e) {
    for (var n = [], r = 2; r < arguments.length; r++)
      n[r - 2] = arguments[r];
    var o = Pt.delegate;
    return o != null && o.setTimeout ? o.setTimeout.apply(o, Ue([t, e], Ne(n))) : setTimeout.apply(void 0, Ue([t, e], Ne(n)));
  },
  clearTimeout: function(t) {
    var e = Pt.delegate;
    return ((e == null ? void 0 : e.clearTimeout) || clearTimeout)(t);
  },
  delegate: void 0
};
function rr(t) {
  Pt.setTimeout(function() {
    throw t;
  });
}
function We() {
}
function Ze(t) {
  t();
}
var Kt = function(t) {
  re(e, t);
  function e(n) {
    var r = t.call(this) || this;
    return r.isStopped = !1, n ? (r.destination = n, tr(n) && n.add(r)) : r.destination = Qo, r;
  }
  return e.create = function(n, r, o) {
    return new Nt(n, r, o);
  }, e.prototype.next = function(n) {
    this.isStopped || this._next(n);
  }, e.prototype.error = function(n) {
    this.isStopped || (this.isStopped = !0, this._error(n));
  }, e.prototype.complete = function() {
    this.isStopped || (this.isStopped = !0, this._complete());
  }, e.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, t.prototype.unsubscribe.call(this), this.destination = null);
  }, e.prototype._next = function(n) {
    this.destination.next(n);
  }, e.prototype._error = function(n) {
    try {
      this.destination.error(n);
    } finally {
      this.unsubscribe();
    }
  }, e.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }, e;
}(Ye), Ko = Function.prototype.bind;
function xt(t, e) {
  return Ko.call(t, e);
}
var Zo = function() {
  function t(e) {
    this.partialObserver = e;
  }
  return t.prototype.next = function(e) {
    var n = this.partialObserver;
    if (n.next)
      try {
        n.next(e);
      } catch (r) {
        Ke(r);
      }
  }, t.prototype.error = function(e) {
    var n = this.partialObserver;
    if (n.error)
      try {
        n.error(e);
      } catch (r) {
        Ke(r);
      }
    else
      Ke(e);
  }, t.prototype.complete = function() {
    var e = this.partialObserver;
    if (e.complete)
      try {
        e.complete();
      } catch (n) {
        Ke(n);
      }
  }, t;
}(), Nt = function(t) {
  re(e, t);
  function e(n, r, o) {
    var i = t.call(this) || this, s;
    if (P(n) || !n)
      s = {
        next: n ?? void 0,
        error: r ?? void 0,
        complete: o ?? void 0
      };
    else {
      var c;
      i && nr.useDeprecatedNextContext ? (c = Object.create(n), c.unsubscribe = function() {
        return i.unsubscribe();
      }, s = {
        next: n.next && xt(n.next, c),
        error: n.error && xt(n.error, c),
        complete: n.complete && xt(n.complete, c)
      }) : s = n;
    }
    return i.destination = new Zo(s), i;
  }
  return e;
}(Kt);
function Ke(t) {
  rr(t);
}
function Go(t) {
  throw t;
}
var Qo = {
  closed: !0,
  next: We,
  error: Go,
  complete: We
}, Zt = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function ce(t) {
  return t;
}
function De() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return or(t);
}
function or(t) {
  return t.length === 0 ? ce : t.length === 1 ? t[0] : function(n) {
    return t.reduce(function(r, o) {
      return o(r);
    }, n);
  };
}
var V = function() {
  function t(e) {
    e && (this._subscribe = e);
  }
  return t.prototype.lift = function(e) {
    var n = new t();
    return n.source = this, n.operator = e, n;
  }, t.prototype.subscribe = function(e, n, r) {
    var o = this, i = Jo(e) ? e : new Nt(e, n, r);
    return Ze(function() {
      var s = o, c = s.operator, a = s.source;
      i.add(c ? c.call(i, a) : a ? o._subscribe(i) : o._trySubscribe(i));
    }), i;
  }, t.prototype._trySubscribe = function(e) {
    try {
      return this._subscribe(e);
    } catch (n) {
      e.error(n);
    }
  }, t.prototype.forEach = function(e, n) {
    var r = this;
    return n = Sn(n), new n(function(o, i) {
      var s = new Nt({
        next: function(c) {
          try {
            e(c);
          } catch (a) {
            i(a), s.unsubscribe();
          }
        },
        error: i,
        complete: o
      });
      r.subscribe(s);
    });
  }, t.prototype._subscribe = function(e) {
    var n;
    return (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(e);
  }, t.prototype[Zt] = function() {
    return this;
  }, t.prototype.pipe = function() {
    for (var e = [], n = 0; n < arguments.length; n++)
      e[n] = arguments[n];
    return or(e)(this);
  }, t.prototype.toPromise = function(e) {
    var n = this;
    return e = Sn(e), new e(function(r, o) {
      var i;
      n.subscribe(function(s) {
        return i = s;
      }, function(s) {
        return o(s);
      }, function() {
        return r(i);
      });
    });
  }, t.create = function(e) {
    return new t(e);
  }, t;
}();
function Sn(t) {
  var e;
  return (e = t ?? nr.Promise) !== null && e !== void 0 ? e : Promise;
}
function Xo(t) {
  return t && P(t.next) && P(t.error) && P(t.complete);
}
function Jo(t) {
  return t && t instanceof Kt || Xo(t) && tr(t);
}
function ei(t) {
  return P(t == null ? void 0 : t.lift);
}
function U(t) {
  return function(e) {
    if (ei(e))
      return e.lift(function(n) {
        try {
          return t(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function N(t, e, n, r, o) {
  return new ir(t, e, n, r, o);
}
var ir = function(t) {
  re(e, t);
  function e(n, r, o, i, s, c) {
    var a = t.call(this, n) || this;
    return a.onFinalize = s, a.shouldUnsubscribe = c, a._next = r ? function(u) {
      try {
        r(u);
      } catch (f) {
        n.error(f);
      }
    } : t.prototype._next, a._error = i ? function(u) {
      try {
        i(u);
      } catch (f) {
        n.error(f);
      } finally {
        this.unsubscribe();
      }
    } : t.prototype._error, a._complete = o ? function() {
      try {
        o();
      } catch (u) {
        n.error(u);
      } finally {
        this.unsubscribe();
      }
    } : t.prototype._complete, a;
  }
  return e.prototype.unsubscribe = function() {
    var n;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var r = this.closed;
      t.prototype.unsubscribe.call(this), !r && ((n = this.onFinalize) === null || n === void 0 || n.call(this));
    }
  }, e;
}(Kt), ti = lt(function(t) {
  return function() {
    t(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), K = function(t) {
  re(e, t);
  function e() {
    var n = t.call(this) || this;
    return n.closed = !1, n.currentObservers = null, n.observers = [], n.isStopped = !1, n.hasError = !1, n.thrownError = null, n;
  }
  return e.prototype.lift = function(n) {
    var r = new An(this, this);
    return r.operator = n, r;
  }, e.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new ti();
  }, e.prototype.next = function(n) {
    var r = this;
    Ze(function() {
      var o, i;
      if (r._throwIfClosed(), !r.isStopped) {
        r.currentObservers || (r.currentObservers = Array.from(r.observers));
        try {
          for (var s = Pe(r.currentObservers), c = s.next(); !c.done; c = s.next()) {
            var a = c.value;
            a.next(n);
          }
        } catch (u) {
          o = { error: u };
        } finally {
          try {
            c && !c.done && (i = s.return) && i.call(s);
          } finally {
            if (o)
              throw o.error;
          }
        }
      }
    });
  }, e.prototype.error = function(n) {
    var r = this;
    Ze(function() {
      if (r._throwIfClosed(), !r.isStopped) {
        r.hasError = r.isStopped = !0, r.thrownError = n;
        for (var o = r.observers; o.length; )
          o.shift().error(n);
      }
    });
  }, e.prototype.complete = function() {
    var n = this;
    Ze(function() {
      if (n._throwIfClosed(), !n.isStopped) {
        n.isStopped = !0;
        for (var r = n.observers; r.length; )
          r.shift().complete();
      }
    });
  }, e.prototype.unsubscribe = function() {
    this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
  }, Object.defineProperty(e.prototype, "observed", {
    get: function() {
      var n;
      return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype._trySubscribe = function(n) {
    return this._throwIfClosed(), t.prototype._trySubscribe.call(this, n);
  }, e.prototype._subscribe = function(n) {
    return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n);
  }, e.prototype._innerSubscribe = function(n) {
    var r = this, o = this, i = o.hasError, s = o.isStopped, c = o.observers;
    return i || s ? er : (this.currentObservers = null, c.push(n), new Ye(function() {
      r.currentObservers = null, tt(c, n);
    }));
  }, e.prototype._checkFinalizedStatuses = function(n) {
    var r = this, o = r.hasError, i = r.thrownError, s = r.isStopped;
    o ? n.error(i) : s && n.complete();
  }, e.prototype.asObservable = function() {
    var n = new V();
    return n.source = this, n;
  }, e.create = function(n, r) {
    return new An(n, r);
  }, e;
}(V), An = function(t) {
  re(e, t);
  function e(n, r) {
    var o = t.call(this) || this;
    return o.destination = n, o.source = r, o;
  }
  return e.prototype.next = function(n) {
    var r, o;
    (o = (r = this.destination) === null || r === void 0 ? void 0 : r.next) === null || o === void 0 || o.call(r, n);
  }, e.prototype.error = function(n) {
    var r, o;
    (o = (r = this.destination) === null || r === void 0 ? void 0 : r.error) === null || o === void 0 || o.call(r, n);
  }, e.prototype.complete = function() {
    var n, r;
    (r = (n = this.destination) === null || n === void 0 ? void 0 : n.complete) === null || r === void 0 || r.call(n);
  }, e.prototype._subscribe = function(n) {
    var r, o;
    return (o = (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(n)) !== null && o !== void 0 ? o : er;
  }, e;
}(K), ni = function(t) {
  re(e, t);
  function e(n) {
    var r = t.call(this) || this;
    return r._value = n, r;
  }
  return Object.defineProperty(e.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype._subscribe = function(n) {
    var r = t.prototype._subscribe.call(this, n);
    return !r.closed && n.next(this._value), r;
  }, e.prototype.getValue = function() {
    var n = this, r = n.hasError, o = n.thrownError, i = n._value;
    if (r)
      throw o;
    return this._throwIfClosed(), i;
  }, e.prototype.next = function(n) {
    t.prototype.next.call(this, this._value = n);
  }, e;
}(K), Gt = {
  now: function() {
    return (Gt.delegate || Date).now();
  },
  delegate: void 0
}, ri = function(t) {
  re(e, t);
  function e(n, r, o) {
    n === void 0 && (n = 1 / 0), r === void 0 && (r = 1 / 0), o === void 0 && (o = Gt);
    var i = t.call(this) || this;
    return i._bufferSize = n, i._windowTime = r, i._timestampProvider = o, i._buffer = [], i._infiniteTimeWindow = !0, i._infiniteTimeWindow = r === 1 / 0, i._bufferSize = Math.max(1, n), i._windowTime = Math.max(1, r), i;
  }
  return e.prototype.next = function(n) {
    var r = this, o = r.isStopped, i = r._buffer, s = r._infiniteTimeWindow, c = r._timestampProvider, a = r._windowTime;
    o || (i.push(n), !s && i.push(c.now() + a)), this._trimBuffer(), t.prototype.next.call(this, n);
  }, e.prototype._subscribe = function(n) {
    this._throwIfClosed(), this._trimBuffer();
    for (var r = this._innerSubscribe(n), o = this, i = o._infiniteTimeWindow, s = o._buffer, c = s.slice(), a = 0; a < c.length && !n.closed; a += i ? 1 : 2)
      n.next(c[a]);
    return this._checkFinalizedStatuses(n), r;
  }, e.prototype._trimBuffer = function() {
    var n = this, r = n._bufferSize, o = n._timestampProvider, i = n._buffer, s = n._infiniteTimeWindow, c = (s ? 1 : 2) * r;
    if (r < 1 / 0 && c < i.length && i.splice(0, i.length - c), !s) {
      for (var a = o.now(), u = 0, f = 1; f < i.length && i[f] <= a; f += 2)
        u = f;
      u && i.splice(0, u + 1);
    }
  }, e;
}(K), oi = function(t) {
  re(e, t);
  function e(n, r) {
    return t.call(this) || this;
  }
  return e.prototype.schedule = function(n, r) {
    return this;
  }, e;
}(Ye), nt = {
  setInterval: function(t, e) {
    for (var n = [], r = 2; r < arguments.length; r++)
      n[r - 2] = arguments[r];
    var o = nt.delegate;
    return o != null && o.setInterval ? o.setInterval.apply(o, Ue([t, e], Ne(n))) : setInterval.apply(void 0, Ue([t, e], Ne(n)));
  },
  clearInterval: function(t) {
    var e = nt.delegate;
    return ((e == null ? void 0 : e.clearInterval) || clearInterval)(t);
  },
  delegate: void 0
}, ii = function(t) {
  re(e, t);
  function e(n, r) {
    var o = t.call(this, n, r) || this;
    return o.scheduler = n, o.work = r, o.pending = !1, o;
  }
  return e.prototype.schedule = function(n, r) {
    var o;
    if (r === void 0 && (r = 0), this.closed)
      return this;
    this.state = n;
    var i = this.id, s = this.scheduler;
    return i != null && (this.id = this.recycleAsyncId(s, i, r)), this.pending = !0, this.delay = r, this.id = (o = this.id) !== null && o !== void 0 ? o : this.requestAsyncId(s, this.id, r), this;
  }, e.prototype.requestAsyncId = function(n, r, o) {
    return o === void 0 && (o = 0), nt.setInterval(n.flush.bind(n, this), o);
  }, e.prototype.recycleAsyncId = function(n, r, o) {
    if (o === void 0 && (o = 0), o != null && this.delay === o && this.pending === !1)
      return r;
    r != null && nt.clearInterval(r);
  }, e.prototype.execute = function(n, r) {
    if (this.closed)
      return new Error("executing a cancelled action");
    this.pending = !1;
    var o = this._execute(n, r);
    if (o)
      return o;
    this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }, e.prototype._execute = function(n, r) {
    var o = !1, i;
    try {
      this.work(n);
    } catch (s) {
      o = !0, i = s || new Error("Scheduled action threw falsy error");
    }
    if (o)
      return this.unsubscribe(), i;
  }, e.prototype.unsubscribe = function() {
    if (!this.closed) {
      var n = this, r = n.id, o = n.scheduler, i = o.actions;
      this.work = this.state = this.scheduler = null, this.pending = !1, tt(i, this), r != null && (this.id = this.recycleAsyncId(o, r, null)), this.delay = null, t.prototype.unsubscribe.call(this);
    }
  }, e;
}(oi), In = function() {
  function t(e, n) {
    n === void 0 && (n = t.now), this.schedulerActionCtor = e, this.now = n;
  }
  return t.prototype.schedule = function(e, n, r) {
    return n === void 0 && (n = 0), new this.schedulerActionCtor(this, e).schedule(r, n);
  }, t.now = Gt.now, t;
}(), si = function(t) {
  re(e, t);
  function e(n, r) {
    r === void 0 && (r = In.now);
    var o = t.call(this, n, r) || this;
    return o.actions = [], o._active = !1, o;
  }
  return e.prototype.flush = function(n) {
    var r = this.actions;
    if (this._active) {
      r.push(n);
      return;
    }
    var o;
    this._active = !0;
    do
      if (o = n.execute(n.state, n.delay))
        break;
    while (n = r.shift());
    if (this._active = !1, o) {
      for (; n = r.shift(); )
        n.unsubscribe();
      throw o;
    }
  }, e;
}(In), Qt = new si(ii), ci = Qt, be = new V(function(t) {
  return t.complete();
});
function sr(t) {
  return t && P(t.schedule);
}
function cr(t) {
  return t[t.length - 1];
}
function Xt(t) {
  return sr(cr(t)) ? t.pop() : void 0;
}
function ai(t, e) {
  return typeof cr(t) == "number" ? t.pop() : e;
}
var ar = function(t) {
  return t && typeof t.length == "number" && typeof t != "function";
};
function ur(t) {
  return P(t == null ? void 0 : t.then);
}
function fr(t) {
  return P(t[Zt]);
}
function lr(t) {
  return Symbol.asyncIterator && P(t == null ? void 0 : t[Symbol.asyncIterator]);
}
function hr(t) {
  return new TypeError("You provided " + (t !== null && typeof t == "object" ? "an invalid object" : "'" + t + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function ui() {
  return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var dr = ui();
function pr(t) {
  return P(t == null ? void 0 : t[dr]);
}
function yr(t) {
  return Mo(this, arguments, function() {
    var n, r, o, i;
    return Jn(this, function(s) {
      switch (s.label) {
        case 0:
          n = t.getReader(), s.label = 1;
        case 1:
          s.trys.push([1, , 9, 10]), s.label = 2;
        case 2:
          return [4, ke(n.read())];
        case 3:
          return r = s.sent(), o = r.value, i = r.done, i ? [4, ke(void 0)] : [3, 5];
        case 4:
          return [2, s.sent()];
        case 5:
          return [4, ke(o)];
        case 6:
          return [4, s.sent()];
        case 7:
          return s.sent(), [3, 2];
        case 8:
          return [3, 10];
        case 9:
          return n.releaseLock(), [7];
        case 10:
          return [2];
      }
    });
  });
}
function gr(t) {
  return P(t == null ? void 0 : t.getReader);
}
function Z(t) {
  if (t instanceof V)
    return t;
  if (t != null) {
    if (fr(t))
      return fi(t);
    if (ar(t))
      return li(t);
    if (ur(t))
      return hi(t);
    if (lr(t))
      return wr(t);
    if (pr(t))
      return di(t);
    if (gr(t))
      return pi(t);
  }
  throw hr(t);
}
function fi(t) {
  return new V(function(e) {
    var n = t[Zt]();
    if (P(n.subscribe))
      return n.subscribe(e);
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function li(t) {
  return new V(function(e) {
    for (var n = 0; n < t.length && !e.closed; n++)
      e.next(t[n]);
    e.complete();
  });
}
function hi(t) {
  return new V(function(e) {
    t.then(function(n) {
      e.closed || (e.next(n), e.complete());
    }, function(n) {
      return e.error(n);
    }).then(null, rr);
  });
}
function di(t) {
  return new V(function(e) {
    var n, r;
    try {
      for (var o = Pe(t), i = o.next(); !i.done; i = o.next()) {
        var s = i.value;
        if (e.next(s), e.closed)
          return;
      }
    } catch (c) {
      n = { error: c };
    } finally {
      try {
        i && !i.done && (r = o.return) && r.call(o);
      } finally {
        if (n)
          throw n.error;
      }
    }
    e.complete();
  });
}
function wr(t) {
  return new V(function(e) {
    yi(t, e).catch(function(n) {
      return e.error(n);
    });
  });
}
function pi(t) {
  return wr(yr(t));
}
function yi(t, e) {
  var n, r, o, i;
  return Fo(this, void 0, void 0, function() {
    var s, c;
    return Jn(this, function(a) {
      switch (a.label) {
        case 0:
          a.trys.push([0, 5, 6, 11]), n = Yo(t), a.label = 1;
        case 1:
          return [4, n.next()];
        case 2:
          if (r = a.sent(), !!r.done)
            return [3, 4];
          if (s = r.value, e.next(s), e.closed)
            return [2];
          a.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return c = a.sent(), o = { error: c }, [3, 11];
        case 6:
          return a.trys.push([6, , 9, 10]), r && !r.done && (i = n.return) ? [4, i.call(n)] : [3, 8];
        case 7:
          a.sent(), a.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (o)
            throw o.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return e.complete(), [2];
      }
    });
  });
}
function se(t, e, n, r, o) {
  r === void 0 && (r = 0), o === void 0 && (o = !1);
  var i = e.schedule(function() {
    n(), o ? t.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if (t.add(i), !o)
    return i;
}
function br(t, e) {
  return e === void 0 && (e = 0), U(function(n, r) {
    n.subscribe(N(r, function(o) {
      return se(r, t, function() {
        return r.next(o);
      }, e);
    }, function() {
      return se(r, t, function() {
        return r.complete();
      }, e);
    }, function(o) {
      return se(r, t, function() {
        return r.error(o);
      }, e);
    }));
  });
}
function vr(t, e) {
  return e === void 0 && (e = 0), U(function(n, r) {
    r.add(t.schedule(function() {
      return n.subscribe(r);
    }, e));
  });
}
function gi(t, e) {
  return Z(t).pipe(vr(e), br(e));
}
function wi(t, e) {
  return Z(t).pipe(vr(e), br(e));
}
function bi(t, e) {
  return new V(function(n) {
    var r = 0;
    return e.schedule(function() {
      r === t.length ? n.complete() : (n.next(t[r++]), n.closed || this.schedule());
    });
  });
}
function vi(t, e) {
  return new V(function(n) {
    var r;
    return se(n, e, function() {
      r = t[dr](), se(n, e, function() {
        var o, i, s;
        try {
          o = r.next(), i = o.value, s = o.done;
        } catch (c) {
          n.error(c);
          return;
        }
        s ? n.complete() : n.next(i);
      }, 0, !0);
    }), function() {
      return P(r == null ? void 0 : r.return) && r.return();
    };
  });
}
function mr(t, e) {
  if (!t)
    throw new Error("Iterable cannot be null");
  return new V(function(n) {
    se(n, e, function() {
      var r = t[Symbol.asyncIterator]();
      se(n, e, function() {
        r.next().then(function(o) {
          o.done ? n.complete() : n.next(o.value);
        });
      }, 0, !0);
    });
  });
}
function mi(t, e) {
  return mr(yr(t), e);
}
function Ei(t, e) {
  if (t != null) {
    if (fr(t))
      return gi(t, e);
    if (ar(t))
      return bi(t, e);
    if (ur(t))
      return wi(t, e);
    if (lr(t))
      return mr(t, e);
    if (pr(t))
      return vi(t, e);
    if (gr(t))
      return mi(t, e);
  }
  throw hr(t);
}
function Jt(t, e) {
  return e ? Ei(t, e) : Z(t);
}
function ie() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  var n = Xt(t);
  return Jt(t, n);
}
var Er = lt(function(t) {
  return function() {
    t(this), this.name = "EmptyError", this.message = "no elements in sequence";
  };
});
function xr(t) {
  return t instanceof Date && !isNaN(t);
}
var Sr = lt(function(t) {
  return function(n) {
    n === void 0 && (n = null), t(this), this.message = "Timeout has occurred", this.name = "TimeoutError", this.info = n;
  };
});
function Ar(t, e) {
  var n = xr(t) ? { first: t } : typeof t == "number" ? { each: t } : t, r = n.first, o = n.each, i = n.with, s = i === void 0 ? xi : i, c = n.scheduler, a = c === void 0 ? e ?? Qt : c, u = n.meta, f = u === void 0 ? null : u;
  if (r == null && o == null)
    throw new TypeError("No timeout provided.");
  return U(function(l, p) {
    var w, d, h = null, y = 0, g = function(m) {
      d = se(p, a, function() {
        try {
          w.unsubscribe(), Z(s({
            meta: f,
            lastValue: h,
            seen: y
          })).subscribe(p);
        } catch (I) {
          p.error(I);
        }
      }, m);
    };
    w = l.subscribe(N(p, function(m) {
      d == null || d.unsubscribe(), y++, p.next(h = m), o > 0 && g(o);
    }, void 0, void 0, function() {
      d != null && d.closed || d == null || d.unsubscribe(), h = null;
    })), !y && g(r != null ? typeof r == "number" ? r : +r - a.now() : o);
  });
}
function xi(t) {
  throw new Sr(t);
}
function te(t, e) {
  return U(function(n, r) {
    var o = 0;
    n.subscribe(N(r, function(i) {
      r.next(t.call(e, i, o++));
    }));
  });
}
function Si(t, e, n, r, o, i, s, c) {
  var a = [], u = 0, f = 0, l = !1, p = function() {
    l && !a.length && !u && e.complete();
  }, w = function(h) {
    return u < r ? d(h) : a.push(h);
  }, d = function(h) {
    i && e.next(h), u++;
    var y = !1;
    Z(n(h, f++)).subscribe(N(e, function(g) {
      o == null || o(g), i ? w(g) : e.next(g);
    }, function() {
      y = !0;
    }, void 0, function() {
      if (y)
        try {
          u--;
          for (var g = function() {
            var m = a.shift();
            s ? se(e, s, function() {
              return d(m);
            }) : d(m);
          }; a.length && u < r; )
            g();
          p();
        } catch (m) {
          e.error(m);
        }
    }));
  };
  return t.subscribe(N(e, w, function() {
    l = !0, p();
  })), function() {
    c == null || c();
  };
}
function ve(t, e, n) {
  return n === void 0 && (n = 1 / 0), P(e) ? ve(function(r, o) {
    return te(function(i, s) {
      return e(r, i, o, s);
    })(Z(t(r, o)));
  }, n) : (typeof e == "number" && (n = e), U(function(r, o) {
    return Si(r, o, t, n);
  }));
}
function ht(t) {
  return t === void 0 && (t = 1 / 0), ve(ce, t);
}
function Ai() {
  return ht(1);
}
function Ii() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return Ai()(Jt(t, Xt(t)));
}
function rt(t, e, n) {
  t === void 0 && (t = 0), n === void 0 && (n = ci);
  var r = -1;
  return e != null && (sr(e) ? n = e : r = e), new V(function(o) {
    var i = xr(t) ? +t - n.now() : t;
    i < 0 && (i = 0);
    var s = 0;
    return n.schedule(function() {
      o.closed || (o.next(s++), 0 <= r ? this.schedule(void 0, r) : o.complete());
    }, i);
  });
}
function Ri() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  var n = Xt(t), r = ai(t, 1 / 0), o = t;
  return o.length ? o.length === 1 ? Z(o[0]) : ht(r)(Jt(o, n)) : be;
}
function ne(t, e) {
  return U(function(n, r) {
    var o = 0;
    n.subscribe(N(r, function(i) {
      return t.call(e, i, o++) && r.next(i);
    }));
  });
}
function en(t) {
  return U(function(e, n) {
    var r = null, o = !1, i;
    r = e.subscribe(N(n, void 0, void 0, function(s) {
      i = Z(t(s, en(t)(e))), r ? (r.unsubscribe(), r = null, i.subscribe(n)) : o = !0;
    })), o && (r.unsubscribe(), r = null, i.subscribe(n));
  });
}
function Bi(t, e, n, r, o) {
  return function(i, s) {
    var c = n, a = e, u = 0;
    i.subscribe(N(s, function(f) {
      var l = u++;
      a = c ? t(a, f, l) : (c = !0, f), r && s.next(a);
    }, o && function() {
      c && s.next(a), s.complete();
    }));
  };
}
function Oi(t) {
  return U(function(e, n) {
    var r = !1;
    e.subscribe(N(n, function(o) {
      r = !0, n.next(o);
    }, function() {
      r || n.next(t), n.complete();
    }));
  });
}
function ot(t) {
  return t <= 0 ? function() {
    return be;
  } : U(function(e, n) {
    var r = 0;
    e.subscribe(N(n, function(o) {
      ++r <= t && (n.next(o), t <= r && n.complete());
    }));
  });
}
function _i() {
  return U(function(t, e) {
    t.subscribe(N(e, We));
  });
}
function Ti(t) {
  return te(function() {
    return t;
  });
}
function Ir(t, e) {
  return e ? function(n) {
    return Ii(e.pipe(ot(1), _i()), n.pipe(Ir(t)));
  } : ve(function(n, r) {
    return Z(t(n, r)).pipe(ot(1), Ti(n));
  });
}
function $i(t, e) {
  e === void 0 && (e = Qt);
  var n = rt(t, e);
  return Ir(function() {
    return n;
  });
}
function ki(t, e) {
  return U(function(n, r) {
    var o = /* @__PURE__ */ new Set();
    n.subscribe(N(r, function(i) {
      var s = t ? t(i) : i;
      o.has(s) || (o.add(s), r.next(i));
    })), e && Z(e).subscribe(N(r, function() {
      return o.clear();
    }, We));
  });
}
function qi(t, e) {
  return e === void 0 && (e = ce), t = t ?? Ci, U(function(n, r) {
    var o, i = !0;
    n.subscribe(N(r, function(s) {
      var c = e(s);
      (i || !t(o, c)) && (i = !1, o = c, r.next(s));
    }));
  });
}
function Ci(t, e) {
  return t === e;
}
function Pi(t) {
  return t === void 0 && (t = Ni), U(function(e, n) {
    var r = !1;
    e.subscribe(N(n, function(o) {
      r = !0, n.next(o);
    }, function() {
      return r ? n.complete() : n.error(t());
    }));
  });
}
function Ni() {
  return new Er();
}
function Rn(t) {
  return U(function(e, n) {
    try {
      e.subscribe(n);
    } finally {
      n.add(t);
    }
  });
}
function Ui(t, e) {
  var n = arguments.length >= 2;
  return function(r) {
    return r.pipe(t ? ne(function(o, i) {
      return t(o, i, r);
    }) : ce, ot(1), n ? Oi(e) : Pi(function() {
      return new Er();
    }));
  };
}
function Li(t, e, n, r) {
  return U(function(o, i) {
    var s;
    !e || typeof e == "function" ? s = e : (n = e.duration, s = e.element, r = e.connector);
    var c = /* @__PURE__ */ new Map(), a = function(d) {
      c.forEach(d), d(i);
    }, u = function(d) {
      return a(function(h) {
        return h.error(d);
      });
    }, f = 0, l = !1, p = new ir(i, function(d) {
      try {
        var h = t(d), y = c.get(h);
        if (!y) {
          c.set(h, y = r ? r() : new K());
          var g = w(h, y);
          if (i.next(g), n) {
            var m = N(y, function() {
              y.complete(), m == null || m.unsubscribe();
            }, void 0, void 0, function() {
              return c.delete(h);
            });
            p.add(Z(n(g)).subscribe(m));
          }
        }
        y.next(s ? s(d) : d);
      } catch (I) {
        u(I);
      }
    }, function() {
      return a(function(d) {
        return d.complete();
      });
    }, u, function() {
      return c.clear();
    }, function() {
      return l = !0, f === 0;
    });
    o.subscribe(p);
    function w(d, h) {
      var y = new V(function(g) {
        f++;
        var m = h.subscribe(g);
        return function() {
          m.unsubscribe(), --f === 0 && l && p.unsubscribe();
        };
      });
      return y.key = d, y;
    }
  });
}
function Hi(t) {
  t === void 0 && (t = 1 / 0);
  var e;
  t && typeof t == "object" ? e = t : e = {
    count: t
  };
  var n = e.count, r = n === void 0 ? 1 / 0 : n, o = e.delay, i = e.resetOnSuccess, s = i === void 0 ? !1 : i;
  return r <= 0 ? ce : U(function(c, a) {
    var u = 0, f, l = function() {
      var p = !1;
      f = c.subscribe(N(a, function(w) {
        s && (u = 0), a.next(w);
      }, void 0, function(w) {
        if (u++ < r) {
          var d = function() {
            f ? (f.unsubscribe(), f = null, l()) : p = !0;
          };
          if (o != null) {
            var h = typeof o == "number" ? rt(o) : Z(o(w, u)), y = N(a, function() {
              y.unsubscribe(), d();
            }, function() {
              a.complete();
            });
            h.subscribe(y);
          } else
            d();
        } else
          a.error(w);
      })), p && (f.unsubscribe(), f = null, l());
    };
    l();
  });
}
function Rr(t, e) {
  return U(Bi(t, e, arguments.length >= 2, !0));
}
function ji(t) {
  return U(function(e, n) {
    Z(t).subscribe(N(n, function() {
      return n.complete();
    }, We)), !n.closed && e.subscribe(n);
  });
}
function Ie(t, e, n) {
  var r = P(t) || e || n ? { next: t, error: e, complete: n } : t;
  return r ? U(function(o, i) {
    var s;
    (s = r.subscribe) === null || s === void 0 || s.call(r);
    var c = !0;
    o.subscribe(N(i, function(a) {
      var u;
      (u = r.next) === null || u === void 0 || u.call(r, a), i.next(a);
    }, function() {
      var a;
      c = !1, (a = r.complete) === null || a === void 0 || a.call(r), i.complete();
    }, function(a) {
      var u;
      c = !1, (u = r.error) === null || u === void 0 || u.call(r, a), i.error(a);
    }, function() {
      var a, u;
      c && ((a = r.unsubscribe) === null || a === void 0 || a.call(r)), (u = r.finalize) === null || u === void 0 || u.call(r);
    }));
  }) : ce;
}
function fs(t) {
  return ki(({ event: e }) => e.id, t);
}
function ls(t, e) {
  const n = /* @__PURE__ */ new Set();
  return [
    ne((r) => {
      var i, s;
      const o = t(r);
      return o === null ? !0 : n.has(o) ? ((i = e == null ? void 0 : e.onHit) == null || i.call(e, r, n), !1) : (n.add(o), (s = e == null ? void 0 : e.onCache) == null || s.call(e, r, n), !0);
    }),
    n
  ];
}
function zi() {
  return De(
    Rr(
      (t, e) => Fe(t.event, e.event) < 0 ? e : t
    ),
    qi(
      (t, e) => t === e,
      ({ event: t }) => t.id
    )
  );
}
function hs(t) {
  return De(Li(t), te(De(zi())), ht());
}
function ds() {
  return ne(({ event: t }) => No(t));
}
function ps(t) {
  return ne(({ event: e }) => e.kind === t);
}
function ys(t, e) {
  const { not: n } = Fi(e), r = On(t);
  return ne(({ event: o }) => {
    const i = Qn(o, r, e);
    return n ? !i : i;
  });
}
function gs(t) {
  return Rr((e, n) => {
    const r = [...e, n].sort(
      (o, i) => -1 * Fe(o.event, i.event)
    );
    return t !== void 0 && r.splice(t), r;
  }, []);
}
function ws(t, e) {
  return Di(
    t,
    e ?? ((n, r) => Fe(n.event, r.event))
  );
}
function bs(t) {
  return ne(
    (e) => e.message[0] === t
  );
}
function vs(t) {
  return te(
    (e) => e.reduce((n, r) => n === null ? r : r === null ? n : (t ?? Vi)(n, r), null)
  );
}
function ms(t, e) {
  return ve(
    (n) => n !== null && t(n) ? ie(...e(n)) : ie(n)
  );
}
function Wi(t) {
  return De(
    Ar(t),
    en((e) => {
      if (e instanceof Sr)
        return be;
      throw e;
    })
  );
}
function Di(t, e) {
  const n = [];
  return De(
    Ie((r) => {
      n.push(r), n.sort(e);
    }),
    $i(t),
    te(() => {
      if (n.length <= 0)
        throw new Error("Logic Error: This is rx-nostr's internal bug.");
      return n.shift();
    })
  );
}
function Vi(t, e) {
  return [...t, ...e];
}
const Fi = Me({
  not: !1
});
class tn {
  constructor(e) {
    C(this, "filters$", new ni(null));
    C(this, "_rxReqId");
    this._rxReqId = e ?? Zi();
  }
  get rxReqId() {
    return this._rxReqId;
  }
  getReqObservable() {
    return this.filters$.asObservable();
  }
  emit(e) {
    const n = Qi(e);
    n ? this.filters$.next(n) : this.filters$.next(null);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pipe(...e) {
    const n = this.rxReqId, r = this.strategy;
    return {
      ...this,
      get rxReqId() {
        return n;
      },
      get strategy() {
        return r;
      },
      getReqObservable: () => this.getReqObservable().pipe(...e)
    };
  }
}
function Es(t) {
  return new Mi(t);
}
class Mi extends tn {
  constructor(e) {
    super(e);
  }
  get strategy() {
    return "backward";
  }
}
function xs(t) {
  return new Yi(t);
}
class Yi extends tn {
  constructor(e) {
    super(e);
  }
  get strategy() {
    return "forward";
  }
}
function Ss(t) {
  return new Ki(t);
}
class Ki extends tn {
  constructor(e) {
    super(e == null ? void 0 : e.subId), this.emit(e.filters);
  }
  get strategy() {
    return "oneshot";
  }
}
function As(t) {
  return t;
}
function Is(t, e) {
  return Object.assign(t, e());
}
function Zi() {
  return `${Math.floor(Math.random() * 1e6)}`;
}
function Gi(t) {
  var o, i;
  const e = {}, n = (s) => /^#[a-zA-Z]$/.test(s);
  for (const s of Object.keys(t)) {
    if (s === "limit" && (t[s] ?? -1) >= 0) {
      e[s] = t[s];
      continue;
    }
    if (s === "since" || s === "until") {
      const c = t[s];
      if (typeof c != "number" || (c ?? -1) >= 0) {
        e[s] = c;
        continue;
      }
    }
    if ((n(s) || s === "ids" || s === "authors") && t[s] !== void 0 && (((o = t[s]) == null ? void 0 : o.length) ?? -1) > 0) {
      e[s] = t[s];
      continue;
    }
    if (s === "kinds" && t[s] !== void 0 && (((i = t[s]) == null ? void 0 : i.length) ?? -1) > 0) {
      e[s] = t[s];
      continue;
    }
    if (s === "search" && t[s] !== void 0) {
      e[s] = t[s];
      continue;
    }
  }
  return !(typeof e.since != "number" || typeof e.until != "number" || e.since <= e.until) || Object.keys(e).length <= 0 ? null : e;
}
function Qi(t) {
  if (!t)
    return null;
  const e = (Array.isArray(t) ? t : [t]).flatMap(
    (n) => Gi(n) ?? []
  );
  return e.length > 0 ? e : null;
}
class Xi {
  constructor(e, n) {
    C(this, "socket", null);
    C(this, "message$", new K());
    C(this, "error$", new K());
    C(this, "connectionState$", new K());
    C(this, "connectionState", "not-started");
    C(this, "queuedEvents", []);
    C(this, "reqs", /* @__PURE__ */ new Map());
    C(this, "serverLimitations", null);
    C(this, "canRetry", !1);
    this.url = e, this.config = n, this.connectionState$.next("not-started");
  }
  get read() {
    return this.config.read;
  }
  set read(e) {
    this.config.read = e;
  }
  get write() {
    return this.config.write;
  }
  set write(e) {
    this.config.write = e;
  }
  get maxConcurrentReqs() {
    var e;
    return ((e = this.serverLimitations) == null ? void 0 : e.max_subscriptions) ?? this.config.maxConcurrentReqsFallback ?? null;
  }
  setConnectionState(e) {
    this.connectionState !== "terminated" && (this.connectionState = e, this.connectionState$.next(e));
  }
  async fetchServerLimitationsIfNeeded() {
    if (!(this.config.disableAutoFetchNip11Limitations || this.serverLimitations))
      try {
        const e = await Xn(this.url);
        this.serverLimitations = e.limitation ?? null;
      } catch {
      }
  }
  async start() {
    if (!this.canRetry && (this.connectionState === "reconnecting" || this.connectionState === "starting" || this.connectionState === "ongoing"))
      return Promise.resolve();
    this.canRetry = !1, this.connectionState === "not-started" ? this.setConnectionState("starting") : this.setConnectionState("reconnecting"), await this.fetchServerLimitationsIfNeeded();
    let e;
    const n = new Promise((a) => {
      e = a;
    }), r = () => {
      this.setConnectionState("ongoing"), e();
      for (const a of this.queuedEvents)
        this.sendEVENT(a);
      this.queuedEvents = [], this.ensureReqs();
    }, o = ({ data: a }) => {
      if (this.connectionState !== "terminated")
        try {
          this.message$.next({ from: this.url, message: JSON.parse(a) });
        } catch (u) {
          this.error$.next(u);
        }
    }, i = () => {
      e();
    }, s = ({ code: a }) => {
      if (!(a === $e.DISPOSED_BY_RX_NOSTR || this.connectionState === "terminated")) {
        c.removeEventListener("open", r), c.removeEventListener("message", o), c.removeEventListener("error", i), c.removeEventListener("close", s), c.close(), this.socket = null;
        for (const u of this.reqs.values())
          u.isOngoing = !1;
        a === $e.DESIRED_BY_RX_NOSTR ? this.setConnectionState("not-started") : a === $e.DONT_RETRY ? (this.setConnectionState("rejected"), this.message$.next(new St(a)), e()) : (this.canRetry = !0, this.message$.next(new St(a)), e());
      }
    };
    if (this.connectionState === "terminated")
      return Promise.resolve();
    const c = new WebSocket(this.url);
    return c.addEventListener("open", r), c.addEventListener("message", o), c.addEventListener("error", i), c.addEventListener("close", s), this.socket = c, n;
  }
  stop() {
    var e;
    this.finalizeAllReqs(), (e = this.socket) == null || e.close($e.DESIRED_BY_RX_NOSTR);
  }
  getConnectionState() {
    return this.connectionState;
  }
  getMessageObservable() {
    const e = this.reqs;
    return this.message$.asObservable().pipe(
      ve((r) => {
        if (r instanceof St) {
          if (r.code === $e.DONT_RETRY)
            return be;
          throw r;
        } else
          return ie(r);
      }),
      Ie({
        subscribe: () => {
          this.start();
        }
      }),
      this.config.backoff.strategy === "off" ? ce : Hi({
        delay: (r, o) => Ji(this.config.backoff, o),
        count: this.config.backoff.maxCount
      }),
      Ie({
        error: () => {
          this.setConnectionState("error");
        }
      }),
      n()
    );
    function n() {
      return ne((r) => {
        const [o, i, s] = r.message;
        if (o !== "EVENT")
          return !0;
        const c = e.get(i);
        if (!c)
          return !0;
        const [, , ...a] = c.actual;
        return Qn(s, a);
      });
    }
  }
  getConnectionStateObservable() {
    return this.connectionState$.asObservable();
  }
  getErrorObservable() {
    return this.error$.asObservable();
  }
  ensureReq(e, n) {
    var i, s;
    const r = e[1];
    if (this.connectionState === "terminated" || !this.read || !(n != null && n.overwrite) && ((i = this.reqs.get(r)) != null && i.isOngoing || this.reqs.has(r) && !Bn(r, this.reqs, this.maxConcurrentReqs)))
      return;
    const o = es(e);
    if (this.reqs.set(r, {
      original: e,
      actual: o,
      isOngoing: !1
    }), Bn(r, this.reqs, this.maxConcurrentReqs)) {
      const c = this.reqs.get(r);
      c && ((s = this.socket) == null ? void 0 : s.readyState) === WebSocket.OPEN && (c.isOngoing = !0, this.socket.send(JSON.stringify(o)));
    }
  }
  ensureReqs() {
    const e = Array.from(this.reqs.values()).slice(
      0,
      this.maxConcurrentReqs ?? void 0
    );
    for (const n of e)
      this.ensureReq(n.original);
  }
  finalizeReq(e) {
    var r;
    if (this.connectionState === "terminated")
      return;
    const n = this.reqs.get(e);
    if (n && (this.reqs.delete(e), n.isOngoing)) {
      if (((r = this.socket) == null ? void 0 : r.readyState) === WebSocket.OPEN) {
        const o = ["CLOSE", e];
        this.socket.send(JSON.stringify(o));
      }
      this.ensureReqs();
    }
  }
  finalizeAllReqs() {
    var e;
    if (this.connectionState !== "terminated") {
      for (const n of this.reqs.keys())
        if (((e = this.socket) == null ? void 0 : e.readyState) === WebSocket.OPEN) {
          const r = ["CLOSE", n];
          this.socket.send(JSON.stringify(r));
        }
      this.reqs.clear();
    }
  }
  sendEVENT(e) {
    var n, r;
    if (this.connectionState !== "terminated" && this.write)
      if (((n = this.socket) == null ? void 0 : n.readyState) === WebSocket.OPEN)
        this.socket.send(JSON.stringify(e));
      else if (((r = this.socket) == null ? void 0 : r.readyState) === WebSocket.CONNECTING)
        this.queuedEvents.push(e);
      else {
        const o = new WebSocket(this.url);
        o.addEventListener("open", () => {
          o.send(JSON.stringify(e));
        }), o.addEventListener("message", ({ data: i }) => {
          try {
            const s = JSON.parse(i);
            s[0] === "OK" && o.close(), this.message$.next({ from: this.url, message: s });
          } catch (s) {
            this.message$.error(s);
          }
        }), setTimeout(() => {
          (o.readyState === WebSocket.OPEN || o.readyState === WebSocket.CONNECTING) && o.close();
        }, 10 * 1e3);
      }
  }
  dispose() {
    var e;
    this.finalizeAllReqs(), this.setConnectionState("terminated"), (e = this.socket) == null || e.close($e.DISPOSED_BY_RX_NOSTR), this.socket = null, this.reqs.clear(), this.message$.complete(), this.message$.unsubscribe(), this.connectionState$.complete(), this.connectionState$.unsubscribe(), this.error$.complete(), this.error$.unsubscribe();
  }
}
const $e = {
  /**
   * 1006 is a reserved value and MUST NOT be set as a status code in a
   * Close control frame by an endpoint.  It is designated for use in
   * applications expecting a status code to indicate that the
   * connection was closed abnormally, e.g., without sending or
   * receiving a Close control frame.
   *
   * See also: https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
   */
  ABNORMAL_CLOSURE: 1006,
  /**
   * When a websocket is closed by the relay with a status code 4000
   * that means the client shouldn't try to connect again.
   *
   * See also: https://github.com/nostr-protocol/nips/blob/fab6a21a779460f696f11169ddf343b437327592/01.md?plain=1#L113
   */
  DONT_RETRY: 4e3,
  /** @internal rx-nostr uses it internally. */
  DESIRED_BY_RX_NOSTR: 4537,
  /** @internal rx-nostr uses it internally. */
  DISPOSED_BY_RX_NOSTR: 4538
};
function Ji(t, e) {
  if (t.strategy === "exponential") {
    const n = Math.max(
      t.initialDelay * 2 ** (e - 1) + (Math.random() - 0.5) * 1e3,
      1e3
    );
    return rt(n);
  } else
    return t.strategy === "linear" ? rt(t.interval) : t.strategy === "immediately" ? ie(0) : be;
}
function es([t, e, ...n]) {
  return [t, e, ...On(n)];
}
function Bn(t, e, n) {
  if (n === null)
    return !0;
  const r = Array.from(e.keys()).findIndex((o) => o === t);
  return r === void 0 ? !1 : r < n;
}
class St extends Error {
  constructor(e) {
    super(`WebSocket Error: Socket was closed with code ${e}`), this.code = e;
  }
}
function Rs(t) {
  return new os(t);
}
const ts = Me({
  retry: {
    strategy: "exponential",
    maxCount: 5,
    initialDelay: 1e3
  },
  timeout: 1e4,
  globalRelayConfig: void 0
}), ns = Me({
  scope: void 0
}), rs = Me({
  scope: void 0,
  seckey: void 0
});
class os {
  constructor(e) {
    C(this, "options");
    C(this, "connections", /* @__PURE__ */ new Map());
    C(this, "ongoings", /* @__PURE__ */ new Map());
    C(this, "messageIn$", new K());
    C(this, "error$", new K());
    C(this, "status$", new K());
    C(this, "globalEventPacketPipe", null);
    C(this, "disposed", !1);
    const n = ts(e);
    this.options = {
      ...n
    };
  }
  get messageOut$() {
    return this.messageIn$.pipe(
      ve((e) => {
        const n = this.globalEventPacketPipe;
        if (!n)
          return ie(e);
        const r = e.message;
        return r[0] !== "EVENT" ? ie(e) : ie({
          from: e.from,
          subId: r[1],
          event: r[2]
        }).pipe(
          n,
          te(
            ({ from: o, subId: i, event: s }) => ({
              from: o,
              message: ["EVENT", i, s]
            })
          )
        );
      })
    );
  }
  getRelays() {
    return Array.from(this.connections.values()).map(
      ({ url: e, read: n, write: r }) => ({
        url: e,
        read: n,
        write: r
      })
    );
  }
  createConnection({
    url: e,
    read: n,
    write: r,
    disableAutoFetchNip11Limitations: o
  }) {
    var s, c;
    const i = new Xi(e, {
      backoff: this.options.retry,
      read: n,
      write: r,
      disableAutoFetchNip11Limitations: o ?? ((s = this.options.globalRelayConfig) == null ? void 0 : s.disableAutoFetchNip11Limitations),
      maxConcurrentReqsFallback: (c = this.options.globalRelayConfig) == null ? void 0 : c.maxConcurrentReqsFallback
    });
    return i.getConnectionStateObservable().subscribe((a) => {
      this.status$.next({
        from: e,
        state: a
      });
    }), i.getErrorObservable().subscribe((a) => {
      this.error$.next({ from: e, reason: a });
    }), i.getMessageObservable().pipe(
      en((a) => (this.error$.next({ from: e, reason: a }), be))
    ).subscribe((a) => {
      this.messageIn$.next(a);
    }), i;
  }
  async switchRelays(e) {
    const n = /* @__PURE__ */ new Map();
    for (const { url: i, read: s, write: c } of o(e)) {
      const a = this.connections.get(i);
      this.connections.delete(i), a ? (a.read = s, a.write = c, n.set(i, a)) : n.set(i, this.createConnection({ url: i, read: s, write: c }));
    }
    for (const i of this.connections.values())
      i.dispose();
    const r = [];
    for (const i of n.values())
      i.read ? r.push(i.start()) : i.stop();
    if (await Promise.all(r), this.connections = n, this.disposed) {
      for (const i of this.connections.values())
        i.dispose();
      return;
    }
    for (const { req: i, scope: s } of this.ongoings.values())
      this.ensureReq(i, { scope: s });
    function o(i) {
      return Array.isArray(i) ? i.map((s) => {
        const c = typeof s == "string" ? {
          url: s,
          read: !0,
          write: !0
        } : s;
        return c.url = ee(c.url), c;
      }) : Object.entries(i).map(([s, c]) => ({
        url: ee(s),
        ...c
      }));
    }
  }
  async addRelay(e) {
    await this.switchRelays([...this.getRelays(), e]);
  }
  async removeRelay(e) {
    const n = ee(e), r = this.getRelays(), o = r.filter((i) => i.url !== n);
    r.length !== o.length && await this.switchRelays(o);
  }
  hasRelay(e) {
    const n = ee(e);
    return this.getRelays().some((r) => r.url === n);
  }
  canWriteRelay(e) {
    const n = ee(e);
    return this.getRelays().some((r) => r.url === n && r.write);
  }
  canReadRelay(e) {
    const n = ee(e);
    return this.getRelays().some((r) => r.url === n && r.read);
  }
  async fetchAllRelaysInfo() {
    const e = await Promise.all(
      Array.from(this.connections.keys()).map(
        async (n) => [
          n,
          await Xn(n).catch(() => null)
        ]
      )
    );
    return Object.fromEntries(e);
  }
  getAllRelayState() {
    return Object.fromEntries(
      Array.from(this.connections.values()).map((e) => [
        e.url,
        this.getRelayState(e.url)
      ])
    );
  }
  getRelayState(e) {
    const n = this.connections.get(ee(e));
    if (!n)
      throw new Error("RelayConfig not found");
    return (n == null ? void 0 : n.getConnectionState()) ?? "not-started";
  }
  reconnect(e) {
    var n;
    this.canReadRelay(e) && ((n = this.connections.get(ee(e))) == null || n.start());
  }
  setGlobalEventPacketPipe(e) {
    this.globalEventPacketPipe = e;
  }
  use(e, n) {
    const { scope: r } = ns(n), o = r == null ? void 0 : r.map(ee), i = this.options.timeout, s = e.strategy, c = e.rxReqId, a = this.messageOut$, u = this.ongoings, f = this.getAllRelayState.bind(this), l = this.createConnectionStateObservable.bind(this), p = this.ensureReq.bind(this), w = this.finalizeReq.bind(this), d = e.getReqObservable().pipe(
      ne((S) => S !== null),
      s === "oneshot" ? Ui() : ce,
      h(),
      s === "forward" ? y() : ce,
      Ie((S) => {
        p(S, { overwrite: s === "forward", scope: o });
      }),
      te(([, S]) => S)
    );
    if (s === "forward") {
      const S = At({
        rxReqId: c
      }), x = [], v = new K();
      return x.push(v), v.pipe(
        Ie({
          subscribe: () => {
            x.push(d.subscribe()), x.push(
              a.pipe(m(S), I()).subscribe((A) => {
                v.next(A);
              })
            );
          },
          finalize: () => {
            for (const A of x)
              A.unsubscribe();
            w({ subId: S });
          }
        })
      );
    } else
      return d.pipe(te(g), ht());
    function h() {
      const S = (x) => At({ rxReqId: c, index: x });
      switch (s) {
        case "backward":
          return te((x, v) => ["REQ", S(v), ...x]);
        case "forward":
        case "oneshot":
          return te((x) => ["REQ", S(), ...x]);
      }
    }
    function y() {
      const S = (v) => {
        const A = v[1];
        u.set(A, {
          req: v,
          scope: o
        });
      }, x = (v) => {
        u.delete(v);
      };
      return Ie({
        next: (v) => {
          S(v);
        },
        finalize: () => {
          x(
            At({
              rxReqId: c
            })
          );
        }
      });
    }
    function g(S) {
      const x = new K(), v = new K(), A = /* @__PURE__ */ new Set(), R = Ri(
        x,
        l()
      ).subscribe(() => {
        const q = f();
        Object.entries(q).every(
          ([O, j]) => o && !o.includes(O) || j === "error" || j === "terminated" || j === "ongoing" && A.has(O)
        ) && v.next();
      });
      return a.pipe(
        ji(v),
        Wi(i),
        m(S),
        ne((q) => !A.has(q.from)),
        Ie((q) => {
          q.message[0] === "EOSE" && (A.add(q.from), w({ subId: S, url: q.from }), x.next());
        }),
        I(),
        Rn(() => {
          w({ subId: S }), v.unsubscribe(), x.unsubscribe(), R.unsubscribe();
        })
      );
    }
    function m(S) {
      return ne(
        (x) => (x.message[0] === "EVENT" || x.message[0] === "EOSE") && x.message[1] === S
      );
    }
    function I() {
      return ve(
        ({ from: S, message: x }) => x[0] === "EVENT" ? ie({ from: S, subId: x[1], event: x[2] }) : be
      );
    }
  }
  createAllEventObservable() {
    return this.messageOut$.pipe(
      ve(
        ({ from: e, message: n }) => n[0] === "EVENT" ? ie({ from: e, subId: n[1], event: n[2] }) : be
      )
    );
  }
  createAllErrorObservable() {
    return this.error$.asObservable();
  }
  createAllMessageObservable() {
    return this.messageOut$;
  }
  createConnectionStateObservable() {
    return this.status$.asObservable();
  }
  send(e, n) {
    const { seckey: r, scope: o } = rs(n), i = o == null ? void 0 : o.map(ee), s = Array.from(this.connections.values()).filter(
      (u) => (!i || i.includes(u.url)) && u.write
    ), c = new ri(s.length);
    let a = null;
    return Co(e, r).then((u) => {
      c.closed || (a = this.createAllMessageObservable().subscribe(
        ({ from: f, message: l }) => {
          l[0] === "OK" && c.next({
            from: f,
            id: u.id,
            ok: l[2]
          });
        }
      ));
      for (const f of s)
        f.sendEVENT(["EVENT", u]);
    }), c.pipe(
      ot(s.length),
      Ar(30 * 1e3),
      Rn(() => {
        c.complete(), c.unsubscribe(), a == null || a.unsubscribe();
      })
    );
  }
  dispose() {
    this.disposed = !0, this.messageIn$.complete(), this.error$.complete();
    for (const e of this.connections.values())
      e.dispose();
  }
  ensureReq(e, n) {
    const r = n == null ? void 0 : n.scope;
    for (const o of this.connections.keys()) {
      const i = this.connections.get(o);
      !i || !i.read || r && !r.includes(o) || i.ensureReq(e, { overwrite: n == null ? void 0 : n.overwrite });
    }
  }
  finalizeReq(e) {
    const { subId: n, url: r } = e;
    if (n === void 0 && r === void 0)
      throw new Error();
    if (r) {
      const o = this.connections.get(r);
      o == null || o.finalizeReq(n);
    } else
      for (const o of this.connections.values())
        o == null || o.finalizeReq(n);
  }
}
function At(t) {
  return `${t.rxReqId}:${t.index ?? 0}`;
}
export {
  vs as batch,
  ms as chunk,
  Fe as compareEvents,
  Wi as completeOnTimeout,
  Es as createRxBackwardReq,
  xs as createRxForwardReq,
  Rs as createRxNostr,
  Ss as createRxOneshotReq,
  ls as createUniq,
  as as earlierEvent,
  On as evalFilters,
  Is as extend,
  Xn as fetchRelayInfo,
  ys as filterBy,
  ps as filterKind,
  bs as filterType,
  Gn as getEventHash,
  mn as getPublicKey,
  Po as getSignature,
  Co as getSignedEvent,
  Qn as isFiltered,
  us as laterEvent,
  zi as latest,
  hs as latestEach,
  As as mixin,
  ss as now,
  Di as sort,
  ws as sortEvents,
  gs as timeline,
  gt as toHex,
  fs as uniq,
  ds as verify
};
//# sourceMappingURL=index.es.js.map
