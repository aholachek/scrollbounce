var e = require("rebound"),
  t = function(e, t) {
    var n = t.height
    return e.top < 3 * n && e.bottom > 2 * -n
  }
module.exports = function(n) {
  void 0 === n && (n = {})
  var o = n.effectMultiplier
  void 0 === o && (o = 2)
  var r = new e.SpringSystem(),
    i = Array.from(document.querySelectorAll("[data-bounce-id]")),
    d = window.pageYOffset,
    c = i
      .map(function(e) {
        var t = r.createSpring()
        return (
          t.addListener({
            onSpringUpdate: function(t) {
              var n = t.getCurrentValue()
              e.style.transform = "translateY(" + n + "px)"
            }
          }),
          [e, t]
        )
      })
      .reduce(function(e, t) {
        return (e[t[0].dataset.bounceId] = t[1]), e
      }, {}),
    a = {},
    u = function(e) {
      return e.top + e.height / 2
    },
    s = function() {
      if (
        (a.scrollHeight ||
          (a.scrollHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
          )),
        !(Math.abs(n) > a.viewportCoords.height))
      ) {
        var e = window.pageYOffset
        if (!(e <= 0 || e >= a.scrollHeight - a.viewportCoords.height)) {
          var n = d - e,
            r = document.querySelector([
              '[data-bounce-id="' + a.closestBounceId + '"]'
            ]),
            s = i.indexOf(r),
            l = {},
            f = s - 1,
            h = s + 1
          if (n > 0)
            for (;;) {
              var v = i[f]
              if (!v) break
              var g = v.getBoundingClientRect()
              if (!t(g, a.viewportCoords)) break
              ;(l[v.dataset.bounceId] = g), (f -= 1)
            }
          else
            for (;;) {
              var m = i[h]
              if (!m) break
              var w = m.getBoundingClientRect()
              if (!t(w, a.viewportCoords)) break
              ;(l[m.dataset.bounceId] = w), (h += 1)
            }
          var b = i
            .filter(function(e) {
              return l[e.dataset.bounceId]
            })
            .map(function(e) {
              return [e, l[e.dataset.bounceId]]
            })
          i
            .filter(function(e) {
              return !l[e.dataset.bounceId]
            })
            .forEach(function(e) {
              ;(e.style.willChange = ""), c[e.dataset.bounceId].setEndValue(0)
            }),
            b.forEach(function(e) {
              var t = e[0],
                r = e[1]
              t.style.willChange = "transform"
              var i = c[t.dataset.bounceId],
                d = Math.abs(a.clientY - u(r)) / a.viewportCoords.height
              i.setEndValue(-n * (d *= o))
            }),
            (d = e)
        }
      }
    },
    l = !1,
    f = function(e) {
      l || (l = window.addEventListener("scroll", s)),
        (a.clientY = e.targetTouches[0].clientY),
        (a.viewportCoords = {
          height: document.documentElement.clientHeight,
          width: document.documentElement.clientWidth
        })
      var t = i.reduce(function(e, t, n, o) {
        if (e.length && e[0] !== o[n - 1]) return e
        var r,
          i,
          d = t.getBoundingClientRect()
        return (r = d).top < (i = a.viewportCoords).height &&
          r.bottom > 0 &&
          r.left < i.width &&
          r.right > 0 &&
          (0 === e.length ||
            Math.abs(a.clientY - u(d)) < Math.abs(a.clientY - u(e[1])))
          ? [t, d]
          : e
      }, [])
      a.closestBounceId = t[0].dataset.bounceId
    },
    h = function() {
      window.removeEventListener("scroll", s),
        Object.keys(c).forEach(function(e) {
          c[e].setEndValue(0)
        }),
        (a = {})
    },
    v = function(e) {
      a.clientY = e.targetTouches[0].clientY
    }
  return (
    window.addEventListener("touchstart", f, !1),
    window.addEventListener("touchmove", v, !1),
    window.addEventListener("touchend", h, !1),
    function() {
      window.removeEventListener("touchstart", f, !1),
        window.removeEventListener("touchmove", v, !1),
        window.removeEventListener("touchend", h, !1)
    }
  )
}
//# sourceMappingURL=index.js.map
