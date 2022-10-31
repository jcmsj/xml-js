function vt(a) {
  var n = a.default;
  if (typeof n == "function") {
    var c = function() {
      return n.apply(this, arguments);
    };
    c.prototype = n.prototype;
  } else
    c = {};
  return Object.defineProperty(c, "__esModule", { value: !0 }), Object.keys(a).forEach(function(s) {
    var l = Object.getOwnPropertyDescriptor(a, s);
    Object.defineProperty(c, s, l.get ? l : {
      enumerable: !0,
      get: function() {
        return a[s];
      }
    });
  }), c;
}
var it = {};
const St = {}, wt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: St
}, Symbol.toStringTag, { value: "Module" })), Kt = /* @__PURE__ */ vt(wt);
(function(a) {
  (function(n) {
    n.parser = function(e, t) {
      return new s(e, t);
    }, n.SAXParser = s, n.SAXStream = S, n.createStream = gt, n.MAX_BUFFER_LENGTH = 64 * 1024;
    var c = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    n.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function s(e, t) {
      if (!(this instanceof s))
        return new s(e, t);
      var o = this;
      m(o), o.q = o.c = "", o.bufferCheckPosition = n.MAX_BUFFER_LENGTH, o.opt = t || {}, o.opt.lowercase = o.opt.lowercase || o.opt.lowercasetags, o.looseCase = o.opt.lowercase ? "toLowerCase" : "toUpperCase", o.tags = [], o.closed = o.closedRoot = o.sawRoot = !1, o.tag = o.error = null, o.strict = !!e, o.noscript = !!(e || o.opt.noscript), o.state = r.BEGIN, o.strictEntities = o.opt.strictEntities, o.ENTITIES = o.strictEntities ? Object.create(n.XML_ENTITIES) : Object.create(n.ENTITIES), o.attribList = [], o.opt.xmlns && (o.ns = Object.create(At)), o.trackPosition = o.opt.position !== !1, o.trackPosition && (o.position = o.line = o.column = 0), L(o, "onready");
    }
    Object.create || (Object.create = function(e) {
      function t() {
      }
      t.prototype = e;
      var o = new t();
      return o;
    }), Object.keys || (Object.keys = function(e) {
      var t = [];
      for (var o in e)
        e.hasOwnProperty(o) && t.push(o);
      return t;
    });
    function l(e) {
      for (var t = Math.max(n.MAX_BUFFER_LENGTH, 10), o = 0, i = 0, d = c.length; i < d; i++) {
        var N = e[c[i]].length;
        if (N > t)
          switch (c[i]) {
            case "textNode":
              U(e);
              break;
            case "cdata":
              y(e, "oncdata", e.cdata), e.cdata = "";
              break;
            case "script":
              y(e, "onscript", e.script), e.script = "";
              break;
            default:
              V(e, "Max buffer length exceeded: " + c[i]);
          }
        o = Math.max(o, N);
      }
      var A = n.MAX_BUFFER_LENGTH - o;
      e.bufferCheckPosition = A + e.position;
    }
    function m(e) {
      for (var t = 0, o = c.length; t < o; t++)
        e[c[t]] = "";
    }
    function T(e) {
      U(e), e.cdata !== "" && (y(e, "oncdata", e.cdata), e.cdata = ""), e.script !== "" && (y(e, "onscript", e.script), e.script = "");
    }
    s.prototype = {
      end: function() {
        $(this);
      },
      write: Ct,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        T(this);
      }
    };
    var E;
    try {
      E = ReadableStream;
    } catch {
      E = function() {
      };
    }
    var z = n.EVENTS.filter(function(e) {
      return e !== "error" && e !== "end";
    });
    function gt(e, t) {
      return new S(e, t);
    }
    function S(e, t) {
      if (!(this instanceof S))
        return new S(e, t);
      E.apply(this), this._parser = new s(e, t), this.writable = !0, this.readable = !0;
      var o = this;
      this._parser.onend = function() {
        o.emit("end");
      }, this._parser.onerror = function(i) {
        o.emit("error", i), o._parser.error = null;
      }, this._decoder = null, z.forEach(function(i) {
        Object.defineProperty(o, "on" + i, {
          get: function() {
            return o._parser["on" + i];
          },
          set: function(d) {
            if (!d)
              return o.removeAllListeners(i), o._parser["on" + i] = d, d;
            o.on(i, d);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    S.prototype = Object.create(E.prototype, {
      constructor: {
        value: S
      }
    }), S.prototype.write = function(e) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(e)) {
        if (!this._decoder) {
          var t = Kt.StringDecoder;
          this._decoder = new t("utf8");
        }
        e = this._decoder.write(e);
      }
      return this._parser.write(e.toString()), this.emit("data", e), !0;
    }, S.prototype.end = function(e) {
      return e && e.length && this.write(e), this._parser.end(), !0;
    }, S.prototype.on = function(e, t) {
      var o = this;
      return !o._parser["on" + e] && z.indexOf(e) !== -1 && (o._parser["on" + e] = function() {
        var i = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        i.splice(0, 0, e), o.emit.apply(o, i);
      }), E.prototype.on.call(o, e, t);
    };
    var yt = "[CDATA[", Nt = "DOCTYPE", j = "http://www.w3.org/XML/1998/namespace", Y = "http://www.w3.org/2000/xmlns/", At = { xml: j, xmlns: Y }, B = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, X = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, _t = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, bt = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function h(e) {
      return e === " " || e === `
` || e === "\r" || e === "	";
    }
    function M(e) {
      return e === '"' || e === "'";
    }
    function Ft(e) {
      return e === ">" || h(e);
    }
    function w(e, t) {
      return e.test(t);
    }
    function It(e, t) {
      return !w(e, t);
    }
    var r = 0;
    n.STATE = {
      BEGIN: r++,
      BEGIN_WHITESPACE: r++,
      TEXT: r++,
      TEXT_ENTITY: r++,
      OPEN_WAKA: r++,
      SGML_DECL: r++,
      SGML_DECL_QUOTED: r++,
      DOCTYPE: r++,
      DOCTYPE_QUOTED: r++,
      DOCTYPE_DTD: r++,
      DOCTYPE_DTD_QUOTED: r++,
      COMMENT_STARTING: r++,
      COMMENT: r++,
      COMMENT_ENDING: r++,
      COMMENT_ENDED: r++,
      CDATA: r++,
      CDATA_ENDING: r++,
      CDATA_ENDING_2: r++,
      PROC_INST: r++,
      PROC_INST_BODY: r++,
      PROC_INST_ENDING: r++,
      OPEN_TAG: r++,
      OPEN_TAG_SLASH: r++,
      ATTRIB: r++,
      ATTRIB_NAME: r++,
      ATTRIB_NAME_SAW_WHITE: r++,
      ATTRIB_VALUE: r++,
      ATTRIB_VALUE_QUOTED: r++,
      ATTRIB_VALUE_CLOSED: r++,
      ATTRIB_VALUE_UNQUOTED: r++,
      ATTRIB_VALUE_ENTITY_Q: r++,
      ATTRIB_VALUE_ENTITY_U: r++,
      CLOSE_TAG: r++,
      CLOSE_TAG_SAW_WHITE: r++,
      SCRIPT: r++,
      SCRIPT_ENDING: r++
    }, n.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, n.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(n.ENTITIES).forEach(function(e) {
      var t = n.ENTITIES[e], o = typeof t == "number" ? String.fromCharCode(t) : t;
      n.ENTITIES[e] = o;
    });
    for (var J in n.STATE)
      n.STATE[n.STATE[J]] = J;
    r = n.STATE;
    function L(e, t, o) {
      e[t] && e[t](o);
    }
    function y(e, t, o) {
      e.textNode && U(e), L(e, t, o);
    }
    function U(e) {
      e.textNode = Z(e.opt, e.textNode), e.textNode && L(e, "ontext", e.textNode), e.textNode = "";
    }
    function Z(e, t) {
      return e.trim && (t = t.trim()), e.normalize && (t = t.replace(/\s+/g, " ")), t;
    }
    function V(e, t) {
      return U(e), e.trackPosition && (t += `
Line: ` + e.line + `
Column: ` + e.column + `
Char: ` + e.c), t = new Error(t), e.error = t, L(e, "onerror", t), e;
    }
    function $(e) {
      return e.sawRoot && !e.closedRoot && g(e, "Unclosed root tag"), e.state !== r.BEGIN && e.state !== r.BEGIN_WHITESPACE && e.state !== r.TEXT && V(e, "Unexpected end"), U(e), e.c = "", e.closed = !0, L(e, "onend"), s.call(e, e.strict, e.opt), e;
    }
    function g(e, t) {
      if (typeof e != "object" || !(e instanceof s))
        throw new Error("bad call to strictFail");
      e.strict && V(e, t);
    }
    function ht(e) {
      e.strict || (e.tagName = e.tagName[e.looseCase]());
      var t = e.tags[e.tags.length - 1] || e, o = e.tag = { name: e.tagName, attributes: {} };
      e.opt.xmlns && (o.ns = t.ns), e.attribList.length = 0, y(e, "onopentagstart", o);
    }
    function q(e, t) {
      var o = e.indexOf(":"), i = o < 0 ? ["", e] : e.split(":"), d = i[0], N = i[1];
      return t && e === "xmlns" && (d = "xmlns", N = ""), { prefix: d, local: N };
    }
    function H(e) {
      if (e.strict || (e.attribName = e.attribName[e.looseCase]()), e.attribList.indexOf(e.attribName) !== -1 || e.tag.attributes.hasOwnProperty(e.attribName)) {
        e.attribName = e.attribValue = "";
        return;
      }
      if (e.opt.xmlns) {
        var t = q(e.attribName, !0), o = t.prefix, i = t.local;
        if (o === "xmlns")
          if (i === "xml" && e.attribValue !== j)
            g(
              e,
              "xml: prefix must be bound to " + j + `
Actual: ` + e.attribValue
            );
          else if (i === "xmlns" && e.attribValue !== Y)
            g(
              e,
              "xmlns: prefix must be bound to " + Y + `
Actual: ` + e.attribValue
            );
          else {
            var d = e.tag, N = e.tags[e.tags.length - 1] || e;
            d.ns === N.ns && (d.ns = Object.create(N.ns)), d.ns[i] = e.attribValue;
          }
        e.attribList.push([e.attribName, e.attribValue]);
      } else
        e.tag.attributes[e.attribName] = e.attribValue, y(e, "onattribute", {
          name: e.attribName,
          value: e.attribValue
        });
      e.attribName = e.attribValue = "";
    }
    function R(e, t) {
      if (e.opt.xmlns) {
        var o = e.tag, i = q(e.tagName);
        o.prefix = i.prefix, o.local = i.local, o.uri = o.ns[i.prefix] || "", o.prefix && !o.uri && (g(e, "Unbound namespace prefix: " + JSON.stringify(e.tagName)), o.uri = i.prefix);
        var d = e.tags[e.tags.length - 1] || e;
        o.ns && d.ns !== o.ns && Object.keys(o.ns).forEach(function(at) {
          y(e, "onopennamespace", {
            prefix: at,
            uri: o.ns[at]
          });
        });
        for (var N = 0, A = e.attribList.length; N < A; N++) {
          var D = e.attribList[N], O = D[0], x = D[1], _ = q(O, !0), K = _.prefix, Ot = _.local, nt = K === "" ? "" : o.ns[K] || "", W = {
            name: O,
            value: x,
            prefix: K,
            local: Ot,
            uri: nt
          };
          K && K !== "xmlns" && !nt && (g(e, "Unbound namespace prefix: " + JSON.stringify(K)), W.uri = K), e.tag.attributes[O] = W, y(e, "onattribute", W);
        }
        e.attribList.length = 0;
      }
      e.tag.isSelfClosing = !!t, e.sawRoot = !0, e.tags.push(e.tag), y(e, "onopentag", e.tag), t || (!e.noscript && e.tagName.toLowerCase() === "script" ? e.state = r.SCRIPT : e.state = r.TEXT, e.tag = null, e.tagName = ""), e.attribName = e.attribValue = "", e.attribList.length = 0;
    }
    function Q(e) {
      if (!e.tagName) {
        g(e, "Weird empty close tag."), e.textNode += "</>", e.state = r.TEXT;
        return;
      }
      if (e.script) {
        if (e.tagName !== "script") {
          e.script += "</" + e.tagName + ">", e.tagName = "", e.state = r.SCRIPT;
          return;
        }
        y(e, "onscript", e.script), e.script = "";
      }
      var t = e.tags.length, o = e.tagName;
      e.strict || (o = o[e.looseCase]());
      for (var i = o; t--; ) {
        var d = e.tags[t];
        if (d.name !== i)
          g(e, "Unexpected close tag");
        else
          break;
      }
      if (t < 0) {
        g(e, "Unmatched closing tag: " + e.tagName), e.textNode += "</" + e.tagName + ">", e.state = r.TEXT;
        return;
      }
      e.tagName = o;
      for (var N = e.tags.length; N-- > t; ) {
        var A = e.tag = e.tags.pop();
        e.tagName = e.tag.name, y(e, "onclosetag", e.tagName);
        var D = {};
        for (var O in A.ns)
          D[O] = A.ns[O];
        var x = e.tags[e.tags.length - 1] || e;
        e.opt.xmlns && A.ns !== x.ns && Object.keys(A.ns).forEach(function(_) {
          var K = A.ns[_];
          y(e, "onclosenamespace", { prefix: _, uri: K });
        });
      }
      t === 0 && (e.closedRoot = !0), e.tagName = e.attribValue = e.attribName = "", e.attribList.length = 0, e.state = r.TEXT;
    }
    function Dt(e) {
      var t = e.entity, o = t.toLowerCase(), i, d = "";
      return e.ENTITIES[t] ? e.ENTITIES[t] : e.ENTITIES[o] ? e.ENTITIES[o] : (t = o, t.charAt(0) === "#" && (t.charAt(1) === "x" ? (t = t.slice(2), i = parseInt(t, 16), d = i.toString(16)) : (t = t.slice(1), i = parseInt(t, 10), d = i.toString(10))), t = t.replace(/^0+/, ""), isNaN(i) || d.toLowerCase() !== t ? (g(e, "Invalid character entity"), "&" + e.entity + ";") : String.fromCodePoint(i));
    }
    function tt(e, t) {
      t === "<" ? (e.state = r.OPEN_WAKA, e.startTagPosition = e.position) : h(t) || (g(e, "Non-whitespace before first tag."), e.textNode = t, e.state = r.TEXT);
    }
    function et(e, t) {
      var o = "";
      return t < e.length && (o = e.charAt(t)), o;
    }
    function Ct(e) {
      var t = this;
      if (this.error)
        throw this.error;
      if (t.closed)
        return V(
          t,
          "Cannot write after close. Assign an onready handler."
        );
      if (e === null)
        return $(t);
      typeof e == "object" && (e = e.toString());
      for (var o = 0, i = ""; i = et(e, o++), t.c = i, !!i; )
        switch (t.trackPosition && (t.position++, i === `
` ? (t.line++, t.column = 0) : t.column++), t.state) {
          case r.BEGIN:
            if (t.state = r.BEGIN_WHITESPACE, i === "\uFEFF")
              continue;
            tt(t, i);
            continue;
          case r.BEGIN_WHITESPACE:
            tt(t, i);
            continue;
          case r.TEXT:
            if (t.sawRoot && !t.closedRoot) {
              for (var d = o - 1; i && i !== "<" && i !== "&"; )
                i = et(e, o++), i && t.trackPosition && (t.position++, i === `
` ? (t.line++, t.column = 0) : t.column++);
              t.textNode += e.substring(d, o - 1);
            }
            i === "<" && !(t.sawRoot && t.closedRoot && !t.strict) ? (t.state = r.OPEN_WAKA, t.startTagPosition = t.position) : (!h(i) && (!t.sawRoot || t.closedRoot) && g(t, "Text data outside of root node."), i === "&" ? t.state = r.TEXT_ENTITY : t.textNode += i);
            continue;
          case r.SCRIPT:
            i === "<" ? t.state = r.SCRIPT_ENDING : t.script += i;
            continue;
          case r.SCRIPT_ENDING:
            i === "/" ? t.state = r.CLOSE_TAG : (t.script += "<" + i, t.state = r.SCRIPT);
            continue;
          case r.OPEN_WAKA:
            if (i === "!")
              t.state = r.SGML_DECL, t.sgmlDecl = "";
            else if (!h(i))
              if (w(B, i))
                t.state = r.OPEN_TAG, t.tagName = i;
              else if (i === "/")
                t.state = r.CLOSE_TAG, t.tagName = "";
              else if (i === "?")
                t.state = r.PROC_INST, t.procInstName = t.procInstBody = "";
              else {
                if (g(t, "Unencoded <"), t.startTagPosition + 1 < t.position) {
                  var N = t.position - t.startTagPosition;
                  i = new Array(N).join(" ") + i;
                }
                t.textNode += "<" + i, t.state = r.TEXT;
              }
            continue;
          case r.SGML_DECL:
            (t.sgmlDecl + i).toUpperCase() === yt ? (y(t, "onopencdata"), t.state = r.CDATA, t.sgmlDecl = "", t.cdata = "") : t.sgmlDecl + i === "--" ? (t.state = r.COMMENT, t.comment = "", t.sgmlDecl = "") : (t.sgmlDecl + i).toUpperCase() === Nt ? (t.state = r.DOCTYPE, (t.doctype || t.sawRoot) && g(
              t,
              "Inappropriately located doctype declaration"
            ), t.doctype = "", t.sgmlDecl = "") : i === ">" ? (y(t, "onsgmldeclaration", t.sgmlDecl), t.sgmlDecl = "", t.state = r.TEXT) : (M(i) && (t.state = r.SGML_DECL_QUOTED), t.sgmlDecl += i);
            continue;
          case r.SGML_DECL_QUOTED:
            i === t.q && (t.state = r.SGML_DECL, t.q = ""), t.sgmlDecl += i;
            continue;
          case r.DOCTYPE:
            i === ">" ? (t.state = r.TEXT, y(t, "ondoctype", t.doctype), t.doctype = !0) : (t.doctype += i, i === "[" ? t.state = r.DOCTYPE_DTD : M(i) && (t.state = r.DOCTYPE_QUOTED, t.q = i));
            continue;
          case r.DOCTYPE_QUOTED:
            t.doctype += i, i === t.q && (t.q = "", t.state = r.DOCTYPE);
            continue;
          case r.DOCTYPE_DTD:
            t.doctype += i, i === "]" ? t.state = r.DOCTYPE : M(i) && (t.state = r.DOCTYPE_DTD_QUOTED, t.q = i);
            continue;
          case r.DOCTYPE_DTD_QUOTED:
            t.doctype += i, i === t.q && (t.state = r.DOCTYPE_DTD, t.q = "");
            continue;
          case r.COMMENT:
            i === "-" ? t.state = r.COMMENT_ENDING : t.comment += i;
            continue;
          case r.COMMENT_ENDING:
            i === "-" ? (t.state = r.COMMENT_ENDED, t.comment = Z(t.opt, t.comment), t.comment && y(t, "oncomment", t.comment), t.comment = "") : (t.comment += "-" + i, t.state = r.COMMENT);
            continue;
          case r.COMMENT_ENDED:
            i !== ">" ? (g(t, "Malformed comment"), t.comment += "--" + i, t.state = r.COMMENT) : t.state = r.TEXT;
            continue;
          case r.CDATA:
            i === "]" ? t.state = r.CDATA_ENDING : t.cdata += i;
            continue;
          case r.CDATA_ENDING:
            i === "]" ? t.state = r.CDATA_ENDING_2 : (t.cdata += "]" + i, t.state = r.CDATA);
            continue;
          case r.CDATA_ENDING_2:
            i === ">" ? (t.cdata && y(t, "oncdata", t.cdata), y(t, "onclosecdata"), t.cdata = "", t.state = r.TEXT) : i === "]" ? t.cdata += "]" : (t.cdata += "]]" + i, t.state = r.CDATA);
            continue;
          case r.PROC_INST:
            i === "?" ? t.state = r.PROC_INST_ENDING : h(i) ? t.state = r.PROC_INST_BODY : t.procInstName += i;
            continue;
          case r.PROC_INST_BODY:
            if (!t.procInstBody && h(i))
              continue;
            i === "?" ? t.state = r.PROC_INST_ENDING : t.procInstBody += i;
            continue;
          case r.PROC_INST_ENDING:
            i === ">" ? (y(t, "onprocessinginstruction", {
              name: t.procInstName,
              body: t.procInstBody
            }), t.procInstName = t.procInstBody = "", t.state = r.TEXT) : (t.procInstBody += "?" + i, t.state = r.PROC_INST_BODY);
            continue;
          case r.OPEN_TAG:
            w(X, i) ? t.tagName += i : (ht(t), i === ">" ? R(t) : i === "/" ? t.state = r.OPEN_TAG_SLASH : (h(i) || g(t, "Invalid character in tag name"), t.state = r.ATTRIB));
            continue;
          case r.OPEN_TAG_SLASH:
            i === ">" ? (R(t, !0), Q(t)) : (g(t, "Forward-slash in opening tag not followed by >"), t.state = r.ATTRIB);
            continue;
          case r.ATTRIB:
            if (h(i))
              continue;
            i === ">" ? R(t) : i === "/" ? t.state = r.OPEN_TAG_SLASH : w(B, i) ? (t.attribName = i, t.attribValue = "", t.state = r.ATTRIB_NAME) : g(t, "Invalid attribute name");
            continue;
          case r.ATTRIB_NAME:
            i === "=" ? t.state = r.ATTRIB_VALUE : i === ">" ? (g(t, "Attribute without value"), t.attribValue = t.attribName, H(t), R(t)) : h(i) ? t.state = r.ATTRIB_NAME_SAW_WHITE : w(X, i) ? t.attribName += i : g(t, "Invalid attribute name");
            continue;
          case r.ATTRIB_NAME_SAW_WHITE:
            if (i === "=")
              t.state = r.ATTRIB_VALUE;
            else {
              if (h(i))
                continue;
              g(t, "Attribute without value"), t.tag.attributes[t.attribName] = "", t.attribValue = "", y(t, "onattribute", {
                name: t.attribName,
                value: ""
              }), t.attribName = "", i === ">" ? R(t) : w(B, i) ? (t.attribName = i, t.state = r.ATTRIB_NAME) : (g(t, "Invalid attribute name"), t.state = r.ATTRIB);
            }
            continue;
          case r.ATTRIB_VALUE:
            if (h(i))
              continue;
            M(i) ? (t.q = i, t.state = r.ATTRIB_VALUE_QUOTED) : (g(t, "Unquoted attribute value"), t.state = r.ATTRIB_VALUE_UNQUOTED, t.attribValue = i);
            continue;
          case r.ATTRIB_VALUE_QUOTED:
            if (i !== t.q) {
              i === "&" ? t.state = r.ATTRIB_VALUE_ENTITY_Q : t.attribValue += i;
              continue;
            }
            H(t), t.q = "", t.state = r.ATTRIB_VALUE_CLOSED;
            continue;
          case r.ATTRIB_VALUE_CLOSED:
            h(i) ? t.state = r.ATTRIB : i === ">" ? R(t) : i === "/" ? t.state = r.OPEN_TAG_SLASH : w(B, i) ? (g(t, "No whitespace between attributes"), t.attribName = i, t.attribValue = "", t.state = r.ATTRIB_NAME) : g(t, "Invalid attribute name");
            continue;
          case r.ATTRIB_VALUE_UNQUOTED:
            if (!Ft(i)) {
              i === "&" ? t.state = r.ATTRIB_VALUE_ENTITY_U : t.attribValue += i;
              continue;
            }
            H(t), i === ">" ? R(t) : t.state = r.ATTRIB;
            continue;
          case r.CLOSE_TAG:
            if (t.tagName)
              i === ">" ? Q(t) : w(X, i) ? t.tagName += i : t.script ? (t.script += "</" + t.tagName, t.tagName = "", t.state = r.SCRIPT) : (h(i) || g(t, "Invalid tagname in closing tag"), t.state = r.CLOSE_TAG_SAW_WHITE);
            else {
              if (h(i))
                continue;
              It(B, i) ? t.script ? (t.script += "</" + i, t.state = r.SCRIPT) : g(t, "Invalid tagname in closing tag.") : t.tagName = i;
            }
            continue;
          case r.CLOSE_TAG_SAW_WHITE:
            if (h(i))
              continue;
            i === ">" ? Q(t) : g(t, "Invalid characters in closing tag");
            continue;
          case r.TEXT_ENTITY:
          case r.ATTRIB_VALUE_ENTITY_Q:
          case r.ATTRIB_VALUE_ENTITY_U:
            var A, D;
            switch (t.state) {
              case r.TEXT_ENTITY:
                A = r.TEXT, D = "textNode";
                break;
              case r.ATTRIB_VALUE_ENTITY_Q:
                A = r.ATTRIB_VALUE_QUOTED, D = "attribValue";
                break;
              case r.ATTRIB_VALUE_ENTITY_U:
                A = r.ATTRIB_VALUE_UNQUOTED, D = "attribValue";
                break;
            }
            i === ";" ? (t[D] += Dt(t), t.entity = "", t.state = A) : w(t.entity.length ? bt : _t, i) ? t.entity += i : (g(t, "Invalid character in entity name"), t[D] += "&" + t.entity + i, t.entity = "", t.state = A);
            continue;
          default:
            throw new Error(t, "Unknown state: " + t.state);
        }
      return t.position >= t.bufferCheckPosition && l(t), t;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var e = String.fromCharCode, t = Math.floor, o = function() {
        var i = 16384, d = [], N, A, D = -1, O = arguments.length;
        if (!O)
          return "";
        for (var x = ""; ++D < O; ) {
          var _ = Number(arguments[D]);
          if (!isFinite(_) || _ < 0 || _ > 1114111 || t(_) !== _)
            throw RangeError("Invalid code point: " + _);
          _ <= 65535 ? d.push(_) : (_ -= 65536, N = (_ >> 10) + 55296, A = _ % 1024 + 56320, d.push(N, A)), (D + 1 === O || d.length > i) && (x += e.apply(null, d), d.length = 0);
        }
        return x;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: o,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = o;
    }();
  })(a);
})(it);
function P(a) {
  return Array.isArray ? Array.isArray(a) : Object.prototype.toString.call(a) === "[object Array]";
}
function b(a, n) {
  (!(a in n) || typeof n[a] != "boolean") && (n[a] = !1);
}
function Pt(a, n) {
  a.map((c) => b(c, n));
}
function rt(a) {
  (!("spaces" in a) || typeof a.spaces != "number" && typeof a.spaces != "string") && (a.spaces = 0);
}
function Rt(a) {
  (!("alwaysArray" in a) || typeof a.alwaysArray != "boolean" && !P(a.alwaysArray)) && (a.alwaysArray = !1);
}
function C(a, n) {
  (!(a + "Key" in n) || typeof n[a + "Key"] != "string") && (n[a + "Key"] = n.compact ? "_" + a : a);
}
function xt(a, n) {
  a.map((c) => C(c, n));
}
function Bt(a, n) {
  return a + "Fn" in n;
}
function Lt(a, n) {
  a.map((c) => Bt(a, n));
}
var u, f;
function Ut(a) {
  return u = { ...a }, b("ignoreDeclaration", u), b("ignoreInstruction", u), b("ignoreAttributes", u), b("ignoreText", u), b("ignoreComment", u), b("ignoreCdata", u), b("ignoreDoctype", u), b("compact", u), b("alwaysChildren", u), b("addParent", u), b("trim", u), b("nativeType", u), b("nativeTypeAttributes", u), b("sanitize", u), b("instructionHasAttributes", u), b("captureSpacesBetweenElements", u), Rt(u), C("declaration", u), C("instruction", u), C("attributes", u), C("text", u), C("comment", u), C("cdata", u), C("doctype", u), C("type", u), C("name", u), C("elements", u), C("parent", u), u;
}
function ut(a) {
  var n = Number(a);
  if (!isNaN(n))
    return n;
  var c = a.toLowerCase();
  return c === "true" ? !0 : c === "false" ? !1 : a;
}
function p(a, n) {
  var c;
  if (u.compact) {
    if (!f[u[a + "Key"]] && (P(u.alwaysArray) ? u.alwaysArray.indexOf(u[a + "Key"]) !== -1 : u.alwaysArray) && (f[u[a + "Key"]] = []), f[u[a + "Key"]] && !P(f[u[a + "Key"]]) && (f[u[a + "Key"]] = [f[u[a + "Key"]]]), a + "Fn" in u && typeof n == "string" && (n = u[a + "Fn"](n, f)), a === "instruction" && ("instructionFn" in u || "instructionNameFn" in u)) {
      for (c in n)
        if (n.hasOwnProperty(c))
          if ("instructionFn" in u)
            n[c] = u.instructionFn(n[c], c, f);
          else {
            var s = n[c];
            delete n[c], n[u.instructionNameFn(c, s, f)] = s;
          }
    }
    P(f[u[a + "Key"]]) ? f[u[a + "Key"]].push(n) : f[u[a + "Key"]] = n;
  } else {
    f[u.elementsKey] || (f[u.elementsKey] = []);
    var l = {};
    if (l[u.typeKey] = a, a === "instruction") {
      for (c in n)
        if (n.hasOwnProperty(c))
          break;
      l[u.nameKey] = "instructionNameFn" in u ? u.instructionNameFn(c, n, f) : c, u.instructionHasAttributes ? (l[u.attributesKey] = n[c][u.attributesKey], "instructionFn" in u && (l[u.attributesKey] = u.instructionFn(l[u.attributesKey], c, f))) : ("instructionFn" in u && (n[c] = u.instructionFn(n[c], c, f)), l[u.instructionKey] = n[c]);
    } else
      a + "Fn" in u && (n = u[a + "Fn"](n, f)), l[u[a + "Key"]] = n;
    u.addParent && (l[u.parentKey] = f), f[u.elementsKey].push(l);
  }
}
function ct(a) {
  if ("attributesFn" in u && a && (a = u.attributesFn(a, f)), (u.trim || "attributeValueFn" in u || "attributeNameFn" in u || u.nativeTypeAttributes) && a) {
    var n;
    for (n in a)
      if (a.hasOwnProperty(n) && (u.trim && (a[n] = a[n].trim()), u.nativeTypeAttributes && (a[n] = ut(a[n])), "attributeValueFn" in u && (a[n] = u.attributeValueFn(a[n], n, f)), "attributeNameFn" in u)) {
        var c = a[n];
        delete a[n], a[u.attributeNameFn(n, a[n], f)] = c;
      }
  }
  return a;
}
function pt(a) {
  var n = {};
  if (a.body && (a.name.toLowerCase() === "xml" || u.instructionHasAttributes)) {
    for (var c = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\w+))\s*/g, s; (s = c.exec(a.body)) !== null; )
      n[s[1]] = s[2] || s[3] || s[4];
    n = ct(n);
  }
  if (a.name.toLowerCase() === "xml") {
    if (u.ignoreDeclaration)
      return;
    f[u.declarationKey] = {}, Object.keys(n).length && (f[u.declarationKey][u.attributesKey] = n), u.addParent && (f[u.declarationKey][u.parentKey] = f);
  } else {
    if (u.ignoreInstruction)
      return;
    u.trim && (a.body = a.body.trim());
    var l = {};
    u.instructionHasAttributes && Object.keys(n).length ? (l[a.name] = {}, l[a.name][u.attributesKey] = n) : l[a.name] = a.body, p("instruction", l);
  }
}
function Mt(a, n) {
  var c;
  if (typeof a == "object" && (n = a.attributes, a = a.name), n = ct(n), "elementNameFn" in u && (a = u.elementNameFn(a, f)), u.compact) {
    if (c = {}, !u.ignoreAttributes && n && Object.keys(n).length) {
      c[u.attributesKey] = {};
      var s;
      for (s in n)
        n.hasOwnProperty(s) && (c[u.attributesKey][s] = n[s]);
    }
    !(a in f) && (P(u.alwaysArray) ? u.alwaysArray.indexOf(a) !== -1 : u.alwaysArray) && (f[a] = []), f[a] && !P(f[a]) && (f[a] = [f[a]]), P(f[a]) ? f[a].push(c) : f[a] = c;
  } else
    f[u.elementsKey] || (f[u.elementsKey] = []), c = {}, c[u.typeKey] = "element", c[u.nameKey] = a, !u.ignoreAttributes && n && Object.keys(n).length && (c[u.attributesKey] = n), u.alwaysChildren && (c[u.elementsKey] = []), f[u.elementsKey].push(c);
  c[u.parentKey] = f, f = c;
}
function Vt(a) {
  u.ignoreText || !a.trim() && !u.captureSpacesBetweenElements || (u.trim && (a = a.trim()), u.nativeType && (a = ut(a)), u.sanitize && (a = a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")), p("text", a));
}
function Gt(a) {
  u.ignoreComment || (u.trim && (a = a.trim()), p("comment", a));
}
function jt(a) {
  var n = f[u.parentKey];
  u.addParent || delete f[u.parentKey], f = n;
}
function Yt(a) {
  u.ignoreCdata || (u.trim && (a = a.trim()), p("cdata", a));
}
function Xt(a) {
  u.ignoreDoctype || (a = a.replace(/^ /, ""), u.trim && (a = a.trim()), p("doctype", a));
}
function qt(a) {
  a.note = a;
}
function Ht(a, n) {
  var c = it.parser(!0, {}), s = {};
  if (f = s, u = Ut(n), c.opt = { strictEntities: !0 }, c.onopentag = Mt, c.ontext = Vt, c.oncomment = Gt, c.onclosetag = jt, c.onerror = qt, c.oncdata = Yt, c.ondoctype = Xt, c.onprocessinginstruction = pt, c.write(a).close(), s[u.elementsKey]) {
    var l = s[u.elementsKey];
    delete s[u.elementsKey], s[u.elementsKey] = l, delete s.text;
  }
  return s;
}
var F, I;
const Qt = [
  "ignoreDeclaration",
  "ignoreInstruction",
  "ignoreAttributes",
  "ignoreText",
  "ignoreComment",
  "ignoreCdata",
  "ignoreDoctype",
  "compact",
  "indentText",
  "indentCdata",
  "indentAttributes",
  "indentInstruction",
  "fullTagEmptyElement",
  "noQuotesForNativeAttributes"
], Wt = [
  "declaration",
  "instruction",
  "attributes",
  "text",
  "comment",
  "cdata",
  "doctype",
  "instruction",
  "cdata",
  "comment",
  "text",
  "instructionName",
  "elementName",
  "attributeName",
  "attributeValue",
  "attributes",
  "fullTagEmptyElement"
], kt = [
  "doctype",
  "instruction",
  "cdata",
  "comment",
  "text",
  "instructionName",
  "elementName",
  "attributeNane",
  "attributeValue",
  "attributes",
  "fullTagEmptyElement"
];
function zt(a) {
  const n = { ...a };
  return Pt(Qt, n), rt(n), typeof n.spaces == "number" && (n.spaces = Array(n.spaces + 1).join(" ")), xt(Wt, n), Lt(kt, n), n;
}
function v(a, n, c) {
  return (!c && a.spaces ? `
` : "") + Array(n + 1).join(a.spaces);
}
function G(a, n, c) {
  if (n.ignoreAttributes)
    return "";
  "attributesFn" in n && (a = n.attributesFn(a, I, F));
  var s, l, m, T, E = [];
  for (s in a)
    a.hasOwnProperty(s) && a[s] !== null && a[s] !== void 0 && (T = n.noQuotesForNativeAttributes && typeof a[s] != "string" ? "" : '"', l = "" + a[s], l = l.replace(/"/g, "&quot;"), m = "attributeNameFn" in n ? n.attributeNameFn(s, l, I, F) : s, E.push(n.spaces && n.indentAttributes ? v(n, c + 1, !1) : " "), E.push(m + "=" + T + ("attributeValueFn" in n ? n.attributeValueFn(l, s, I, F) : l) + T));
  return a && Object.keys(a).length && n.spaces && n.indentAttributes && E.push(v(n, c, !1)), E.join("");
}
function ot(a, n, c) {
  return F = a, I = "xml", n.ignoreDeclaration ? "" : "<?xml" + G(a[n.attributesKey], n, c) + "?>";
}
function st(a, n, c) {
  if (n.ignoreInstruction)
    return "";
  var s;
  for (s in a)
    if (a.hasOwnProperty(s))
      break;
  var l = "instructionNameFn" in n ? n.instructionNameFn(s, a[s], I, F) : s;
  if (typeof a[s] == "object")
    return F = a, I = l, "<?" + l + G(a[s][n.attributesKey], n, c) + "?>";
  var m = a[s] ? a[s] : "";
  return "instructionFn" in n && (m = n.instructionFn(m, s, I, F)), "<?" + l + (m ? " " + m : "") + "?>";
}
function lt(a, n) {
  return n.ignoreComment ? "" : "<!--" + ("commentFn" in n ? n.commentFn(a, I, F) : a) + "-->";
}
function ft(a, n) {
  return n.ignoreCdata ? "" : "<![CDATA[" + ("cdataFn" in n ? n.cdataFn(a, I, F) : a.replace("]]>", "]]]]><![CDATA[>")) + "]]>";
}
function mt(a, n) {
  return n.ignoreDoctype ? "" : "<!DOCTYPE " + ("doctypeFn" in n ? n.doctypeFn(a, I, F) : a) + ">";
}
function k(a, n) {
  return n.ignoreText ? "" : (a = "" + a, a = a.replace(/&amp;/g, "&"), a = a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), "textFn" in n ? n.textFn(a, I, F) : a);
}
function Jt(a, n) {
  if (!P(a.elements))
    return !1;
  a.elements.map((c) => {
    switch (c[n.typeKey]) {
      case "text":
        if (n.indentText)
          return !0;
        break;
      case "cdata":
        if (n.indentCdata)
          return !0;
        break;
      case "instruction":
        if (n.indentInstruction)
          return !0;
        break;
      case "doctype":
      case "comment":
      case "element":
        return !0;
      default:
        return !0;
    }
  });
}
function Zt(a, n, c) {
  F = a, I = a.name;
  var s = [], l = "elementNameFn" in n ? n.elementNameFn(a.name, a) : a.name;
  s.push("<" + l), a[n.attributesKey] && s.push(G(a[n.attributesKey], n, c));
  var m = a[n.elementsKey] && a[n.elementsKey].length || a[n.attributesKey] && a[n.attributesKey]["xml:space"] === "preserve";
  return m || ("fullTagEmptyElementFn" in n ? m = n.fullTagEmptyElementFn(a.name, a) : m = n.fullTagEmptyElement), m ? (s.push(">"), a[n.elementsKey] && a[n.elementsKey].length && (s.push(Tt(a[n.elementsKey], n, c + 1)), F = a, I = a.name), s.push(n.spaces && Jt(a, n) ? `
` + Array(c + 1).join(n.spaces) : ""), s.push("</" + l + ">")) : s.push("/>"), s.join("");
}
function Tt(a, n, c, s) {
  return a.reduce(function(l, m) {
    const T = v(n, c, s && !l);
    switch (m.type) {
      case "element":
        return l + T + Zt(m, n, c);
      case "comment":
        return l + T + lt(m[n.commentKey], n);
      case "doctype":
        return l + T + mt(m[n.doctypeKey], n);
      case "cdata":
        return l + (n.indentCdata ? T : "") + ft(m[n.cdataKey], n);
      case "text":
        return l + (n.indentText ? T : "") + k(m[n.textKey], n);
      case "instruction":
        const E = {};
        return E[m[n.nameKey]] = m[n.attributesKey] ? m : m[n.instructionKey], l + (n.indentInstruction ? T : "") + st(E, n, c);
    }
  }, "");
}
function Et(a, n, c) {
  var s;
  for (s in a)
    if (a.hasOwnProperty(s))
      switch (s) {
        case n.parentKey:
        case n.attributesKey:
          break;
        case n.textKey:
          if (n.indentText || c)
            return !0;
          break;
        case n.cdataKey:
          if (n.indentCdata || c)
            return !0;
          break;
        case n.instructionKey:
          if (n.indentInstruction || c)
            return !0;
          break;
        case n.doctypeKey:
        case n.commentKey:
          return !0;
        default:
          return !0;
      }
  return !1;
}
function $t(a, n, c, s, l) {
  F = a, I = n;
  var m = "elementNameFn" in c ? c.elementNameFn(n, a) : n;
  if (typeof a > "u" || a === null || a === "")
    return "fullTagEmptyElementFn" in c && c.fullTagEmptyElementFn(n, a) || c.fullTagEmptyElement ? "<" + m + "></" + m + ">" : "<" + m + "/>";
  var T = [];
  if (n) {
    if (T.push("<" + m), typeof a != "object")
      return T.push(">" + k(a, c) + "</" + m + ">"), T.join("");
    a[c.attributesKey] && T.push(G(a[c.attributesKey], c, s));
    var E = Et(a, c, !0) || a[c.attributesKey] && a[c.attributesKey]["xml:space"] === "preserve";
    if (E || ("fullTagEmptyElementFn" in c ? E = c.fullTagEmptyElementFn(n, a) : E = c.fullTagEmptyElement), E)
      T.push(">");
    else
      return T.push("/>"), T.join("");
  }
  return T.push(dt(a, c, s + 1, !1)), F = a, I = n, n && T.push((l ? v(c, s, !1) : "") + "</" + m + ">"), T.join("");
}
function dt(a, n, c, s) {
  var l, m, T, E = [];
  for (m in a)
    if (a.hasOwnProperty(m))
      for (T = P(a[m]) ? a[m] : [a[m]], l = 0; l < T.length; ++l) {
        switch (m) {
          case n.declarationKey:
            E.push(ot(T[l], n, c));
            break;
          case n.instructionKey:
            E.push((n.indentInstruction ? v(n, c, s) : "") + st(T[l], n, c));
            break;
          case n.attributesKey:
          case n.parentKey:
            break;
          case n.textKey:
            E.push((n.indentText ? v(n, c, s) : "") + k(T[l], n));
            break;
          case n.cdataKey:
            E.push((n.indentCdata ? v(n, c, s) : "") + ft(T[l], n));
            break;
          case n.doctypeKey:
            E.push(v(n, c, s) + mt(T[l], n));
            break;
          case n.commentKey:
            E.push(v(n, c, s) + lt(T[l], n));
            break;
          default:
            E.push(v(n, c, s) + $t(T[l], m, n, c, Et(T[l], n)));
        }
        s = s && !E.length;
      }
  return E.join("");
}
function te(a, n) {
  n = zt(n);
  var c = [];
  return F = a, I = "_root_", n.compact ? c.push(dt(a, n, 0, !0)) : (a[n.declarationKey] && c.push(ot(a[n.declarationKey], n, 0)), a[n.elementsKey] && a[n.elementsKey].length && c.push(Tt(a[n.elementsKey], n, 0, !c.length))), c.join("");
}
function ee(a) {
  const n = { ...a };
  return rt(n), n;
}
function ne(a, n) {
  let c;
  const s = ee(n), l = Ht(a, s), m = "compact" in s && s.compact ? "_parent" : "parent";
  return "addParent" in s && s.addParent ? c = JSON.stringify(l, function(T, E) {
    return T === m ? "_" : E;
  }, s.spaces) : c = JSON.stringify(l, null, s.spaces), c.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
function ae(a, n) {
  a instanceof Buffer && (a = a.toString());
  let c;
  if (typeof a == "string")
    try {
      c = JSON.parse(a);
    } catch {
      throw new Error("Invalid JSON structure!");
    }
  else
    c = a;
  return te(c, n);
}
export {
  te as js2xml,
  ae as json2xml,
  Ht as xml2js,
  ne as xml2json
};
