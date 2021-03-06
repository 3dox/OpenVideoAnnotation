var _ref, __bind = function(a, b) {
    return function() {
      return a.apply(b, arguments)
    }
  },
  __hasProp = {}.hasOwnProperty,
  __extends = function(d, b) {
    for (var a in b) {
      if (__hasProp.call(b, a)) {
        d[a] = b[a]
      }
    }

    function c() {
      this.constructor = d
    }
    c.prototype = b.prototype;
    d.prototype = new c();
    d.__super__ = b.prototype;
    return d
  },
  createDateFromISO8601 = function(b) {
    var h, a, g, e, f, c;
    e = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    h = b.match(new RegExp(e));
    g = 0;
    a = new Date(h[1], 0, 1);
    if (h[3]) {
      a.setMonth(h[3] - 1)
    }
    if (h[5]) {
      a.setDate(h[5])
    }
    if (h[7]) {
      a.setHours(h[7])
    }
    if (h[8]) {
      a.setMinutes(h[8])
    }
    if (h[10]) {
      a.setSeconds(h[10])
    }
    if (h[12]) {
      a.setMilliseconds(Number("0." + h[12]) * 1000)
    }
    if (h[14]) {
      g = (Number(h[16]) * 60) + Number(h[17]);
      g *= (c = h[15] === "-") != null ? c : {
        1: -1
      }
    }
    g -= a.getTimezoneOffset();
    f = Number(a) + (g * 60 * 1000);
    a.setTime(Number(f));
    return a
  };
var Util = typeof Util != "undefined" ? Util : {};
Util.mousePosition = function(b, d) {
  var c, a;
  if ((a = $(d).css("position")) !== "absolute" && a !== "fixed" && a !== "relative") {
    d = $(d).offsetParent()[0]
  }
  c = $(d).offset();
  return {
    top: b.pageY - c.top,
    left: b.pageX - c.left
  }
};
(function(a) {
  a.extend(a.fn, {
    watch: function(f, d, g) {
      var e = document.createElement("div");
      var c = function(i, j) {
        i = "on" + i;
        var h = (i in j);
        if (!h) {
          j.setAttribute(i, "return;");
          h = typeof j[i] == "function"
        }
        return h
      };
      if (typeof(d) == "function") {
        g = d;
        d = {}
      }
      if (typeof(g) != "function") {
        g = function() {}
      }
      d = a.extend({}, {
        throttle: 10
      }, d);
      var b = function(k) {
        var m = k.data(),
          n = false,
          h;
        var l = typeof m != "undefined" && typeof m.props != "undefined" ? m.props.length : 0;
        for (var j = 0; j < l; j++) {
          h = k.css(m.props[j]);
          if (m.vals[j] != h) {
            m.vals[j] = h;
            n = true;
            break
          }
        }
        if (n && m.cb) {
          m.cb.call(k, m)
        }
      };
      return this.each(function() {
        var i = a(this),
          h = function() {
            b.call(this, i)
          },
          j = {
            props: f.split(","),
            cb: g,
            vals: []
          };
        a.each(j.props, function(k) {
          j.vals[k] = i.css(j.props[k])
        });
        i.data(j);
        if (c("DOMAttrModified", e)) {
          i.on("DOMAttrModified", g)
        } else {
          if (c("propertychange", e)) {
            i.on("propertychange", g)
          } else {
            setInterval(h, d.throttle)
          }
        }
      })
    }
  })
})(jQuery);
(function() {
  function b(c) {
    var d = this;
    d.annotations = new a(d, c);

    function e(j) {
      var l = $(".annotator-wrapper").parent()[0],
        k = $.data(l, "annotator");
      if (typeof Annotator.Plugin.Share === "function") {
        if (typeof k.isShareLoaded != "undefined" && k.isShareLoaded) {
          k.unsubscribe("shareloaded", e)
        } else {
          k.subscribe("shareloaded", e);
          return false
        }
      }
      var i = d.annotations;
      for (var h in i.components) {
        i.components[h].init_()
      }
      d.annotations.BigNewAn.show();
      i.setposBigNew(i.options.posBigNew);
      if (!c.showDisplay) {
        i.hideDisplay()
      }
      if (!c.showStatistics) {
        i.hideStatistics()
      }
      d.annotator = k;
      i.annotator = k;
      var g = k.plugins.Store.annotations;
      i.refreshDisplay();
      d.rangeslider.rstb.on("mousedown", function() {
        i._onMouseDownRS(j)
      });
      if (d.autoPlayAPI) {
        var f = function() {
          d.annotations.showAnnotation(d.autoPlayAPI);
          $("html,body").animate({
            scrollTop: $("#" + d.id()).offset().top
          }, "slow")
        };
        if (d.techName == "Youtube") {
          setTimeout(f, 100)
        } else {
          f()
        }
      }
      i.refreshDesignPanel();
      d.on("fullscreenchange", function() {
        if (d.isFullSsreen()) {
          $(d.annotator.wrapper[0]).addClass("vjs-fullscreen")
        } else {
          $(d.annotator.wrapper[0]).removeClass("vjs-fullscreen")
        }
        i.refreshDesignPanel()
      });
      i.loaded = true
    }
    d.one("loadedRangeSlider", e);
    console.log("Loaded Annotation Plugin")
  }
  videojs.plugin("annotations", b);

  function a(d, c) {
    var d = d || this;
    this.player = d;
    this.components = {};
    c = c || {};
    if (!c.hasOwnProperty("posBigNew")) {
      c.posBigNew = "none"
    }
    if (!c.hasOwnProperty("showDisplay")) {
      c.showDisplay = false
    }
    if (!c.hasOwnProperty("showStatistics")) {
      c.showStatistics = false
    }
    this.options = c;
    this.init()
  }
  a.prototype = {
    init: function() {
      var d = this.player || {},
        f = d.controlBar,
        e = d.controlBar.progressControl.seekBar;
      this.updatePrecision = 3;
      this.BigNewAn = this.components.BigNewAnnotation = d.BigNewAnnotation;
      this.AnConBut = this.components.AnContainerButtons = f.AnContainerButtons;
      this.ShowSt = this.components.ShowStatistics = this.AnConBut.ShowStatistics;
      this.NewAn = this.components.NewAnnotation = this.AnConBut.NewAnnotation;
      this.ShowAn = this.components.ShowAnnotations = this.AnConBut.ShowAnnotations;
      this.BackAnDisplay = this.components.BackAnDisplay = f.BackAnDisplay;
      this.AnDisplay = this.components.AnDisplay = f.BackAnDisplay.AnDisplay;
      this.AnStat = this.components.AnStat = f.BackAnDisplay.AnStat;
      this.BackAnDisplayScroll = this.components.BackAnDisplayScroll = f.BackAnDisplayScroll;
      this.backDSBar = this.components.BackAnDisplayScrollBar = this.BackAnDisplayScroll.BackAnDisplayScrollBar;
      this.backDSBarSel = this.components.ScrollBarSelector = this.backDSBar.ScrollBarSelector;
      this.backDSTime = this.components.BackAnDisplayScrollTime = this.BackAnDisplayScroll.BackAnDisplayScrollTime;
      this.rsd = this.components.RangeSelectorDisplay = f.BackAnDisplay.RangeSelectorDisplay;
      this.rsdl = this.components.RangeSelectorLeft = this.rsd.RangeSelectorLeft;
      this.rsdr = this.components.RangeSelectorRight = this.rsd.RangeSelectorRight;
      this.rsdb = this.components.RangeSelectorBar = this.rsd.RangeSelectorBar;
      this.rsdbl = this.components.RangeSelectorBarL = this.rsdb.RangeSelectorBarL;
      this.rsdbr = this.components.RangeSelectorBarR = this.rsdb.RangeSelectorBarR;
      this.rs = d.rangeslider;
      this.editing = false;
      var h = $(".annotator-wrapper").parent()[0],
        g = $.data(h, "annotator"),
        c = this;
      g.subscribe("annotationsLoaded", function(i) {
        if (c.loaded) {
          c.refreshDisplay()
        }
      });
      g.subscribe("annotationUpdated", function(i) {
        if (c.loaded) {
          c.refreshDisplay()
        }
      });
      g.subscribe("annotationDeleted", function(i) {
        var m = g.plugins.Store.annotations,
          l = typeof m != "undefined" ? m.length : 0,
          k = 0;
        var j = function() {
          var n = g.plugins.Store.annotations.length;
          if (k < 100) {
            setTimeout(function() {
              if (n != l) {
                if (c.loaded) {
                  c.refreshDisplay()
                }
              } else {
                k++;
                j()
              }
            }, 100)
          }
        };
        j()
      });
      this.BigNewAn.hide()
    },
    newan: function(i, c) {
      var d = this.player,
        h = this.annotator,
        g = 10,
        e = d.currentTime(),
        f = this._sumPercent(e, g);
      var i = typeof i != "undefined" ? i : e,
        c = typeof c != "undefined" ? c : f;
      this._reset();
      d.showSlider();
      d.pause();
      d.setValueSlider(i, c);
      h.editor.VideoJS = this.player.id();
      h.adder.show();
      this._setOverRS(h.adder);
      h.onAdderClick()
    },
    showDisplay: function() {
      this._reset();
      this.BackAnDisplay.removeClass("disable");
      this.BackAnDisplayScroll.removeClass("disable");
      this.ShowAn.addClass("active");
      this.options.showDisplay = true
    },
    hideDisplay: function() {
      this.BackAnDisplay.addClass("disable");
      this.BackAnDisplayScroll.addClass("disable");
      videojs.p(this.ShowAn.b, "active");
      this.options.showDisplay = false
    },
    showStatistics: function() {
      this._reset();
      this.BackAnDisplay.removeClass("disable");
      this.AnStat.removeClass("disable");
      this.BackAnDisplay.addClass("statistics");
      this.AnStat.paintCanvas();
      this.ShowSt.addClass("active");
      this.options.showStatistics = true
    },
    hideStatistics: function() {
      this.BackAnDisplay.addClass("disable");
      this.AnStat.addClass("disable");
      this.BackAnDisplay.removeClass("statistics");
      this.ShowSt.removeClass("active");
      this.options.showStatistics = false
    },
    showAnnotation: function(f) {
      var c = this._isVideoJS(f);
      if (c) {
        var d = f.rangeTime.start,
          h = f.rangeTime.end,
          g = this.player.duration(),
          k = videojs.round(d, 3) == videojs.round(h, 3);
        this._reset();
        this.rs.show();
        this.rs.setValues(d, h);
        this.rs.lock();
        if (!k) {
          this.rs.playBetween(d, h)
        }
        var e = Math.min(1, Math.max(0.005, (this.rs._percent(h - d)))) * 100;
        this.rs.bar.b.style.width = e + "%";
        var i = k ? this.rs[((g - d) / g < 0.1) ? "left" : "right"].b : this.rs.bar.b,
          j = $(this.rs.left.b).parent()[0];
        $(j).append('<span class="annotator-hl"></div>');
        $(i).appendTo($(j).find(".annotator-hl"));
        var l = $(i).parent()[0];
        $.data(l, "annotation", f);
        this._setOverRS(this.annotator.editor.element);
        this.annotator.editor.checkOrientation();
        this.rs.hidePanel()
      }
    },
    hideAnnotation: function() {
      this.rs.hide();
      this.rs.showPanel();
      var d = $(this.rs.left.b).parent()[0];
      var c = $(this.rs.right.b).parent()[0];
      if ($(d).find(".annotator-hl").length > 0) {
        $($(d).find(".annotator-hl")[0].children[0]).appendTo(d);
        $(d).find(".annotator-hl").remove()
      } else {
        if ($(c).find(".annotator-hl").length > 0) {
          $($(c).find(".annotator-hl")[0].children[0]).appendTo(c);
          $(c).find(".annotator-hl").remove()
        }
      }
    },
    editAnnotation: function(c, e) {
      if (this._isVideoJS(c)) {
        this.hideDisplay();
        var d = this.player,
          e = e || this.annotator.editor;
        d.showSlider();
        d.unlockSlider();
        d.setValueSlider(c.rangeTime.start, c.rangeTime.end);
        d.showSliderPanel();
        this._setOverRS(e.element);
        e.checkOrientation();
        e.VideoJS = d.id();
      }
    },
    refreshDisplay: function() {
      console.log("loadingAnnotations");
      var h = 0,
        j = this.annotator.plugins.Store.annotations;
      this._sortByDate(j);
      $(this.AnDisplay.b).find("span").remove();
      $(this.player.b).find(".vjs-anpanel-annotation .annotation").remove();
      for (var k in j) {
        var g = j[k];
        if (this._isVideoJS(g)) {
          var c = document.createElement("div"),
            i = document.createElement("span"),
            e = this.rs._percent(g.rangeTime.start) * 100,
            f = this.rs._percent(g.rangeTime.end) * 100,
            d;
          i.appendChild(c);
          i.className = "annotator-hl";
          d = Math.min(100, Math.max(0.2, f - e));
          c.className = "annotation";
          c.id = h;
          c.style.top = h + "em";
          c.style.left = e + "%";
          c.style.width = d + "%";
          c.start = g.rangeTime.start;
          c.end = g.rangeTime.end;
          this.AnDisplay.b.appendChild(i);
          if (videojs.round(e, 0) == videojs.round(f, 0)) {
            $(c).css("width", "");
            $(c).addClass("point")
          }
          $.data(i, "annotation", g);
          g.highlights = $(i);
          h++
        }
      }
      var e = this.rs._seconds(parseFloat(this.rsdl.b.style.left) / 100),
        f = this.rs._seconds(parseFloat(this.rsdr.b.style.left) / 100);
      this.showBetween(e, f, this.rsdl.include, this.rsdr.include)
    },
    showBetween: function(c, h, d, f) {
      var g = this.player.duration(),
        c = c || 0,
        h = h || g,
        n = $.makeArray($(this.player.b).find(".vjs-anpanel-annotation .annotator-hl")),
        k = 0;
      for (var l in n) {
        var i = $.data(n[l], "annotation"),
          m = d ? (i.rangeTime.end >= c) : (i.rangeTime.start >= c),
          e = f ? (i.rangeTime.start <= h) : (i.rangeTime.end <= h);
        if (this._isVideoJS(i) && m && e && typeof i.highlights[0] != "undefined") {
          var j = i.highlights[0].children[0];
          j.style.marginTop = (-1 * parseFloat(j.style.top) + k) + "em";
          $(i.highlights[0]).show();
          k++
        } else {
          if (this._isVideoJS(i) && typeof i.highlights[0] != "undefined") {
            $(i.highlights[0]).hide();
            i.highlights[0].children[0].style.marginTop = ""
          }
        }
      }
      this.backDSTime.setTimes()
    },
    setposBigNew: function(d) {
      var d = d || "ul",
        c = this.player.BigNewAnnotation.b;
      videojs.p(c, "ul");
      videojs.p(c, "ur");
      videojs.p(c, "c");
      videojs.p(c, "bl");
      videojs.p(c, "br");
      videojs.m(c, d)
    },
    pressedKey: function(e) {
      var d = this.player,
        c = this.player.rs;
      if (typeof e != "undefined" && e == 73) {
        this._reset();
        this.rs.show();
        this.rs._reset();
        this.rs.setValue(0, d.currentTime());
        this.rs.right.b.style.visibility = "hidden";
        this.rs.tpr.b.style.visibility = "hidden";
        this.rs.ctpr.b.style.visibility = "hidden";
        this.rs.bar.b.style.visibility = "hidden";
        this.lastStartbyKey = d.currentTime()
      } else {
        if (typeof e != "undefined" && e == 79) {
          if (this.rs.bar.b.style.visibility == "hidden") {
            var f = this.lastStartbyKey != "undefined" ? this.lastStartbyKey : 0;
            this.newan(f, d.currentTime())
          } else {
            this.newan(d.currentTime(), d.currentTime())
          }
        }
      }
    },
    refreshDesignPanel: function() {
      var e = this.player,
        c = parseFloat($(this.backDSBar.b).css("width")),
        g = parseFloat($(e.b).css("height")),
        f = parseFloat($(e.controlBar.b).css("height")),
        d = (g - f) / c - 5;
      this.BackAnDisplay.b.style.height = this.backDSBar.b.style.height = (d + "em");
      this.BackAnDisplay.b.style.top = this.backDSBar.b.style.top = "-" + (d + 3 + "em");
      this.BackAnDisplayScroll.b.children[0].style.top = "-" + (d + 5 + "em");
      this.backDSTime.b.children[0].style.top = "-" + (d + 5 + "em")
    },
    _reset: function() {
      this.hideDisplay();
      this.hideAnnotation();
      this.hideStatistics();
      this.player.annotator.adder.hide();
      this.player.annotator.editor.hide();
      this.player.annotator.viewer.hide();
      this.rs.right.b.style.visibility = "";
      this.rs.tpr.b.style.visibility = "";
      this.rs.ctpr.b.style.visibility = "";
      this.rs.bar.b.style.visibility = "";
      this.rs.unlock();
      this.rs.bar.suspendPlay();
      this.refreshDesignPanel()
    },
    _setOverRS: function(g) {
      var i = this.player.annotator,
        h = $(".annotator-wrapper")[0],
        c = videojs.vd(this.rs.left.b),
        f = videojs.vd(this.rs.right.b),
        e = videojs.vd(h),
        d = {};
      g[0].style.display = "block";
      if (this.player.isFullscreen()) {
        d.top = c.top;
        d.left = c.left + (f.left - c.left) / 2
      } else {
        d.left = c.left + (f.left - c.left) / 2 - e.left;
        d.top = c.top - e.top
      }
      g.css(d)
    },
    _onMouseDownRS: function(c) {
      c.preventDefault();
      if (!this.rs.options.locked) {
        videojs.d(document, "mousemove", videojs.bind(this, this._onMouseMoveRS));
        videojs.d(document, "mouseup", videojs.bind(this, this._onMouseUpRS))
      }
    },
    _onMouseMoveRS: function(e) {
      var d = this.player,
        f = d.annotator,
        c = d.rangeslider;
      f.editor.element[0].style.display = "none";
      c.show();
      this._setOverRS(f.adder)
    },
    _onMouseUpRS: function(e) {
      videojs.o(document, "mousemove", this._onMouseMoveRS, false);
      videojs.o(document, "mouseup", this._onMouseUpRS, false);
      var d = this.player,
        f = d.annotator,
        c = d.rangeslider;
      f.editor.element[0].style.display = "block";
      this._setOverRS(f.editor.element)
    },
    _sumPercent: function(e, c) {
      var d = this.player.duration();
      var e = e || 0;
      var c = c || 10;
      c = Math.min(100, Math.max(0, c));
      if (isNaN(d)) {
        return 0
      }
      return Math.min(d, Math.max(0, e + d * c / 100))
    },
    _EditVideoAn: function() {
      var e = this.annotator,
        d = (typeof this.player != "undefined"),
        c = e.editor.VideoJS;
      return (d && typeof c != "undefined" && c !== -1)
    },
    _isVideoJS: function(h) {
      var l = this.player,
        f = h.rangeTime,
        i = (typeof this.player != "undefined"),
        c = (typeof h.media != "undefined" && (h.media == "video" || h.media == "audio")),
        d = (typeof h.target != "undefined" && h.target.container == l.id()),
        m = (typeof f != "undefined" && !isNaN(parseFloat(f.start)) && isFinite(f.start) && !isNaN(parseFloat(f.end)) && isFinite(f.end)),
        j = false;
      if (d) {
        var k = (i && typeof this.player.techName != "undefined") ? (this.player.techName == "Youtube") : false,
          e = k ? h.target.src : h.target.src.substring(0, h.target.src.lastIndexOf(".")),
          g = k ? l.l.sources[0].src : l.l.sources[0].src.substring(0, l.l.sources[0].src.lastIndexOf("."));
        j = (e == g)
      }
      return (i && c && d && j && m)
    },
    _sortByDate: function(d, c) {
      var c = c || "asc";
      d.sort(function(f, e) {
        f = new Date(typeof f.updated != "undefined" ? createDateFromISO8601(f.updated) : "");
        e = new Date(typeof e.updated != "undefined" ? createDateFromISO8601(e.updated) : "");
        if (c == "asc") {
          return e < f ? -1 : e > f ? 1 : 0
        } else {
          return f < e ? -1 : f > e ? 1 : 0
        }
      })
    }
  };
  videojs.ControlBar.prototype.l.children.AnContainerButtons = {};
  videojs.ControlBar.prototype.l.children.BackAnDisplay = {};
  videojs.ControlBar.prototype.l.children.BackAnDisplayScroll = {};
  videojs.options.children.BigNewAnnotation = {};
  videojs.BigNewAnnotation = videojs.Button.extend({
    init: function(d, c) {
      videojs.Button.call(this, d, c)
    }
  });
  videojs.BigNewAnnotation.prototype.init_ = function() {
    this.an = this.c.annotations;
    var c = this.an.options.optionsAnnotator;
    if (typeof c != "undefined" && typeof c.readOnly != "undefined" && c.readOnly) {
      this.hide()
    }
  };
  videojs.BigNewAnnotation.prototype.e = function() {
    return videojs.Button.prototype.e.call(this, "div", {
      className: "vjs-big-new-annotation vjs-menu-button vjs-control",
      innerHTML: '<div class="vjs-big-menu-button vjs-control">A</div>',
      title: "New Annotation",
    })
  };
  videojs.BigNewAnnotation.prototype.r = function() {
    this.an.newan()
  };
  videojs.AnContainerButtons = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c)
    }
  });
  videojs.AnContainerButtons.prototype.init_ = function() {};
  videojs.AnContainerButtons.prototype.l = {
    children: {
      ShowStatistics: {},
      ShowAnnotations: {},
      NewAnnotation: {},
    }
  };
  videojs.AnContainerButtons.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-container-button-annotation vjs-menu-button vjs-control",
    })
  };
  videojs.ShowStatistics = videojs.Button.extend({
    init: function(d, c) {
      videojs.Button.call(this, d, c)
    }
  });
  videojs.ShowStatistics.prototype.init_ = function() {
    this.an = this.c.annotations
  };
  videojs.ShowStatistics.prototype.e = function() {
    return videojs.Button.prototype.e.call(this, "div", {
      className: "vjs-statistics-annotation vjs-menu-button vjs-control",
      title: "Show the Statistics",
    })
  };
  videojs.ShowStatistics.prototype.r = function() {
    if (!this.an.options.showStatistics) {
      this.an.showStatistics()
    } else {
      this.an.hideStatistics()
    }
  };
  videojs.ShowAnnotations = videojs.Button.extend({
    init: function(d, c) {
      videojs.Button.call(this, d, c)
    }
  });
  videojs.ShowAnnotations.prototype.init_ = function() {
    this.an = this.c.annotations
  };
  videojs.ShowAnnotations.prototype.e = function() {
    return videojs.Button.prototype.e.call(this, "div", {
      className: "vjs-showannotations-annotation vjs-menu-button vjs-control",
      title: "Show Annotations",
    })
  };
  videojs.ShowAnnotations.prototype.r = function() {
    if (!this.an.options.showDisplay) {
      this.an.showDisplay()
    } else {
      this.an.hideDisplay()
    }
  };
  videojs.NewAnnotation = videojs.Button.extend({
    init: function(d, c) {
      videojs.Button.call(this, d, c)
    }
  });
  videojs.NewAnnotation.prototype.init_ = function() {
    this.an = this.c.annotations;
    var c = this.an.options.optionsAnnotator;
    if (typeof c != "undefined" && typeof c.readOnly != "undefined" && c.readOnly) {
      this.hide()
    }
  };
  videojs.NewAnnotation.prototype.e = function() {
    return videojs.Button.prototype.e.call(this, "div", {
      className: "vjs-new-annotation vjs-menu-button vjs-control",
      title: "New Annotation",
    })
  };
  videojs.NewAnnotation.prototype.r = function() {
    this.an.newan()
  };
  videojs.BackAnDisplay = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c)
    }
  });
  videojs.BackAnDisplay.prototype.init_ = function() {
    this.an = this.c.annotations;
    self = this;
    $(this.b).watch("font-size", function() {
      self.an.backDSBarSel.setPosition(self.an.BackAnDisplayScroll.currentValue, false)
    })
  };
  videojs.BackAnDisplay.prototype.l = {
    children: {
      RangeSelectorDisplay: {},
      AnDisplay: {},
      AnStat: {},
    }
  };
  videojs.BackAnDisplay.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-back-anpanel-annotation",
    })
  };
  videojs.RangeSelectorDisplay = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c);
      this.on("mousedown", this.onMouseDown)
    }
  });
  videojs.RangeSelectorDisplay.prototype.init_ = function() {
    this.rs = this.c.rangeslider;
    this.an = this.c.annotations;
    var c = this.an.player.duration();
    this.start = 0;
    this.end = c;
    this.setPosition(0, 0, false);
    this.setPosition(1, this.rs._percent(c), false)
  };
  videojs.RangeSelectorDisplay.prototype.l = {
    children: {
      RangeSelectorLeft: {},
      RangeSelectorRight: {},
      RangeSelectorBar: {},
    }
  };
  videojs.RangeSelectorDisplay.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-rangeselector-anpanel-annotation",
    })
  };
  videojs.RangeSelectorDisplay.prototype.onMouseDown = function(c) {
    c.preventDefault();
    videojs.d(document, "mousemove", videojs.bind(this, this.onMouseMove));
    videojs.d(document, "mouseup", videojs.bind(this, this.onMouseUp));
    videojs.p(this.an.rsdb.b, "disable")
  };
  videojs.RangeSelectorDisplay.prototype.onMouseUp = function(c) {
    videojs.o(document, "mousemove", this.onMouseMove, false);
    videojs.o(document, "mouseup", this.onMouseUp, false);
    videojs.m(this.an.rsdb.b, "disable")
  };
  videojs.RangeSelectorDisplay.prototype.onMouseMove = function(c) {
    var d = this.calculateDistance(c);
    if (this.an.rsdl.pressed) {
      this.setPosition(0, d)
    } else {
      if (this.an.rsdr.pressed) {
        this.setPosition(1, d)
      }
    }
    this.an.player.currentTime(this.rs._seconds(d))
  };
  videojs.RangeSelectorDisplay.prototype.calculateDistance = function(e) {
    var c = this.getRSTBX();
    var d = this.getRSTBWidth();
    var f = this.getWidth();
    c = c + (f / 2);
    d = d - f;
    return Math.max(0, Math.min(1, (e.pageX - c) / d))
  };
  videojs.RangeSelectorDisplay.prototype.getRSTBWidth = function() {
    return this.b.offsetWidth
  };
  videojs.RangeSelectorDisplay.prototype.getRSTBX = function() {
    return videojs.vd(this.b).left
  };
  videojs.RangeSelectorDisplay.prototype.getWidth = function() {
    var c = $(this.an.rsdl.b).find(".vjs-selector-arrow")[0];
    return c.offsetWidth
  };
  videojs.RangeSelectorDisplay.prototype.setPosition = function(l, f, k) {
    var l = l || 0,
      k = typeof k != "undefined" ? k : true;
    if (isNaN(f)) {
      return false
    }
    if (!(l === 0 || l === 1)) {
      return false
    }
    var i = this.an.rsdl.b,
      g = this.an.rsdr.b,
      j = this.an[l === 0 ? "rsdl" : "rsdr"].b;
    if ((l === 0 ? this.updateLeft(f) : this.updateRight(f))) {
      if (l === 1) {
        j.style.left = (f * 100) + "%";
        j.style.width = ((1 - f) * 100) + "%"
      } else {
        j.style.left = (f * 100) + "%";
        j.style.width = ((f) * 100) + "%"
      }
      this[l === 0 ? "start" : "end"] = this.rs._seconds(f);
      if (l === 0 && (f * 100) >= 90) {
        $(i).find(".vjs-selector-arrow")[0].style.zIndex = 25
      } else {
        $(i).find(".vjs-selector-arrow")[0].style.zIndex = 10
      }
      var c = this.an.rsdbl.b,
        m = this.an.rsdbr.b,
        d = parseFloat(g.style.left) - parseFloat(i.style.left);
      if (l === 0) {
        c.children[0].innerHTML = videojs.ya(this.rs._seconds(f))
      } else {
        m.children[0].innerHTML = videojs.ya(this.rs._seconds(f))
      }
      if (typeof d != "undefined" && d <= 12.5) {
        if (parseFloat(i.style.left) < 7) {
          c.style.top = (-1.5) + "em";
          c.style.left = 1 + "em"
        } else {
          c.style.left = (-2.5) + "em";
          c.style.top = ""
        }
        if (parseFloat(g.style.left) > 93) {
          m.style.top = (-1.5) + "em";
          m.style.right = 1 + "em"
        } else {
          m.style.right = (-2.5) + "em";
          m.style.top = ""
        }
      } else {
        c.style.left = 1 + "em";
        m.style.right = 1 + "em";
        c.style.top = "";
        m.style.top = ""
      }
      var e = this.rs._seconds(parseFloat(i.style.left) / 100),
        h = this.rs._seconds(parseFloat(g.style.left) / 100);
      if (k) {
        this.an.showBetween(e, h, this.an.rsdl.include, this.an.rsdr.include)
      }
    }
    return true
  };
  videojs.RangeSelectorDisplay.prototype.updateLeft = function(g) {
    var e = this.an.rsdr.b.style.left != "" ? this.an.rsdr.b.style.left : 100;
    var c = parseFloat(e) / 100,
      f = this.an.rsdb.b;
    var d = videojs.round((c - g), this.an.updatePrecision);
    if (g <= (c + 0.00001)) {
      f.style.left = (g * 100) + "%";
      f.style.width = (d * 100) + "%";
      return true
    }
    return false
  };
  videojs.RangeSelectorDisplay.prototype.updateRight = function(d) {
    var c = this.an.rsdl.b.style.left != "" ? this.an.rsdl.b.style.left : 0;
    var g = parseFloat(c) / 100,
      f = this.an.rsdb.b;
    var e = videojs.round((d - g), this.an.updatePrecision);
    if ((d + 0.00001) >= g) {
      f.style.width = (e * 100) + "%";
      f.style.left = ((d - e) * 100) + "%";
      return true
    }
    return false
  };
  videojs.RangeSelectorLeft = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c);
      this.on("mousedown", this.onMouseDown);
      this.on("dblclick", this.ondblclick);
      this.pressed = false;
      this.include = true
    }
  });
  videojs.RangeSelectorLeft.prototype.init_ = function() {
    this.rs = this.c.rangeslider;
    this.an = this.c.annotations;
    videojs.m(this.b, "include")
  };
  videojs.RangeSelectorLeft.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-leftselector-anpanel-annotation",
      innerHTML: '<div class="vjs-selector-arrow" title="Left Annotation Selector"></div><div class="vjs-leftselector-back"></div>'
    })
  };
  videojs.RangeSelectorLeft.prototype.onMouseDown = function(c) {
    c.preventDefault();
    this.pressed = true;
    videojs.d(document, "mouseup", videojs.bind(this, this.onMouseUp));
    videojs.m(this.b, "active");
    videojs.m(this.b.parentNode, "active")
  };
  videojs.RangeSelectorLeft.prototype.onMouseUp = function(c) {
    videojs.o(document, "mouseup", this.onMouseUp, false);
    videojs.p(this.b, "active");
    videojs.p(this.b.parentNode, "active");
    this.pressed = false
  };
  videojs.RangeSelectorLeft.prototype.ondblclick = function(c) {
    if (this.include) {
      this.include = false;
      videojs.p(this.b, "include")
    } else {
      this.include = true;
      videojs.m(this.b, "include")
    }
    var d = this.an.rsd.calculateDistance(c);
    this.an.rsd.setPosition(0, d)
  };
  videojs.RangeSelectorRight = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c);
      this.on("mousedown", this.onMouseDown);
      this.on("dblclick", this.ondblclick);
      this.pressed = false;
      this.include = true
    }
  });
  videojs.RangeSelectorRight.prototype.init_ = function() {
    this.rs = this.c.rangeslider;
    this.an = this.c.annotations;
    videojs.m(this.b, "include")
  };
  videojs.RangeSelectorRight.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-rightselector-anpanel-annotation",
      innerHTML: '<div class="vjs-selector-arrow" title="Right Annotation Selector"></div><div class="vjs-rightselector-back"></div>'
    })
  };
  videojs.RangeSelectorRight.prototype.onMouseDown = function(c) {
    c.preventDefault();
    this.pressed = true;
    videojs.d(document, "mouseup", videojs.bind(this, this.onMouseUp));
    videojs.m(this.b, "active");
    videojs.m(this.b.parentNode, "active")
  };
  videojs.RangeSelectorRight.prototype.onMouseUp = function(c) {
    videojs.o(document, "mouseup", this.onMouseUp, false);
    videojs.p(this.b, "active");
    videojs.p(this.b.parentNode, "active");
    this.pressed = false
  };
  videojs.RangeSelectorRight.prototype.ondblclick = function(c) {
    if (this.include) {
      this.include = false;
      videojs.p(this.b, "include")
    } else {
      this.include = true;
      videojs.m(this.b, "include")
    }
    var d = this.an.rsd.calculateDistance(c);
    this.an.rsd.setPosition(1, d)
  };
  videojs.RangeSelectorBar = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c)
    }
  });
  videojs.RangeSelectorBar.prototype.init_ = function() {
    videojs.m(this.b, "disable")
  };
  videojs.RangeSelectorBar.prototype.l = {
    children: {
      RangeSelectorBarL: {},
      RangeSelectorBarR: {},
    }
  };
  videojs.RangeSelectorBar.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-barselector-anpanel-annotation",
    })
  };
  videojs.RangeSelectorBarL = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c)
    }
  });
  videojs.RangeSelectorBarL.prototype.init_ = function() {};
  videojs.RangeSelectorBarL.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-barselector-left",
      innerHTML: '<span class="vjs-time-text">00:00</span>',
    })
  };
  videojs.RangeSelectorBarR = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c)
    }
  });
  videojs.RangeSelectorBarR.prototype.init_ = function() {};
  videojs.RangeSelectorBarR.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-barselector-right",
      innerHTML: '<span class="vjs-time-text">00:00</span>'
    })
  };
  videojs.AnDisplay = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c);
      this.on("mousedown", this.onMouseDown);
      this.on("mouseover", this.onMouseOver);
    }
  });
  videojs.AnDisplay.prototype.init_ = function() {
    this.rs = this.c.rangeslider;
    this.an = this.c.annotations;
    this.transition = false
  };
  videojs.AnDisplay.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-anpanel-annotation",
    })
  };
  videojs.AnDisplay.prototype.onMouseDown = function(i) {
    var h = $(i.target).parents(".annotator-hl").andSelf(),
      d = this;
    if (h.hasClass("annotator-hl")) {
      videojs.d(document, "mouseup", videojs.bind(this, this.onMouseUp));
      var g = document.createElement("div"),
        j = parseFloat(h[1].style.top),
        f = parseFloat(h[1].style.marginTop),
        c = parseFloat($(h[1]).css("height")),
        e = $(h[1]).hasClass("point");
      g.className = e ? "boxup-dashed-line point" : "boxup-dashed-line";
      g.style.left = h[1].style.left;
      g.style.width = h[1].style.width;
      g.style.top = (j + f - this.b.scrollTop / c) + "em";
      h[0].parentNode.parentNode.appendChild(g)
    }
  };
  videojs.AnDisplay.prototype.onMouseUp = function(h) {
    if (typeof this.lastelem == "undefined") {
      return false
    }
    var g = this.lastelem,
      e = this;
    if (g.hasClass("annotator-hl")) {
      var d = g.map(function() {
        return $(this).data("annotation")
      })[0];
      var f = (-1) * parseFloat($(this.b).parent()[0].style.top),
        c = parseFloat($(g[1]).css("height"));
      if (typeof $(g).parent().parent().find(".boxup-dashed-line")[0] != "undefined") {
        $(g).parent().parent().find(".boxup-dashed-line")[0].style.top = (f - 2) + "em"
      }
      this.an.player.pause();
      this.transition = true;
      window.setTimeout(function() {
        e.an.showAnnotation(d);
        e.transition = false;
        e.onCloseViewer()
      }, 900)
    }
    videojs.o(document, "mouseup", this.onMouseUp, false)
  };
  videojs.AnDisplay.prototype.onMouseOver = function(f) {
    if (!this.transition && !this.an.rsdl.pressed && !this.an.rsdr.pressed) {
      var j = this.an.annotator;
      var e = $(f.target).parents(".annotator-hl").andSelf();
      if (typeof j != "undefined" && j.viewer.isShown() && e.hasClass("annotator-hl")) {
        j.viewer.hide();
        var h = e.map(function() {
          return $(this).data("annotation")
        });
        j.showViewer($.makeArray(h), Util.mousePosition(f, j.wrapper[0]))
      }
      e.addClass("active");
      if (typeof e != "undefined" && $(e[1]).hasClass("annotation")) {
        var d = document.createElement("div"),
          g = document.createElement("div"),
          i = parseFloat(this.an.BackAnDisplay.b.style.height),
          c = e[1].style.marginTop != "" ? parseFloat(e[1].style.marginTop) : 0;
        ElemTop = parseFloat(e[1].style.top) + c, emtoPx = parseFloat($(e[1]).css("height")), isPoint = $(e[1]).hasClass("point");
        d.className = isPoint ? "dashed-line point" : "dashed-line";
        g.className = "box-dashed-line";
        d.style.left = g.style.left = e[1].style.left;
        d.style.width = g.style.width = isPoint ? "0" : e[1].style.width;
        d.style.top = ((ElemTop + 1) - this.b.scrollTop / emtoPx) + "em";
        d.style.height = ((i - ElemTop + 2) + this.b.scrollTop / emtoPx) + "em";
        g.style.top = (i + 2) + "em";
        e[0].parentNode.parentNode.appendChild(d);
        e[0].parentNode.parentNode.appendChild(g);
        $(this.player).find(".vjs-play-progress").css("z-index", 2);
        $(this.player).find(".vjs-seek-handle").css("z-index", 2)
      }
      if (e.hasClass("annotator-hl")) {
        this.lastelem = e
      }
    }
  };
  videojs.AnDisplay.prototype.onCloseViewer = function() {
    if (!this.transition) {
      if (typeof this.lastelem != "undefined") {
        this.lastelem.removeClass("active")
      }
      if (typeof this.lastelem != "undefined" && this.lastelem.hasClass("annotator-hl")) {
        $(this.lastelem).parent().parent().find(".dashed-line").remove();
        $(this.lastelem).parent().parent().find(".box-dashed-line").remove();
        $(this.lastelem).parent().parent().find(".boxup-dashed-line").remove();
        $(this.player).find(".vjs-play-progress").css("z-index", "");
        $(this.player).find(".vjs-seek-handle").css("z-index", "")
      }
    }
  };
  videojs.AnDisplay.prototype.countVisibles = function() {
    var d = $.makeArray(this.b.children);
    var f = 0;
    for (var c in d) {
      var e = d[c];
      if (e.style.display != "none") {
        f++
      }
    }
    return f
  };
  videojs.AnStat = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c);
      this.marginTop = 20;
      this.marginBottom = 0
    }
  });
  videojs.AnStat.prototype.init_ = function() {
    this.rs = this.c.rangeslider;
    this.an = this.c.annotations;
    this.canvas = this.b.children[0]
  };
  videojs.AnStat.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-anstat-annotation",
      innerHTML: '<canvas class="vjs-char-anstat-annotation">Your browser does not support the HTML5 canvas tag.</canvas>',
    })
  };
  videojs.AnStat.prototype.paintCanvas = function() {
    var o = this.canvas.getContext("2d"),
      n = this._getPoints(),
      m = this._getWeights(n),
      g = this._getMaxArray(n, "entries"),
      i = this.an.AnDisplay.b.children.length;
    duration = this.an.player.duration();
    this.canvas.style.marginTop = Math.round(this.marginTop) + "px";
    if ($(this.canvas).parent().find(".vjs-totan-anstat-annotation").length == 0) {
      $(this.canvas).parent().append('<div class="vjs-totan-anstat-annotation">');
      $(this.canvas).parent().append('<div class="vjs-maxcon-anstat-annotation">')
    }
    var q = $(this.canvas).parent().find(".vjs-totan-anstat-annotation")[0];
    q.innerHTML = i + " total annotations";
    var q = $(this.canvas).parent().find(".vjs-maxcon-anstat-annotation")[0];
    q.innerHTML = "Max Annotations = " + g;
    if (window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype.lineTo) {
      CanvasRenderingContext2D.prototype.dashedLine = function(s, y, r, x, v) {
        if (v == undefined) {
          v = 2
        }
        this.beginPath();
        this.moveTo(s, y);
        var u = r - s;
        var t = x - y;
        var w = Math.floor(Math.sqrt(u * u + t * t) / v);
        var A = u / w;
        var z = t / w;
        var p = 0;
        while (p++ < w) {
          s += A;
          y += z;
          this[p % 2 == 0 ? "moveTo" : "lineTo"](s, y)
        }
        this[p % 2 == 0 ? "moveTo" : "lineTo"](r, x);
        this.stroke();
        this.closePath()
      }
    }
    this.canvas.height = this.an.AnDisplay.b.offsetHeight - (this.marginTop + this.marginBottom);
    this.canvas.width = this.an.AnDisplay.b.offsetWidth;
    o.beginPath();
    o.strokeStyle = "rgb(255, 163, 0)";
    var j = 0,
      f = 0;
    o.moveTo(0, g * m.Y);
    for (var h in n) {
      var e = n[h],
        d = j * m.X,
        l = (g - f) * m.Y,
        c = e.second * m.X,
        k = (g - e.entries) * m.Y;
      o.lineTo(c, l);
      o.moveTo(c, l);
      o.lineTo(c, k);
      o.moveTo(c, k);
      o.fillStyle = "rgba(0, 0, 0,0.5)";
      o.fillRect(d, l, (c - d), (g * m.Y - l));
      j = e.second;
      f = e.entries
    }
    o.lineTo(j * m.X, g * m.Y);
    o.moveTo(j * m.X, g * m.Y);
    o.lineTo(duration * m.X, g * m.Y);
    o.stroke();
    o.beginPath();
    o.dashedLine(0, g * m.Y, duration * m.X, g * m.Y, 8);
    o.stroke();
    o.beginPath();
    o.dashedLine(0, 0, duration * m.X, 0, 8);
    o.stroke()
  };
  videojs.AnStat.prototype._getWeights = function(f) {
    var g = {},
      c = $(this.an.AnDisplay.b),
      e = this.an.player.duration(),
      i = this._getMaxArray(f, "entries"),
      h = parseFloat(c.css("width")),
      d = parseFloat(c.css("height")) - (this.marginTop + this.marginBottom);
    g.X = e != 0 ? (h / e) : 0;
    g.Y = i != 0 ? (d / i) : 0;
    return g
  };
  videojs.AnStat.prototype._getMaxArray = function(f, d) {
    var g = 0,
      e;
    for (var c in f) {
      e = f[c][d];
      if (e > g) {
        g = e
      }
    }
    return g
  };
  videojs.AnStat.prototype._getPoints = function() {
    var f = [],
      d = this.an.annotator.plugins.Store.annotations;
    for (var e in d) {
      var g = d[e],
        h, c;
      if (this.an._isVideoJS(g)) {
        h = g.rangeTime.start;
        c = g.rangeTime.end;
        if (!this._isFound(f, h)) {
          f.push({
            second: g.rangeTime.start,
            entries: this._getNumberAnnotations(h)
          });
          if (g.rangeTime.start == g.rangeTime.end) {
            f.push({
              second: g.rangeTime.end,
              entries: this._getNumberAnnotations(c, true)
            })
          }
        }
        if (!this._isFound(f, c)) {
          f.push({
            second: g.rangeTime.end,
            entries: this._getNumberAnnotations(c, true)
          })
        }
        found = false
      }
    }
    f.sort(function(j, i) {
      return parseFloat(j.second) - parseFloat(i.second)
    });
    return f
  };
  videojs.AnStat.prototype._isFound = function(f, d) {
    var e = false;
    for (var c in f) {
      if (typeof f[c].second != "undefined" && f[c].second == d) {
        e = true
      }
    }
    return e
  };
  videojs.AnStat.prototype._getNumberAnnotations = function(h, d) {
    var f = (typeof d != "undefined" && d) ? -1 : 0,
      c = this.an.annotator.plugins.Store.annotations;
    for (var e in c) {
      var g = c[e];
      if (this.an._isVideoJS(g)) {
        if (g.rangeTime.start <= h && g.rangeTime.end >= h) {
          f++
        }
      }
    }
    return f
  };
  videojs.BackAnDisplayScroll = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c);
      this.on("mousedown", this.onMouseDown);
      this.UpValue = 0.1;
      this.currentValue = 0
    }
  });
  videojs.BackAnDisplayScroll.prototype.init_ = function() {
    this.rs = this.c.rangeslider;
    this.an = this.c.annotations;
    this.mousedownID = -1;
    var c = this,
      d;
    $(this.an.AnDisplay.b).bind("DOMMouseScroll", function(f) {
      if (f.originalEvent.detail > 0) {
        d = c.UpValue
      } else {
        d = -c.UpValue
      }
      c.an.backDSBarSel.setPosition(c.getPercentScroll() + d);
      return false
    });
    $(this.an.AnDisplay.b).bind("mousewheel", function(f) {
      if (f.originalEvent.wheelDelta < 0) {
        d = c.UpValue
      } else {
        d = -c.UpValue
      }
      c.an.backDSBarSel.setPosition(c.getPercentScroll() + d);
      return false
    })
  };
  videojs.BackAnDisplayScroll.prototype.l = {
    children: {
      BackAnDisplayScrollBar: {},
      BackAnDisplayScrollTime: {},
    }
  };
  videojs.BackAnDisplayScroll.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-scroll-anpanel-annotation",
      innerHTML: '<div class="vjs-up-scroll-annotation"></div><div class="vjs-down-scroll-annotation"></div>',
    })
  };
  videojs.BackAnDisplayScroll.prototype.onMouseDown = function(d) {
    var c = this;
    if (d.target.className == "vjs-scrollbar-anpanel-annotation") {
      this.an.backDSBarSel.onMouseMove(d);
      return false
    } else {
      if (d.target.className == "vjs-scrollbar-selector") {
        return false
      } else {
        var e = d.target.className == "vjs-down-scroll-annotation" ? this.UpValue : -this.UpValue;
        videojs.d(document, "mouseup", videojs.bind(this, this.onMouseUp));
        if (this.mousedownID == -1) {
          this.mousedownID = setInterval(function() {
            var f = Math.max(0, Math.min(1, c.getPercentScroll() + e));
            c.an.backDSBarSel.setPosition(f)
          }, 100)
        }
      }
    }
  };
  videojs.BackAnDisplayScroll.prototype.onMouseUp = function(d) {
    videojs.o(document, "mouseup", this.onMouseUp, false);
    var c = this;
    if (this.mousedownID != -1) {
      clearInterval(this.mousedownID);
      c.mousedownID = -1
    }
  };
  videojs.BackAnDisplayScroll.prototype.getPercentScroll = function() {
    var c = this.an.AnDisplay.b,
      e = c.scrollHeight - c.offsetHeight,
      d = c.scrollTop;
    return Math.max(0, Math.min(1, e != 0 ? (d / e) : 0))
  };
  videojs.BackAnDisplayScroll.prototype.setPercentScroll = function(d) {
    var c = this.an.AnDisplay.b,
      e = c.scrollHeight - c.offsetHeight;
    d = Math.max(0, Math.min(1, d ? d : 0));
    c.scrollTop = Math.round(e * d)
  };
  videojs.BackAnDisplayScrollBar = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c)
    }
  });
  videojs.BackAnDisplayScrollBar.prototype.init_ = function() {};
  videojs.BackAnDisplayScrollBar.prototype.l = {
    children: {
      ScrollBarSelector: {},
    }
  };
  videojs.BackAnDisplayScrollBar.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-scrollbar-anpanel-annotation",
    })
  };
  videojs.ScrollBarSelector = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c);
      this.on("mousedown", this.onMouseDown)
    }
  });
  videojs.ScrollBarSelector.prototype.init_ = function() {
    this.rs = this.c.rangeslider;
    this.an = this.c.annotations;
    videojs.m(this.an.backDSBar.b, "disable")
  };
  videojs.ScrollBarSelector.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-scrollbar-selector",
    })
  };
  videojs.ScrollBarSelector.prototype.onMouseDown = function(c) {
    c.preventDefault();
    videojs.d(document, "mousemove", videojs.bind(this, this.onMouseMove));
    videojs.d(document, "mouseup", videojs.bind(this, this.onMouseUp))
  };
  videojs.ScrollBarSelector.prototype.onMouseUp = function(c) {
    videojs.o(document, "mousemove", this.onMouseMove, false);
    videojs.o(document, "mouseup", this.onMouseUp, false)
  };
  videojs.ScrollBarSelector.prototype.onMouseMove = function(c) {
    var d = this.calculateDistance(c);
    d = this.parseMaxPercent(d);
    this.setPosition(d)
  };
  videojs.ScrollBarSelector.prototype.calculateDistance = function(e) {
    var f = this.getscrollY();
    var d = this.getscrollHeight();
    var c = this.getHeight();
    f = f + (c);
    d = d - (c);
    return Math.max(0, Math.min(1, (e.pageY - f) / d))
  };
  videojs.ScrollBarSelector.prototype.getscrollHeight = function() {
    return this.b.parentNode.offsetHeight
  };
  videojs.ScrollBarSelector.prototype.getscrollY = function() {
    return videojs.findPosition(this.b.parentNode).top
  };
  videojs.ScrollBarSelector.prototype.getHeight = function() {
    return this.b.offsetHeight
  };
  videojs.ScrollBarSelector.prototype.parseMaxHeight = function(f) {
    var d = this.getscrollHeight(),
      c = this.getHeight(),
      e = c / d;
    return Math.max(0, Math.min(1 - e, f))
  };
  videojs.ScrollBarSelector.prototype.parseMaxPercent = function(g) {
    var e = this.getscrollHeight(),
      d = this.getHeight(),
      f = d / e,
      c = g;
    if (g >= (1 - f)) {
      c = 1
    }
    return c
  };
  videojs.ScrollBarSelector.prototype.setPosition = function(g, f) {
    var f = typeof f != "undefined" ? f : true;
    if (isNaN(g)) {
      return false
    }
    if (!this.isScrollable()) {
      return false
    }
    if (f) {
      videojs.removeClass(this.an.backDSBar.b, "disable")
    }
    var e = this.b,
      d = this.an.BackAnDisplayScroll,
      h = this.an.backDSTime;
    e.style.top = (this.parseMaxHeight(g) * 100) + "%";
    d.setPercentScroll(g);
    h.setTimes();
    if (f) {
      var c = this;
      if (typeof this.Timeout != "undefined") {
        clearTimeout(this.Timeout)
      }
      this.Timeout = window.setTimeout(function() {
        videojs.addClass(c.an.backDSBar.b, "disable")
      }, 1000)
    }
    this.an.BackAnDisplayScroll.currentValue = g;
    return true
  };
  videojs.ScrollBarSelector.prototype.isScrollable = function() {
    var d = this.an.AnDisplay.b,
      c = parseFloat($(d).find(".annotation").css("height")),
      f = parseInt(d.offsetHeight / c);
    var e = this.an.AnDisplay.countVisibles();
    return (e > f)
  };
  videojs.BackAnDisplayScrollTime = videojs.Component.extend({
    init: function(d, c) {
      videojs.Component.call(this, d, c)
    }
  });
  videojs.BackAnDisplayScrollTime.prototype.init_ = function() {
    this.rs = this.c.rangeslider;
    this.an = this.c.annotations
  };
  videojs.BackAnDisplayScrollTime.prototype.e = function() {
    return videojs.Component.prototype.e.call(this, "div", {
      className: "vjs-scrolltime-anpanel-annotation",
      innerHTML: '<div class="vjs-up-scrolltime-annotation"><span class="vjs-time-text"></span></div><div class="vjs-down-scrolltime-annotation"><span class="vjs-time-text"></span></div>',
    })
  };
  videojs.BackAnDisplayScrollTime.prototype.setTimes = function() {
    var c = this.getAnnotationPosition(),
      e = this.getElements(c),
      d = this.getTimes(e);
    if (d.top != "Invalid Date") {
      $(this.b).find(".vjs-up-scrolltime-annotation")[0].style.visibility = "";
      $(this.b).find(".vjs-up-scrolltime-annotation span")[0].innerHTML = d.top
    } else {
      $(this.b).find(".vjs-up-scrolltime-annotation")[0].style.visibility = "hidden"
    }
    if (d.bottom != "Invalid Date") {
      $(this.b).find(".vjs-down-scrolltime-annotation")[0].style.visibility = "";
      $(this.b).find(".vjs-down-scrolltime-annotation span")[0].innerHTML = d.bottom
    } else {
      $(this.b).find(".vjs-down-scrolltime-annotation")[0].style.visibility = "hidden"
    }
  };
  videojs.BackAnDisplayScrollTime.prototype.getAnnotationPosition = function() {
    var d = this.an.backDSBarSel,
      e = d.parseMaxPercent(parseFloat(d.b.style.top) / 100),
      c = this.an.AnDisplay.b,
      h = c.scrollHeight,
      j = c.offsetHeight,
      f = h - j,
      g = 0,
      i = {};
    e = e || 0;
    i.top = Math.max(j, Math.min(h, f * e + c.offsetHeight));
    i.bottom = Math.max(g, Math.min(f, f * e));
    return i
  };
  videojs.BackAnDisplayScrollTime.prototype.getElements = function(e) {
    var e = e || {},
      d = this.an.AnDisplay.b,
      c = parseFloat($(d).find(".annotation").css("height")),
      h = parseInt(d.scrollHeight / c),
      j = parseInt(d.offsetHeight / c),
      f = (h - j),
      g = 0,
      i = {};
    i.top = Math.max(j, Math.min(h, parseInt(e.top / c)));
    i.bottom = Math.max(g, Math.min(f, parseInt(e.bottom / c)));
    return i
  };
  videojs.BackAnDisplayScrollTime.prototype.getTimes = function(e) {
    var e = e || {},
      m = {},
      g, c, h, f, i = $.makeArray(this.an.AnDisplay.b.children);
    e.top = e.top || 0;
    e.bottom = e.bottom || 0;
    var l = 0,
      d;
    for (var k in i) {
      var j = i[k];
      if (j.style.display != "none") {
        if (l == e.bottom) {
          g = j
        } else {
          if (l == e.top) {
            c = j
          }
        }
        d = j;
        l++
      }
    }
    if (typeof c == "undefined") {
      c = d
    }
    h = typeof g != "undefined" ? $.data(g, "annotation") : undefined;
    f = typeof c != "undefined" ? $.data(c, "annotation") : undefined;
    m.top = (typeof h != "undefined" && typeof h.updated != "undefined") ? h.updated : "";
    m.bottom = (typeof f != "undefined" && typeof f.updated != "undefined") ? f.updated : "";
    m.top = new Date(m.top != "" ? createDateFromISO8601(m.top) : "");
    m.bottom = new Date(m.bottom != "" ? createDateFromISO8601(m.bottom) : "");
    return m
  }
})();
Annotator.Plugin.VideoJS = (function(b) {
  __extends(a, b);

  function a() {
    this.pluginSubmit = __bind(this.pluginSubmit, this);
    _ref = a.__super__.constructor.apply(this, arguments);
    this.__indexOf = [].indexOf || function(e) {
      for (var d = 0, c = this.length; d < c; d++) {
        if (d in this && this[d] === e) {
          return d
        }
      }
      return -1
    };
    return _ref
  }
  a.prototype.field = null;
  a.prototype.input = null;
  a.prototype.pluginInit = function() {
    console.log("VideoJS-pluginInit");
    if (!Annotator.supported()) {
      return
    }
    this.field = this.annotator.editor.addField({
      id: "vjs-input-rangeTime-annotations",
      type: "input",
      submit: this.pluginSubmit,
      EditVideoAn: this.EditVideoAn
    });
    var c = '<li><span id="vjs-input-rangeTime-annotations"></span></li>',
      d = Annotator.$(c);
    Annotator.$(this.field).replaceWith(d);
    this.field = d[0];
    this.initListeners();
    return this.input = $(this.field).find(":input")
  };
  a.prototype.pluginSubmit = function(n, g) {
    console.log("Plug-pluginSubmit");
    if (this.EditVideoAn()) {
      var d = this.annotator,
        k = d.editor.VideoJS,
        o = d.mplayer[k],
        h = o.rangeslider,
        f = h.getValues(),
        m = (o && typeof o.techName != "undefined") ? (o.techName == "Youtube") : false,
        j = typeof g.media == "undefined",
        c, l = o.l.sources[0].type.split("/") || "";
      if (typeof g.media == "undefined") {
        g.media = typeof l[0] != "undefined" ? l[0] : "video"
      }
      g.target = g.target || {};
      g.target.container = o.id() || "";
      g.target.src = o.l.sources[0].src || "";
      c = (o.l.sources[0].src.substring(o.l.sources[0].src.lastIndexOf("."))).toLowerCase();
      c = m ? "Youtube" : c;
      g.target.ext = c || "";
      g.rangeTime = g.rangeTime || {};
      g.rangeTime.start = f.start || 0;
      g.rangeTime.end = f.end || 0;
      g.updated = new Date().toISOString();
      if (typeof g.created == "undefined") {
        g.created = g.updated
      }
      var i = j ? "annotationCreated" : "annotationUpdated";

      function e() {
        o.annotations.showAnnotation(g);
        d.unsubscribe(i, e)
      }
      d.subscribe(i, e)
    } else {
      if (typeof g.media == "undefined") {
        g.media = "text"
      }
      g.updated = new Date().toISOString();
      if (typeof g.created == "undefined") {
        g.created = g.updated
      }
    }
    return g.media
  };
  a.prototype.EditVideoAn = function() {
    var f = $(".annotator-wrapper").parent()[0],
      e = window.annotator = $.data(f, "annotator"),
      d = (typeof e.mplayer != "undefined"),
      c = e.editor.VideoJS;
    return (d && typeof c != "undefined" && c !== -1)
  };
  a.prototype.isVideoJS = function(f) {
    var i = $(".annotator-wrapper").parent()[0],
      h = window.annotator = $.data(i, "annotator"),
      c = f.rangeTime,
      e = (typeof h.mplayer != "undefined"),
      g = (typeof f.media != "undefined" && (f.media == "video" || f.media == "audio")),
      d = (typeof c != "undefined" && !isNaN(parseFloat(c.start)) && isFinite(c.start) && !isNaN(parseFloat(c.end)) && isFinite(c.end));
    return (e && g && d)
  };
  a.prototype._deleteAnnotation = function(f) {
    var i = f.target || {},
      c = i.container || {},
      j = this.annotator.mplayer[c];
    var d = this.annotator,
      g = d.plugins.Store.annotations,
      h = typeof g != "undefined" ? g.length : 0,
      k = 0;
    var e = function() {
      var l = d.plugins.Store.annotations.length;
      if (k < 100) {
        setTimeout(function() {
          if (l != h) {
            j.annotations.refreshDisplay()
          } else {
            k++;
            e()
          }
        }, 100)
      }
    };
    e();
    j.rangeslider.hide()
  };
  a.prototype.initListeners = function() {
    var c = $(".annotator-wrapper").parent()[0],
      e = $.data(c, "annotator");
    var d = this.EditVideoAn,
      f = this.isVideoJS,
      l = this;

    function g(n) {
      console.log("annotationEditorHidden");
      if (d()) {
        var m = e.editor.VideoJS;
        e.mplayer[m].rangeslider.hide();
        e.an[m].refreshDisplay()
      }
      e.editor.VideoJS = -1;
      e.unsubscribe("annotationEditorHidden", g)
    }

    function k(o, m) {
      console.log("annotationEditorShown");
      for (var n in e.an) {
        e.an[n].editAnnotation(m, o)
      }
      e.subscribe("annotationEditorHidden", g)
    }

    function h(m) {
      console.log("annotationDeleted");
      if (f(m)) {
        l._deleteAnnotation(m)
      }
    }

    function i() {
      for (var m in e.an) {
        e.an[m].AnDisplay.onCloseViewer()
      }
      e.viewer.unsubscribe("hide", i)
    }

    function j(p, o) {
      console.log("annotationViewerShown");
      var m = p.element.hasClass(p.classes.invert.y) ? 5 : -5,
        n = {
          top: parseFloat(p.element[0].style.top) + m,
          left: parseFloat(p.element[0].style.left)
        };
      p.element.css(n);
      p.element.find(".annotator-controls").removeClass(p.classes.showControls);
      e.viewer.subscribe("hide", i)
    }
    e.subscribe("annotationEditorShown", k).subscribe("annotationDeleted", h).subscribe("annotationViewerShown", j)
  };
  return a
})(Annotator.Plugin);
OpenVideoAnnotation = ("OpenVideoAnnotation" in window) ? OpenVideoAnnotation : {};
OpenVideoAnnotation.Annotator = function(f, m) {
  var e = jQuery,
    m = m || {};
  m.optionsAnnotator = m.optionsAnnotator || {};
  m.optionsVideoJS = m.optionsVideoJS || {};
  m.optionsRS = m.optionsRS || {};
  m.optionsOVA = m.optionsOVA || {};
  if (typeof m.optionsAnnotator.store == "undefined") {
    m.optionsAnnotator.store = {}
  }
  var j = m.optionsAnnotator.store;
  if (typeof j.annotationData == "undefined") {
    j.annotationData = {}
  }
  if (typeof j.annotationData.uri == "undefined") {
    var b = location.protocol + "//" + location.host + location.pathname;
    j.annotationData.store = {
      uri: b
    }
  }
  if (typeof j.loadFromSearch == "undefined") {
    j.loadFromSearch = {}
  }
  if (typeof j.loadFromSearch.uri == "undefined") {
    j.loadFromSearch.uri = b
  }
  if (typeof j.loadFromSearch.limit == "undefined") {
    j.loadFromSearch.limit = 10000
  }
  this.currentUser = null;
  this.annotator = e(f).annotator(m.optionsAnnotator.annotator).data("annotator");
  m.optionsOVA.optionsAnnotator = m.optionsAnnotator.annotator;
  var i = e(f).find("div .video-js").toArray();
  var l = this.mplayer = {};
  for (var h in i) {
    var a = i[h].id;
    var g = videojs(i[h], m.optionsVideoJS);
    if (videojs.IS_FIREFOX && typeof m.optionsVideoJS.techOrder != "undefined") {
      g.l.techOrder = m.optionsVideoJS.techOrder;
      g.src(g.l.sources)
    }
    this.mplayer[a] = g
  }
  this.annotator.an = {};
  for (var h in this.mplayer) {
    this.mplayer[h].rangeslider(e.extend(true, {}, m.optionsRS));
    this.mplayer[h].annotations(e.extend(true, {}, m.optionsOVA));
    this.annotator.an[h] = this.mplayer[h].annotations
  }
  this.setCurrentUser = function(n) {
    this.currentUser = n;
    this.annotator.plugins.Permissions.setUser(n)
  };
  var d = this.focusedPlayer = "",
    c = this.lastfocusPlayer = "";

  function k(n) {
    if (n.target.nodeName.toLowerCase() != "textarea") {
      l[d].annotations.pressedKey(n.which)
    }
  }(this._setupKeyboard = function() {
    e(document).mousedown(function(o) {
      d = "";
      for (var n in l) {
        if (e(l[n].b).find(o.target).length) {
          d = l[n].id()
        }
      }
      if (c != d) {
        e(document).off("keyup", k);
        if (d != "") {
          e(document).on("keyup", k)
        }
      }
      c = d
    })
  })(this);
  if (typeof m.optionsAnnotator.auth != "undefined") {
    this.annotator.addPlugin("Auth", m.optionsAnnotator.auth)
  }
  if (typeof m.optionsAnnotator.permissions != "undefined") {
    this.annotator.addPlugin("Permissions", m.optionsAnnotator.permissions)
  }
  if (typeof m.optionsAnnotator.store != "undefined") {
    this.annotator.addPlugin("Store", m.optionsAnnotator.store)
  }
  if (typeof m.optionsAnnotator.highlightTags != "undefined") {
    this.annotator.addPlugin("HighlightTags", m.optionsAnnotator.highlightTags)
  }
  if (typeof Annotator.Plugin.Geolocation === "function") {
    this.annotator.addPlugin("Geolocation", m.optionsAnnotator.geolocation)
  }
  if (typeof Annotator.Plugin.Share === "function") {
    this.annotator.addPlugin("Share", m.optionsAnnotator.share)
  }
  this.annotator.addPlugin("VideoJS");
  if (typeof Annotator.Plugin.RichText === "function") {
    this.annotator.addPlugin("RichText", m.optionsAnnotator.richText)
  }
  if (typeof Annotator.Plugin.Reply === "function") {
    this.annotator.addPlugin("Reply")
  }
  if (typeof Annotator.Plugin.Flagging === "function") {
    this.annotator.addPlugin("Flagging")
  }
  this.annotator.mplayer = this.mplayer;
  this.annotator.editor.VideoJS = -1;
  this.options = m;
  return this
};
OpenVideoAnnotation.Annotator.prototype._isVideo = function(a) {
  var a = a || {};
  rt = a.rangeTime, isVideo = (typeof a.media != "undefined" && (a.media == "video" || a.media == "audio")), hasContainer = (typeof a.target != "undefined" && typeof a.target.container != "undefined"), isNumber = (typeof rt != "undefined" && !isNaN(parseFloat(rt.start)) && isFinite(rt.start) && !isNaN(parseFloat(rt.end)) && isFinite(rt.end));
  return (isVideo && hasContainer && isNumber)
};
OpenVideoAnnotation.Annotator.prototype._isloaded = function(b) {
  var a = typeof this.mplayer[b].annotations.loaded != "undefined" ? true : false;
  return a
};
OpenVideoAnnotation.Annotator.prototype.newVideoAn = function(b) {
  var a = this.mplayer[b];
  if (typeof a.play != "undefined") {
    a.play();
    a.one("playing", function() {
      a.annotations.newan();
      $("html,body").animate({
        scrollTop: $("#" + a.id()).offset().top
      }, "slow");
      a.pause()
    })
  }
};
OpenVideoAnnotation.Annotator.prototype.showDisplay = function(a) {
  if (this._isloaded(a)) {
    return this.mplayer[a].annotations.showDisplay()
  }
};
OpenVideoAnnotation.Annotator.prototype.hideDisplay = function(a) {
  if (this._isloaded(a)) {
    return this.mplayer[a].annotations.hideDisplay()
  }
};
OpenVideoAnnotation.Annotator.prototype.refreshDisplay = function(a) {
  if (this._isloaded(a)) {
    return this.mplayer[a].annotations.hideDisplay()
  }
};
OpenVideoAnnotation.Annotator.prototype.setposBigNew = function(b, a) {
  if (this._isloaded(b)) {
    return this.mplayer[b].annotations.setposBigNew(a)
  }
};
OpenVideoAnnotation.Annotator.prototype.playTarget = function(h) {
  var k = this.annotator.plugins.Store.annotations,
    j = h,
    m = this.mplayer;
  for (var l in k) {
    var d = k[l];
    if (typeof d.id != "undefined" && d.id == j) {
      if (this._isVideo(d)) {
        for (var e in m) {
          var i = m[e];
          if (i.id() == d.target.container && i.tech.l.source.src == d.target.src) {
            var b = d;
            var c = function() {
              if (i.techName == "Youtube") {
                var n = function() {
                  i.annotations.showAnnotation(b)
                };
                if (i.annotations.loaded) {
                  n()
                } else {
                  i.one("loadedRangeSlider", n)
                }
              } else {
                i.annotations.showAnnotation(b)
              }
              $("html,body").animate({
                scrollTop: $("#" + i.id()).offset().top
              }, "slow")
            };
            if (i.paused()) {
              i.play();
              i.one("playing", c)
            } else {
              c()
            }
            return false
          }
        }
      } else {
        var a = typeof d.ranges != "undefined" && typeof d.ranges[0] != "undefined",
          f = a ? d.ranges[0].startOffset : "",
          g = a ? d.ranges[0].endOffset : "";
        if (typeof f != "undefined" && typeof g != "undefined") {
          $(d.highlights).parent().find(".annotator-hl").removeClass("api");
          $(d.highlights).addClass("api");
          $("html,body").animate({
            scrollTop: $(d.highlights[0]).offset().top
          }, "slow")
        }
      }
    }
  }
};