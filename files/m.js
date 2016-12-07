(function(win, doc, widget, tabs, type) {
  /**
   * @param {Object} el
   * @param {number} index
   * @param {Array} params
   * @param {Function} callback
   * @return {undefined}
   */
  function render(el, index, params, callback) {
    /**
     * @return {undefined}
     */
    function click() {
      button.hide();
      $(doc).off("click", click);
    }
    /**
     * @param {?} value
     * @return {undefined}
     */
    function render(value) {
      element.val(value);
      el.css("background", value);
      click();
      callback(value);
    }
    /**
     * @param {number} id
     * @return {?}
     */
    function handler(id) {
      return function() {
        render(params[id]);
      };
    }
    el.addClass("picker");
    var button = $("<div/>", {
      "class" : "pickpop"
    });
    var buffer = $("<div/>", {
      "class" : "colorPanel"
    });
    var element = $("<input/>", {
      "class" : "color-input",
      type : "text",
      value : params[index],
      maxlength : 7,
      tabindex : -1
    });
    var tmp;
    /** @type {number} */
    var i = 0;
    for (;i < params.length;i++) {
      tmp = $("<div/>", {
        "class" : "colorBox",
        css : {
          background : params[i]
        }
      });
      tmp.click(handler(i));
      buffer.append(tmp);
    }
    element.change(function() {
      render(element.val());
    });
    button.click(cancelEvent).html(buffer.append(element));
    el.css("background-color", params[index]).click(function(event) {
      cancelEvent(event);
      if ("none" === button.css("display")) {
        button.show();
        tabs.click(click);
      } else {
        click();
      }
    }).html(button);
  }
  /**
   * @param {Function} callback
   * @param {Object} q
   * @param {boolean} keepData
   * @param {?} method
   * @return {undefined}
   */
  function remove(callback, q, keepData, method) {
    /** @type {(number|string)} */
    q = q ? 1 : "";
    /** @type {(number|string)} */
    var failureMessage = $(".gen-anon").prop("checked") && !q ? 1 : "";
    /** @type {(number|string)} */
    var ex = $(".gen-private").prop("checked") && !q ? 1 : "";
    if (mm.useCanvas) {
      var orig = mm.currentMeme();
      var view = mm.ctx();
      var data = mm.canv();
      var ch = mm.getText();
      signCanvas(view, data.width, data.height, 67600);
      view = data.toDataURL("image/jpeg");
      if (keepData) {
        fn(view, true);
      }
      data = mm.memeData();
      var targ;
      /** @type {number} */
      var i = 0;
      for (;i < data.boxes.length;i++) {
        if (targ = data.boxes[i], "image" === targ.type && (0.5 < targ.w / orig.w && 0.5 < targ.h / orig.h)) {
          /** @type {number} */
          data.template = 0;
          break;
        }
      }
      $.extend(data, {
        imgData : view.substr(view.search(",") + 1),
        meme : orig.name,
        text : ch,
        type : "jpeg",
        anon : failureMessage,
        "private" : ex,
        isReply : q,
        stream_name : method
      });
      $.ajax({
        url : "/ajax_meme_done_canvas",
        type : "post",
        data : data,
        dataType : "json",
        /**
         * @param {Object} res
         * @return {undefined}
         */
        success : function(res) {
          if ("s3" === res.error) {
            callback(res, true);
          } else {
            if (res.error) {
              loading(false);
              error_dialog(res.error);
            } else {
              callback(res, ex);
            }
          }
          _gaq.push(["_trackEvent", "memedoneCanvas " + (res.error ? "Failure" : "Success"), orig.id + " - " + orig.name, I.user.user || "anon"]);
        }
      });
    } else {
      q = $.extend(mm.memeData(), {
        anon : failureMessage,
        "private" : ex,
        isReply : q,
        stream_name : method
      });
      loading("Generating Meme...");
      $.ajax({
        url : "/ajax_meme_done",
        type : "post",
        data : q,
        dataType : "json",
        /**
         * @param {Object} res
         * @return {undefined}
         */
        success : function(res) {
          loading(false);
          if (res.error) {
            error_dialog(res.error);
          } else {
            if (keepData) {
              fn();
            }
            callback(res, ex);
          }
          _gaq.push(["_trackEvent", "memedoneAjax " + (res.error ? "Failure" : "Success"), "derp", I.user.user || "anon"]);
        }
      });
    }
  }
  /**
   * @param {Object} cb
   * @param {string} doc
   * @return {undefined}
   */
  function start(cb, doc) {
    init(cb, doc, "meme", function() {
      mm.reset();
      imgDoneBox.hide();
    }, mm.currentMeme().name || "Untitled");
  }
  /**
   * @return {undefined}
   */
  function old() {
    if (!ea) {
      /** @type {boolean} */
      ea = true;
      $.getScript("//s.po.st/static/v3/post-widget.js");
    }
  }
  /**
   * @param {boolean} name
   * @param {boolean} computed
   * @return {undefined}
   */
  function fn(name, computed) {
    old();
    win.scrollTo(0, 0);
    win.imgDoneBox = new Box({
      html : '<div id="done"><img id="doneImage"' + (name ? ' src="' + name + '"' : "") + '/><div><div id="doneShare"></div><div id="doneUrl">' + (computed ? '<img src="//s.imgflip.com/preloader.gif"/>' : "") + '</div></div><div id="doneLinks"></div></div>',
      bg : "transparent",
      top : 20,
      hideX : true,
      noMaskClick : true
    });
  }
  /**
   * @param {Object} a
   * @param {string} body
   * @param {string} ext
   * @param {Object} element
   * @param {string} options
   * @return {undefined}
   */
  function init(a, body, ext, element, options) {
    _gaq.push("_trackPageview");
    var data = {
      meme : "jpg",
      gif : "gif",
      pie : "png",
      demotivational : "jpg"
    }[ext];
    /** @type {string} */
    var email = parseInt(a.iid).toString(36);
    /** @type {string} */
    var button = ("gif" === data ? "/gif/" : "/i/") + email;
    /** @type {boolean} */
    var p = true;
    var $img = $("#doneImage");
    var result = $("#doneUrl");
    if (!$img.attr("src")) {
      $img.attr("src", (body ? "//i2.imgflip.com/" : IMAGE_DOMAIN) + email + "." + data);
    } else {
      if (!body) {
        /** @type {Image} */
        var image = new Image;
        $(image).load(function() {
          $img.attr("src", $(this).attr("src"));
        });
        /** @type {string} */
        image.src = IMAGE_DOMAIN + email + "." + data;
      }
    }
    tabs.on("contextmenu", "#doneImage", function() {
      /** @type {boolean} */
      p = false;
    });
    result.html(embedCodes(email, data, body, !body && "gif" !== ext, ext)).find(".img-code").click(function() {
      $(this).select();
      /** @type {boolean} */
      p = false;
    }).on("focus", function() {
      /** @type {boolean} */
      p = false;
    });
    if (body || I.user.id) {
      if (!body) {
        if (0 < I.user.subsLeft) {
          result.append('<div class="done-msg">You have ' + I.user.subsLeft + " remaining submission" + (1 != I.user.subsLeft ? "s" : "") + ' today. <span id="done-submit" class="done-link a">Submit this image</span></div>');
          $("#done-submit").click(function() {
            /** @type {boolean} */
            p = false;
            submitImg(a.iid);
          });
        }
      }
    } else {
      /** @type {string} */
      image = '<div class="done-msg">You are not logged in! If you want to claim or delete this image, ';
      image += '<a class="done-link" target="_blank" href="/login?claim_iid=' + a.iid + '">Login and claim it</a>';
      image += ' or <a class="done-link" target="_blank" href="/signup?claim_iid=' + a.iid + '">Signup and claim it</a>';
      image += "</div>";
      result.append(image);
    }
    image = $('<div class="l but">&larr; Change settings</div>').click(function() {
      if (p) {
        if (!win.doneshare) {
          $.get("/ajax_delete_creation?iid=" + a.iid);
        }
      }
      /** @type {boolean} */
      win.doneshare = false;
      imgDoneBox.hide();
    });
    result = $('<div class="l but">Make another</div>').click(element);
    element = $("#doneLinks");
    element.html(image);
    if (body) {
      /** @type {string} */
      options = "This image is private. It will only be stored on imgflip servers long enough for you to download it.";
      if ("s3" === a.error) {
        /** @type {string} */
        options = '<span style="color:red">Whoops! Temporary error while uploading to clouds. You can download your image directly, or reload and try again.</span>';
      }
      $("#doneShare").html(options);
    } else {
      button = $("<a class='l but' href='" + button + "'>Go to image page</a>");
      button.click(function() {
        /** @type {boolean} */
        p = false;
      });
      element.append(button);
      insertShares("#doneShare", email, data, options);
    }
    element.append(result);
    if (!win.disable_zaz) {
      if (!body) {
        if (!("gif" === data)) {
          /** @type {string} */
          body = "http://www.zazzle.com/api/create/at-238106848995316905?rf=238106848995316905&ax=DesignBlast&sr=250237863432431386&t__useQpc=true&ed=true&t__smart=true&continueUrl=" + encodeURI("https://imgflip.com/i/" + email) + "&fwd=ProductPage&coverimage=" + encodeURI("https://i.imgflip.com/" + email + "." + data);
          body = $('<div class="done-msg"><a class="done-zazzle-link" target="_blank" href="' + body + '">Put this meme on a T-shirt/hat/mug/etc. on Zazzle!</a></div>');
          body.find(".done-zazzle-link").click(function() {
            /** @type {boolean} */
            p = false;
            _gaq.push(["_trackEvent", "zazzle click", win.mm ? win.mm.currentMeme().name : ext, I.user.id ? "logged-in" : "logged-out"]);
          });
          element.after(body);
        }
      }
    }
  }
  var ya = win.File && (win.FileReader && win.FileList);
  /**
   * @param {Object} info
   * @param {Object} item
   * @return {undefined}
   */
  MemeMaker = function(info, item) {
    /**
     * @param {?} json
     * @return {?}
     */
    function load(json) {
      return "/s/meme/" + json.url_name + ".jpg";
    }
    /**
     * @param {?} delay
     * @param {?} __
     * @return {?}
     */
    function callback(delay, __) {
      return Math.min(delay, Math.max(500, delay / __ * 500));
    }
    /**
     * @return {undefined}
     */
    function move() {
      var frame = slice();
      frame.w += frame.h;
      /** @type {number} */
      frame.h = frame.w - frame.h;
      frame.w -= frame.h;
      /** @type {number} */
      frame.rotation = 270 === frame.rotation ? 0 : ~~frame.rotation + 90;
      self.select(w);
    }
    /**
     * @param {boolean} recurring
     * @return {undefined}
     */
    function go(recurring) {
      if (recurring) {
        $fruits.removeClass("no-events").find(".cropBox").removeClass("off");
      } else {
        $fruits.addClass("no-events").find(".cropBox").addClass("off");
      }
      $e.find(".mm-toggle-drag").prop("checked", recurring);
    }
    /**
     * @return {undefined}
     */
    function f() {
      var el = $("#mm-upload");
      var h = $("#mm-show-upload");
      if ("none" === el.css("display")) {
        f.oldText = h.text();
        el.slideDown(200);
        h.text("Hide upload frame");
      } else {
        el.slideUp(200);
        h.text(f.oldText);
      }
    }
    /**
     * @return {undefined}
     */
    function process() {
      if (ya) {
        var file = $("#mm-upload-file")[0].files[0];
        if (-1 === file.type.search(/^image/)) {
          MSG("File is not an image", "red");
        } else {
          /** @type {FileReader} */
          var reader = new FileReader;
          /**
           * @param {Event} e
           * @return {undefined}
           */
          reader.onload = function(e) {
            /** @type {Image} */
            node = new Image;
            $(node).load(function(dataAndEvents) {
              info.custom = {
                id : 0,
                name : "Custom Image",
                w : node.width,
                h : node.height
              };
              self.select("custom");
            });
            node.src = e.target.result;
          };
          reader.readAsDataURL(file);
          f();
        }
      } else {
        alert("To use a fully private template, your browser needs to support the HTML5 File API. All modern browsers support the File API. If you cannot upgrade your browser right away, you can still create your meme if you set the template as public.");
      }
    }
    /**
     * @param {string} value
     * @param {string} text
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    function show(value, text, dataAndEvents) {
      /**
       * @return {undefined}
       */
      function restoreScript() {
        item.updateColors();
      }
      /** @type {string} */
      var s = '<div class="text-wrap"><textarea placeholder="' + ("top" == value ? "TOP TEXT" : "bottom" == value ? "BOTTOM TEXT" : "MORE TEXT") + '" class="mm-text"></textarea><div class="fontOps"><div class="picker mm-font-color-picker" title="Change Font Color"></div>';
      if (!inner) {
        s += '<div class="picker mm-outline-color-picker" title="Change Outline Color"></div><input class="ow" type="number" maxlength="1" min="0" max="9" title="Change Outline Width" tabindex="-1"/>';
      }
      s = $(s + "</div></div>");
      $e.find(".mm-text-boxes").append(s);
      var item = new draw(s, value, text);
      list.push(item);
      if (dataAndEvents) {
        item.autoResize(slice().w, slice().h, true);
      }
      render(s.find(".mm-font-color-picker"), 1, option, restoreScript);
      if (!inner) {
        render(s.find(".mm-outline-color-picker"), 0, option, restoreScript);
      }
      if (2 < list.length) {
        toggle(item.$box);
      }
      if (proxy) {
        proxy(s);
      }
    }
    /**
     * @param {Object} span
     * @return {undefined}
     */
    function toggle(span) {
      span.css({
        background : "#fff"
      }).animate({
        opacity : 0
      }, 500, function() {
        $(this).css({
          background : "none",
          opacity : 1
        });
      });
    }
    /**
     * @return {undefined}
     */
    function update() {
      if (ga) {
        if (img.naturalWidth) {
          if (0 < slice().rotation) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(slice().rotation / 180 * Math.PI);
            if (180 === slice().rotation) {
              ctx.translate(-canvas.width / 2, -canvas.height / 2);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              ctx.translate(canvas.width / 2, canvas.height / 2);
            } else {
              ctx.translate(-canvas.height / 2, -canvas.width / 2);
              ctx.drawImage(img, 0, 0, canvas.height, canvas.width);
              ctx.translate(canvas.height / 2, canvas.width / 2);
            }
            ctx.rotate(-slice().rotation / 180 * Math.PI);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
          } else {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (rect) {
          rect(ctx, canvas);
        }
        /** @type {number} */
        ctx.shadowBlur = 0;
        if (image) {
          ctx.drawImage(image, 0, 0);
        }
        /** @type {number} */
        var i = 0;
        for (;i < list.length;i++) {
          if (!("image" !== list[i].type)) {
            if (!list[i].hidden) {
              list[i].draw();
            }
          }
        }
        /** @type {number} */
        i = 0;
        for (;i < list.length;i++) {
          if (!("text" !== list[i].type)) {
            if (!list[i].hidden) {
              list[i].draw();
            }
          }
        }
      } else {
        /** @type {number} */
        i = 0;
        for (;i < list.length;i++) {
          if (!list[i].hidden) {
            list[i].draw();
          }
        }
      }
    }
    /**
     * @param {string} dt
     * @param {string} event
     * @param {Object} scope
     * @return {?}
     */
    function draw(dt, event, scope) {
      if (ga) {
        return new render(dt, event, scope);
      }
      scope = scope || {};
      var self = this;
      var to;
      /** @type {string} */
      self.type = "text";
      /** @type {string} */
      self.align = event;
      self.size = scope.maxFontSize || ($e.find(".mm-size").val() >> 0 || POST);
      /** @type {number} */
      self.outline_width = 2;
      /** @type {string} */
      self.text = "";
      /** @type {string} */
      self.font_color = "#ffffff";
      /** @type {string} */
      self.outline_color = "#000000";
      self.font = ($e.find(".mm-font").val() || "impact") + ",impac";
      /** @type {string} */
      self.$text_wrap = dt;
      var container = self.$box = $("<div/>", {
        "class" : "box cropBox off"
      });
      var node = dt.find(".mm-text");
      container.hover(function() {
        clearTimeout(h);
        $(".cropBox").removeClass("off");
      }, function() {
        /** @type {number} */
        h = setTimeout(function() {
          $(".cropBox").addClass("off");
        }, 10);
      });
      $e.find(".mm-font").change(function() {
        restoreView($(this).val());
      });
      $e.find(".mm-size").change(function() {
        /** @type {number} */
        self.size = to = $(this).val() >> 0;
        self.draw();
      }).keyup(function() {
        /** @type {number} */
        self.size = to = $(this).val() >> 0;
        self.draw();
      });
      dt.find(".ow").change(function() {
        /** @type {number} */
        self.outline_width = $(this).val() >> 0;
        if (4 < self.outline_width) {
          /** @type {number} */
          self.outline_width = 4;
        }
        self.draw();
      }).keyup(function() {
        /** @type {number} */
        self.outline_width = $(this).val() >> 0;
        if (4 < self.outline_width) {
          /** @type {number} */
          self.outline_width = 4;
        }
        self.draw();
      }).val(self.outline_width);
      /** @type {function (): undefined} */
      event = self.setText = function() {
        self.text = val ? node.val().toUpperCase() : node.val();
        self.draw();
      };
      /** @type {function (string): undefined} */
      var restoreView = self.setFont = function(font) {
        /** @type {string} */
        self.font = (font || "impact") + ",impac";
        self.draw();
      };
      /**
       * @return {?}
       */
      self.getFont = function() {
        return self.font.split(",")[0];
      };
      /**
       * @return {undefined}
       */
      self.updateColors = function() {
        self.font_color = dt.find(".mm-font-color-picker .color-input").val();
        self.outline_color = dt.find(".mm-outline-color-picker .color-input").val();
        self.draw();
      };
      /**
       * @return {?}
       */
      self.getVals = function() {
        var viewport = map.getVals();
        return[viewport.x / tileSize >> 0, viewport.y / tileSize >> 0, viewport.w / tileSize >> 0, viewport.h / tileSize >> 0, to / 1.32 / tileSize >> 0];
      };
      /**
       * @param {number} opt_attributes
       * @param {number} y
       * @param {number} recurring
       * @param {number} val
       * @return {undefined}
       */
      self.setVals = function(opt_attributes, y, recurring, val) {
        map.setVals(opt_attributes * tileSize >> 0, y * tileSize >> 0, recurring * tileSize >> 0, val * tileSize >> 0);
      };
      /**
       * @param {string} value
       * @return {undefined}
       */
      self.setAlign = function(value) {
        /** @type {string} */
        self.align = value;
      };
      /**
       * @param {?} v11
       * @param {?} y
       * @return {undefined}
       */
      self.autoResize = function(v11, y) {
        /** @type {number} */
        var recurring = v11 * tileSize - 10;
        /** @type {number} */
        var spyCall = y * tileSize / 4;
        /** @type {number} */
        var yOffset = 5;
        if ("bottom" === self.align) {
          /** @type {number} */
          yOffset = 3 * spyCall - 15;
        } else {
          if ("middle" === self.align) {
            /** @type {number} */
            yOffset = 1.5 * spyCall - 2;
          }
        }
        map.setVals(5, yOffset, recurring, spyCall);
      };
      /**
       * @return {undefined}
       */
      self.draw = function() {
        var options = map.getVals();
        var x = self.text;
        var i = x.length;
        /** @type {number} */
        var a = 2 + i / 30 >> 0;
        var n = x.split(" ").length;
        /** @type {number} */
        var k = Math.sqrt(i * options.h / options.w / 2.8) + 0.5 >> 0;
        if (!k) {
          /** @type {number} */
          k = 1;
        }
        if (k > n) {
          k = n;
        }
        /** @type {number} */
        var d = i / k;
        /** @type {Array} */
        var c = [];
        /** @type {Array} */
        n = [];
        /** @type {number} */
        var j = -1;
        for (;j <= k;j++) {
          n[j] = {};
        }
        /** @type {number} */
        var value = 0;
        /** @type {number} */
        value = 0;
        /** @type {number} */
        var from = (1.32 * self.size >> 0) + 2;
        if (-6 > to - from) {
          from = to + 6;
        }
        var h;
        j = $("#testline");
        do {
          from -= 2;
          /** @type {number} */
          h = 1.21 * from / 1.32 >> 0;
          /** @type {number} */
          var name = 0;
          for (;name <= k;name++) {
            if (name == k) {
              c[name] = i;
            } else {
              /** @type {number} */
              value = (d * name >> 0) - a;
              if (0 > value) {
                /** @type {number} */
                value = 0;
              }
              value = name ? x.indexOf(" ", value) : 0;
              c[name] = -1 == value ? i : value;
            }
            if (name) {
              n[name - 1].text = x.substr(c[name - 1], c[name] - c[name - 1]);
            }
          }
          /** @type {number} */
          value = 4 + 0.1 * from / 1.32;
          /** @type {number} */
          var w = 0;
          /** @type {number} */
          var t = value * (k - 1);
          /** @type {number} */
          name = 0;
          for (;name < k;name++) {
            j.css({
              font : "400 " + from + "px/" + h + "px " + self.font,
              height : h
            }).text(n[name].text);
            n[name].w = j.width();
            /** @type {number} */
            n[name].h = h;
            if (n[name].w > w) {
              w = n[name].w;
            }
            t += h;
          }
        } while (!(w <= options.w && t <= options.h));
        to = from;
        /** @type {number} */
        j = options.h - t;
        if ("top" === self.align) {
          /** @type {number} */
          j = 0;
        }
        if ("middle" === self.align) {
          j /= 2;
        }
        /** @type {number} */
        n[-1].h = 0;
        /** @type {number} */
        d = j;
        /** @type {string} */
        name = "";
        var Ca;
        var b = self.outline_width;
        /** @type {number} */
        j = 0;
        for (;j < k;j++) {
          x = n[j].w;
          i = n[j].h;
          /** @type {number} */
          a = (options.w - x) / 2;
          d = d + n[j - 1].h + (j ? value : 0);
          c = n[j].text;
          /** @type {number} */
          w = a - b;
          for (;w <= a + b;w++) {
            /** @type {number} */
            t = d - b;
            for (;t <= d + b;t++) {
              /** @type {string} */
              Ca = w == a && t == d ? "z-index:2;color:" + self.font_color + ";" : "color:" + self.outline_color + ";";
              name += "<div class='line' style='font:400 " + from + "px/" + h + "px " + self.font + ";" + Ca + "top:" + t + "px;left:" + w + "px;width:" + x + "px;height:" + i + "px;'>" + c + "</div>";
            }
          }
        }
        container.find(".line").remove();
        container.append(name);
      };
      var map = new Dragger(container, $fruits, self.draw);
      node.change(event).keyup(event);
      content.after(container);
    }
    /**
     * @param {Object} rows
     * @param {Object} input
     * @param {Object} object
     * @return {undefined}
     */
    function render(rows, input, object) {
      object = object || {};
      var self = this;
      var index;
      var after = !inner && $e.find(".mm-use-shadow").prop("checked");
      /** @type {string} */
      self.type = "text";
      /** @type {Object} */
      self.align = input;
      self.size = object.maxFontSize || ($e.find(".mm-size").val() >> 0 || POST);
      /** @type {number} */
      self.outline_width = after ? 5 : 1;
      /** @type {string} */
      self.text = "";
      /** @type {string} */
      self.font_color = "#ffffff";
      /** @type {string} */
      self.outline_color = "#000000";
      self.font = ($e.find(".mm-font").val() || "impact") + ",impac";
      /** @type {Object} */
      self.$text_wrap = rows;
      input = self.$box = $("<div/>", {
        "class" : "box cropBox off"
      });
      var callback = new Dragger(input, $fruits, update);
      var select = rows.find(".mm-text");
      input.hover(function() {
        clearTimeout(h);
        $(".cropBox").removeClass("off");
      }, function() {
        /** @type {number} */
        h = setTimeout(function() {
          $(".cropBox").addClass("off");
        }, 10);
      }).on("vmousedown", function() {
        $(".cropBox").removeClass("off");
      });
      $e.find(".mm-font").change(function() {
        compiled($(this).val());
      }).end().find(".mm-size").change(function() {
        /** @type {number} */
        self.size = index = $(this).val() >> 0;
        update();
      }).keyup(function() {
        /** @type {number} */
        self.size = index = $(this).val() >> 0;
        update();
      }).end().find(".mm-use-shadow").change(function() {
        /** @type {boolean} */
        after = !!$(this).prop("checked");
        rows.find(".ow").val(self.outline_width = after ? 5 : 1);
        update();
      });
      rows.find(".ow").change(function() {
        /** @type {number} */
        self.outline_width = $(this).val() >> 0;
        update();
      }).keyup(function() {
        /** @type {number} */
        self.outline_width = $(this).val() >> 0;
        update();
      }).val(self.outline_width);
      /** @type {function (): undefined} */
      var scheduleParse = self.setText = function() {
        self.text = val ? select.val().toUpperCase() : select.val();
        update();
      };
      /** @type {function (string): undefined} */
      var compiled = self.setFont = function(font) {
        /** @type {string} */
        self.font = (font || "impact") + ",impac";
        update();
      };
      /**
       * @return {?}
       */
      self.getFont = function() {
        return self.font.split(",")[0];
      };
      /**
       * @return {undefined}
       */
      self.updateColors = function() {
        self.font_color = rows.find(".mm-font-color-picker .color-input").val();
        self.outline_color = rows.find(".mm-outline-color-picker .color-input").val();
        update();
      };
      /**
       * @return {?}
       */
      self.getVals = function() {
        var viewport = callback.getVals();
        return[viewport.x / tileSize >> 0, viewport.y / tileSize >> 0, viewport.w / tileSize >> 0, viewport.h / tileSize >> 0, index / 1.32 / tileSize >> 0];
      };
      /**
       * @param {number} opt_attributes
       * @param {number} y
       * @param {number} recurring
       * @param {number} val
       * @return {undefined}
       */
      self.setVals = function(opt_attributes, y, recurring, val) {
        callback.setVals(opt_attributes * tileSize >> 0, y * tileSize >> 0, recurring * tileSize >> 0, val * tileSize >> 0);
      };
      /**
       * @param {string} value
       * @return {undefined}
       */
      self.setAlign = function(value) {
        /** @type {string} */
        self.align = value;
      };
      /**
       * @param {number} i
       * @param {number} attributes
       * @param {number} recurring
       * @return {undefined}
       */
      self.autoResize = function(i, attributes, recurring) {
        var y;
        if (recurring) {
          /** @type {number} */
          i = i * tileSize - 10;
          /** @type {number} */
          y = attributes * tileSize / 4;
          /** @type {number} */
          recurring = attributes = 5;
          if ("bottom" === self.align) {
            /** @type {number} */
            recurring = 3 * y - 13;
          } else {
            if ("middle" === self.align) {
              /** @type {number} */
              recurring = 1.5 * y - 2;
            }
          }
        } else {
          /** @type {number} */
          y = height / tileHeight;
          var c = callback.getVals();
          /** @type {number} */
          attributes = y * c.x;
          /** @type {number} */
          recurring = y * c.y;
          /** @type {number} */
          i = y * c.w;
          y *= c.h;
        }
        callback.setVals(attributes, recurring, i, y);
      };
      /**
       * @return {undefined}
       */
      self.draw = function() {
        var rect = callback.getVals();
        /** @type {number} */
        var len = width / height;
        rect = {
          x : Math.round(len * rect.x),
          y : Math.round(len * rect.y),
          w : Math.round(len * rect.w),
          h : Math.round(len * rect.h)
        };
        ctx.shadowBlur = after ? self.outline_width : 0;
        ctx.shadowColor = after ? self.outline_color : "";
        var x = self.text;
        var y = x.length;
        /** @type {number} */
        var txt = 2 + y / 30 >> 0;
        var n = x.split(" ").length;
        if (!(len = Math.sqrt(y * rect.h / rect.w / 2.8) + 0.5 >> 0)) {
          /** @type {number} */
          len = 1;
        }
        if (len > n) {
          len = n;
        }
        /** @type {number} */
        var ratio = y / len;
        /** @type {Array} */
        var v = [];
        /** @type {Array} */
        n = [];
        /** @type {number} */
        var i = -1;
        for (;i <= len;i++) {
          n[i] = {};
        }
        /** @type {number} */
        var value = 0;
        /** @type {number} */
        value = 0;
        i = self.size + 2;
        if (-6 > index - i) {
          i = index + 6;
        }
        do {
          i -= 2;
          /** @type {string} */
          ctx.font = i + "px " + self.font;
          /** @type {number} */
          var j = 0;
          for (;j <= len;j++) {
            if (j == len) {
              v[j] = y;
            } else {
              /** @type {number} */
              value = (ratio * j >> 0) - txt;
              if (0 > value) {
                /** @type {number} */
                value = 0;
              }
              value = j ? x.indexOf(" ", value) : 0;
              v[j] = -1 == value ? y : value;
            }
            if (j) {
              n[j - 1].text = x.substr(v[j - 1], v[j] - v[j - 1]);
            }
          }
          /** @type {number} */
          value = 4 + 0.1 * i;
          /** @type {number} */
          var w = 0;
          /** @type {number} */
          var h = value * (len - 1);
          /** @type {number} */
          j = 0;
          for (;j < len;j++) {
            n[j].w = ctx.measureText(n[j].text).width;
            /** @type {number} */
            n[j].h = 0.85 * i;
            if (n[j].w > w) {
              w = n[j].w;
            }
            h += 0.85 * i;
          }
        } while (w > rect.w || h > rect.h);
        index = i;
        /** @type {number} */
        x = rect.h - h;
        if ("top" === self.align) {
          /** @type {number} */
          x = 0;
        }
        if ("middle" === self.align) {
          x /= 2;
        }
        /** @type {number} */
        n[-1].h = 0;
        /** @type {number} */
        y = x;
        /** @type {number} */
        i = 0;
        for (;i < len;i++) {
          if (x = (rect.w - n[i].w) / 2, y += n[i].h, i && (y += value), txt = n[i].text, ctx.fillStyle = self.font_color, after) {
            /** @type {number} */
            ratio = 0;
            for (;6 > ratio;ratio++) {
              ctx.fillText(txt, rect.x + x, rect.y + y);
            }
          } else {
            ctx.strokeStyle = self.outline_color;
            ctx.lineWidth = self.outline_width;
            ctx.fillText(txt, rect.x + x, rect.y + y);
            if (!inner) {
              ctx.strokeText(txt, rect.x + x, rect.y + y);
            }
          }
        }
      };
      select.change(scheduleParse).keyup(scheduleParse);
      element.after(input);
      if (object.coords) {
        object = object.coords;
        callback.setVals(object[0], object[1], object[2], object[3]);
      }
    }
    /**
     * @param {Object} img
     * @return {undefined}
     */
    function handler(img) {
      /** @type {string} */
      this.type = "image";
      /** @type {Object} */
      this.element = img;
      var button = this.$box = $("<div/>", {
        "class" : "box cropBox off"
      });
      var console = new Dragger(button, $fruits, update);
      button.hover(function() {
        clearTimeout(h);
        $(".cropBox").removeClass("off");
      }, function() {
        /** @type {number} */
        h = setTimeout(function() {
          $(".cropBox").addClass("off");
        }, 10);
      });
      /**
       * @return {?}
       */
      this.getVals = function() {
        var viewport = console.getVals();
        return[viewport.x / tileSize >> 0, viewport.y / tileSize >> 0, viewport.w / tileSize >> 0, viewport.h / tileSize >> 0];
      };
      /**
       * @param {number} attributes
       * @param {number} width
       * @param {number} recurring
       * @return {undefined}
       */
      this.autoResize = function(attributes, width, recurring) {
        var y;
        if (recurring) {
          /** @type {number} */
          attributes = width = Math.min(attributes * tileSize / 3 >> 0, width * tileSize / 3 >> 0);
          if (img.width > img.height) {
            /** @type {number} */
            recurring = attributes;
            /** @type {number} */
            y = img.height / img.width * recurring;
          } else {
            /** @type {number} */
            y = attributes;
            /** @type {number} */
            recurring = img.width / img.height * y;
          }
        } else {
          /** @type {number} */
          y = height / tileHeight;
          var c = console.getVals();
          /** @type {number} */
          attributes = y * c.x;
          /** @type {number} */
          width = y * c.y;
          /** @type {number} */
          recurring = y * c.w;
          y *= c.h;
        }
        console.setVals(attributes, width, recurring, y);
      };
      /**
       * @return {undefined}
       */
      this.draw = function() {
        var room = console.getVals();
        /** @type {number} */
        var scale = width / height;
        room = {
          x : Math.round(scale * room.x),
          y : Math.round(scale * room.y),
          w : Math.round(scale * room.w),
          h : Math.round(scale * room.h)
        };
        ctx.drawImage(img, ~~room.x, ~~room.y, ~~room.w, ~~room.h);
      };
      element.after(button);
      this.autoResize(slice().w, slice().h, true);
      console.lockRatio();
    }
    /**
     * @return {undefined}
     */
    function initialize() {
      var last = li.find(".draw");
      if (last.hasClass("set")) {
        last.removeClass("set");
        last.text("Draw");
        li.find(".mm-add-img, .add-scumbag, .mm-rotate").show();
        li.find(".picker,.erase").hide();
        $(".box").show();
        element.off("mousedown", resize).off("mousemove", onMouseMove);
        $(doc).off("mouseup", dragEnd);
      } else {
        last.addClass("set");
        last.text("Stop Drawing");
        li.find(".mm-add-img, .add-scumbag, .mm-rotate").hide();
        li.find(".picker,.erase").show();
        $(".box").hide();
        element.mousedown(resize).mousemove(onMouseMove);
        $(doc).mouseup(dragEnd);
      }
    }
    /**
     * @param {number} b
     * @return {undefined}
     */
    function resize(b) {
      b.preventDefault();
      var x = b.clientX - $(this).offset().left + $(win).scrollLeft();
      b = b.clientY - $(this).offset().top + $(win).scrollTop();
      /** @type {number} */
      var scale = width / height;
      /** @type {number} */
      x = Math.round(scale * x);
      /** @type {number} */
      b = Math.round(scale * b);
      context.beginPath();
      ctx.beginPath();
      context.moveTo(x, b);
      ctx.moveTo(x, b);
      ctx.save();
      /** @type {number} */
      ctx.shadowBlur = 0;
      ctx.strokeStyle = text;
      context.strokeStyle = text;
      $("body").addClass("nosel");
      /** @type {boolean} */
      s = true;
    }
    /**
     * @param {number} x
     * @return {undefined}
     */
    function onMouseMove(x) {
      if (s) {
        var ex = x.clientX - $(this).offset().left + $(win).scrollLeft();
        x = x.clientY - $(this).offset().top + $(win).scrollTop();
        /** @type {number} */
        var scale = width / height;
        /** @type {number} */
        ex = Math.round(scale * ex);
        /** @type {number} */
        x = Math.round(scale * x);
        context.lineTo(ex, x);
        context.stroke();
        ctx.lineTo(ex, x);
        ctx.stroke();
      }
    }
    /**
     * @return {undefined}
     */
    function dragEnd() {
      if (s) {
        ctx.restore();
        /** @type {number} */
        s = 0;
        $("body").removeClass("nosel");
        /** @type {boolean} */
        has_drawing = true;
      }
    }
    /**
     * @return {undefined}
     */
    function parse() {
      $("#mygen").hide();
      $("#memewrap").show();
      $(".mm-tab").removeClass("set");
      $("#memetab").addClass("set");
      if (!$("#memewrap").html()) {
        /** @type {number} */
        var a = 0;
        /** @type {string} */
        var pathString = "";
        /** @type {number} */
        var c = 0;
        var e;
        /** @type {string} */
        var d = "//s.imgflip.com/ms" + spriteNum + ".jpg";
        var key;
        for (key in info) {
          if (info.hasOwnProperty(key)) {
            if (!isNaN(key)) {
              a++;
              /** @type {string} */
              e = 'style="background:url(' + d + ") " + -50 * c + 'px 0px;"';
              c++;
              pathString += '<div class="im" ' + e + " onclick=\"mm.changeMeme('" + key + '\')" alt="' + info[key].name + ' Meme Image" title="Make ' + info[key].name + ' Meme"></div>';
            }
          }
        }
        $("#memewrap").append(pathString + '<a class="y but" id="allTemplates" href="/memetemplates">View All Meme Templates</a>');
      }
      bind();
    }
    /**
     * @return {undefined}
     */
    function start() {
      $("#memewrap").hide();
      $("#mygen").show();
      $(".mm-tab").removeClass("set");
      $("#mytab").addClass("set");
      if (!start.done) {
        if (I.user.id || -1 === win.location.href.search("memegenerator")) {
          $.getJSON("/ajax_get_my_generators", function(details) {
            if (details.error) {
              MSG(details.error, "red");
            } else {
              $.extend(info, details);
              /** @type {number} */
              details = 0;
              /** @type {string} */
              var htmlString = "";
              var field;
              var e;
              var i;
              for (i in info) {
                field = info[i];
                if (isNaN(i)) {
                  if ("U" != i) {
                    e = "custom" === i ? node.src : IMAGE_DOMAIN + "2/" + field.id.toString(36) + ".jpg";
                    htmlString += "<img class='im um' src='" + e + "' onclick='mm.changeMeme(\"" + i + "\")' title='" + field.name + "'/>";
                    details++;
                  }
                }
              }
              if (htmlString) {
                $("#mygen").append(htmlString);
              } else {
                $("#mygen").append("<div style='line-height:50px;padding-left:10px;'>Upload an image to create your first custom generator!</div>");
              }
              bind();
            }
          });
          /** @type {boolean} */
          start.done = true;
        } else {
          $("#mygen").append("<div style='line-height:50px;padding-left:10px;'><a rel='nofollow' href='/login?redirect=/memegenerator'>Login</a> or <a rel='nofollow' href='/signup?redirect=/memegenerator'>Signup</a> to view any custom templates you upload!");
        }
      }
    }
    /**
     * @return {undefined}
     */
    function bind() {
      $(".im").hover(function() {
        var $title = $("#mm-meme-title");
        var title = $(this).hasClass("um") ? this.title : this.title.substr(5, this.title.length - 10);
        title = title || "Untitled Template";
        if (title == slice().name) {
          $title.text(title).css({
            "font-weight" : 700
          });
        } else {
          $title.text(title).css({
            "font-weight" : 400
          });
        }
      }, function() {
        $("#mm-meme-title").text(slice().name || "Untitled Template").css({
          "font-weight" : 700
        });
      });
    }
    /**
     * @return {undefined}
     */
    function init() {
      /**
       * @param {boolean} charset
       * @return {undefined}
       */
      function get(charset) {
        var type = inputEl.val().trim();
        if (!(3 > type.length || true !== charset && type === functionType)) {
          /** @type {number} */
          var element = +new Date;
          /** @type {number} */
          openElement = element;
          functionType = type;
          charset = update();
          /** @type {string} */
          var key = type + (charset ? "@^" : "");
          if (iterable[key]) {
            callback(iterable[key]);
          } else {
            $.ajax({
              url : "/ajax_meme_search",
              data : {
                q : type,
                include_user_memes : charset ? 1 : 0
              },
              dataType : "json",
              /**
               * @param {Object} data
               * @return {undefined}
               */
              success : function(data) {
                if (element === openElement) {
                  if (data.error) {
                    error_dialog(data.error);
                  } else {
                    iterable[key] = data.results;
                    callback(data.results);
                  }
                }
              }
            });
          }
        }
      }
      /**
       * @return {?}
       */
      function update() {
        return $this.find(".mm-add-img-show-user-memes").prop("checked");
      }
      /**
       * @param {Object} session
       * @return {undefined}
       */
      function callback(session) {
        var ret;
        var i;
        /** @type {string} */
        ret = "" + fn("Featured Memes");
        if (session && session.featured) {
          /** @type {number} */
          i = 0;
          for (;i < session.featured.length;i++) {
            ret += complete(session.featured[i]);
          }
        } else {
          ret += dispatch();
        }
        if (update()) {
          if (ret += fn("User Templates"), session && session.user) {
            /** @type {number} */
            i = 0;
            for (;i < session.user.length;i++) {
              ret += complete(session.user[i]);
            }
          } else {
            ret += dispatch();
          }
        }
        if (session && session.my) {
          ret += fn("My Templates");
          /** @type {number} */
          i = 0;
          for (;i < session.my.length;i++) {
            ret += complete(session.my[i]);
          }
        }
        $this.find(".mm-search-results").html(ret);
      }
      /**
       * @param {string} range
       * @return {?}
       */
      function fn(range) {
        return'<tr><td colspan="2" class="mm-search-section-title">' + range + "</td></tr>";
      }
      /**
       * @param {Object} status
       * @return {?}
       */
      function complete(status) {
        var elem;
        /** @type {string} */
        elem = "" + ('<tr class="mm-search-result" data-id="' + status.id + '">');
        /** @type {string} */
        elem = elem + '<td class="mm-search-result-img-td">' + ('<img class="mm-search-result-img" src="https://i.imgflip.com/2/' + (~~status.id).toString(36) + '.jpg"/>');
        elem += "</td>";
        elem += '<td class="mm-search-result-text">' + status.name + "</td>";
        return elem += "</tr>";
      }
      /**
       * @return {?}
       */
      function dispatch() {
        return'<tr class="mm-search-result"><td colspan="2" class="mm-search-result-text">0 results</td></tr>';
      }
      /**
       * @param {number} data
       * @param {number} index
       * @return {undefined}
       */
      function done(data, index) {
        loading("Adding Image...");
        if ($this.find(".mm-add-img-type-inside").hasClass("selected")) {
          init(data);
        } else {
          render(data, index);
        }
        child.hide();
      }
      /**
       * @param {number} data
       * @return {undefined}
       */
      function init(data) {
        /** @type {Image} */
        var img = new Image;
        if ("http" === data.substr(0, 4)) {
          img.setAttribute("crossorigin", "anonymous");
        }
        $(img).load(function() {
          list.push(new handler(img));
          update();
          loading(false);
          go(true);
        });
        /** @type {number} */
        img.src = data;
      }
      /**
       * @param {number} frame
       * @param {number} property
       * @return {undefined}
       */
      function render(frame, property) {
        var obj = load(slice());
        /** @type {Image} */
        var img = new Image;
        /** @type {Image} */
        var image = new Image;
        if ("http" === obj.substr(0, 4)) {
          img.setAttribute("crossorigin", "anonymous");
        }
        if ("http" === frame.substr(0, 4)) {
          image.setAttribute("crossorigin", "anonymous");
        }
        /** @type {boolean} */
        var h = false;
        /**
         * @return {undefined}
         */
        var init = function() {
          if (h) {
            /** @type {number} */
            var width = Math.min(img.width, image.width);
            /** @type {number} */
            var y = width / img.width * img.height;
            /** @type {number} */
            var height = width / image.width * image.height;
            /** @type {Element} */
            var c = doc.createElement("canvas");
            /** @type {number} */
            c.width = width;
            /** @type {number} */
            c.height = y + height;
            var ctx = c.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, y);
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, y, width, height);
            /** @type {Image} */
            node = new Image;
            $(node).load(function() {
              var keys = slice().templates || [slice().id];
              keys.push(property);
              info.custom = {
                id : 0,
                templates : keys,
                name : "Custom Image",
                w : node.width,
                h : node.height
              };
              self.select("custom");
              loading(false);
            });
            node.src = c.toDataURL("image/png");
          } else {
            /** @type {boolean} */
            h = true;
          }
        };
        $(img).load(init);
        $(image).load(init);
        img.src = obj;
        /** @type {number} */
        image.src = frame;
      }
      var thisObject;
      /** @type {string} */
      thisObject = '<div class="mm-add-img-popup"><div class="mm-add-img-types">';
      thisObject += '<div class="mm-add-img-type mm-add-img-type-inside selected">';
      thisObject += '<div class="mm-add-img-type-title">Inside Current Image</div>';
      thisObject += '<div class="mm-add-img-type-diagram"><div class="mm-add-img-current"></div><div class="mm-add-img-new"></div></div>';
      thisObject += "</div>";
      thisObject += '<div class="mm-add-img-type mm-add-img-type-below">';
      thisObject += '<div class="mm-add-img-type-title">Below Current Image</div>';
      thisObject += '<div class="mm-add-img-type-diagram"><div class="mm-add-img-current"></div><div class="mm-add-img-new"></div></div>';
      thisObject += "</div>";
      thisObject += "</div>";
      thisObject += '<div class="mm-add-img-choose-img">';
      thisObject += '<div class="mm-add-img-upload-btn l but">Upload Image<input type="file" class="hidden-file-input"/></div>';
      thisObject += '<div class="mm-add-img-or">OR</div>';
      thisObject += '<input class="mm-add-img-search" type="text" placeholder="Search Memes"/>';
      thisObject += '<label class="mm-add-img-show-user-memes-label"><input class="mm-add-img-show-user-memes" type="checkbox"/> Include User Templates</label>';
      thisObject += '<table class="mm-search-results"></table>';
      thisObject += "</div>";
      thisObject += "</div>";
      var $this = $(thisObject);
      var inputEl = $this.find(".mm-add-img-search");
      var child = new Box({
        html : $this
      });
      /** @type {string} */
      var functionType = "";
      var iterable = {};
      var openElement;
      $this.on("vclick", ".mm-add-img-type", function(event) {
        var $target = $(this);
        $target.parent().find(".mm-add-img-type").removeClass("selected");
        $target.addClass("selected");
        return cancelEvent(event);
      });
      $this.on("change", ".mm-add-img-show-user-memes", function() {
        if ($(this).prop("checked")) {
          if (confirm("This will allow any user-uploaded meme template to display in the search results, which may contain not-safe-for-work content. Are you sure you want to display user-uploaded memes?")) {
            get(true);
          } else {
            $(this).prop("checked", false);
          }
        } else {
          get(true);
        }
      });
      $this.on("keyup", ".mm-add-img-search", debounce(get, 300));
      $this.on("change", ".mm-add-img-search", debounce(get, 300));
      $this.on("vclick", ".mm-search-result", function(event) {
        var name = $(this).data("id");
        if (name) {
          return done(load({
            id : name
          }), name), cancelEvent(event);
        }
      });
      $this.on("change", ".mm-add-img-upload-btn input", function() {
        if (ya) {
          var file = this.files[0];
          if (-1 === file.type.search(/^image/)) {
            error_dialog("That file is not an image!");
          } else {
            /** @type {FileReader} */
            var reader = new FileReader;
            /**
             * @param {Event} e
             * @return {undefined}
             */
            reader.onload = function(e) {
              done(e.target.result, 0);
            };
            reader.readAsDataURL(file);
          }
        } else {
          error_dialog("Your browser must have HTML5 File support to upload an image. Try upgrading to a modern browser.");
        }
      });
    }
    item = item || {};
    var self = this;
    var $win = $(item.$previewOuter || "#mm-preview-outer");
    var $fruits = $(item.$preview || ".mm-preview");
    var element = $fruits.find(".mm-canv");
    var content = $fruits.find(".mm-img");
    var $e = $(item.settingsDiv || "#mm-settings");
    var target = $("#mm-search");
    var width;
    var n;
    var height = $win.width();
    var tileHeight = height;
    var value = item.noDraw;
    /** @type {number} */
    var blockCount = item.numTexts >> 0;
    var POST = item.fontSize || 50;
    /** @type {boolean} */
    var val = item.forceCaps !== type ? !!item.forceCaps : true;
    var inner = item.disableOutline;
    /** @type {boolean} */
    var err = false;
    /** @type {Array.<string>} */
    var option = "#000000 #ffffff #995555 #ff3333 #ff8800 #eeee00 #22ee22 #3333ff #00bff3 #dd00cc".split(" ");
    var pattern = item.scumbagPath || "/img_util/scumbag_hat2.png";
    /** @type {boolean} */
    var has_drawing = false;
    /** @type {number} */
    var tileSize = 1;
    var proxy = item.textAdded;
    var rect = item.preDraw;
    var ctx;
    var image;
    var context;
    var pos;
    var text;
    var img;
    var list;
    var h;
    var s;
    var w;
    var node;
    var canvas = element[0];
    var li;
    var ga = self.useCanvas = canvas.getContext && (canvas.toDataURL && ((ctx = canvas.getContext("2d")) && -1 === navigator.userAgent.search("Android 2.")));
    /**
     * @param {?} i
     * @return {undefined}
     */
    self.hideBox = function(i) {
      /** @type {boolean} */
      list[i].hidden = true;
      update();
    };
    /**
     * @param {?} id
     * @return {undefined}
     */
    self.showBox = function(id) {
      /** @type {boolean} */
      list[id].hidden = false;
      update();
    };
    /**
     * @param {number} cur
     * @return {undefined}
     */
    self.setWidth = function(cur) {
      tileHeight = height || cur;
      /** @type {number} */
      height = cur;
      /** @type {number} */
      tileSize = Math.min(1, height / slice().w);
      /** @type {number} */
      cur = 0;
      for (;cur < list.length;cur++) {
        list[cur].autoResize(slice().w, slice().h, false);
      }
    };
    /**
     * @return {?}
     */
    self.previewWidth = function() {
      return height;
    };
    /**
     * @return {?}
     */
    self.canvasWidth = function() {
      return width;
    };
    /**
     * @param {?} l2
     * @return {undefined}
     */
    self.setCanvasWidth = function(l2) {
      var img = slice();
      /** @type {number} */
      width = Math.min(img.w, l2);
      /** @type {number} */
      n = Math.round(img.h / img.w * width);
      element.attr({
        width : width,
        height : n
      });
      if (image) {
        $(image).attr({
          width : width,
          height : n
        });
        /** @type {boolean} */
        has_drawing = false;
      }
      self.setWidth(Math.min(width, Math.min(img.w, $win.width())));
    };
    /**
     * @param {string} font
     * @return {undefined}
     */
    self.setFont = function(font) {
      /** @type {number} */
      var p = 0;
      for (;p < list.length;p++) {
        if ("text" === list[p].type) {
          list[p].setFont(font);
        }
      }
    };
    /**
     * @return {?}
     */
    self.ctx = function() {
      return ctx;
    };
    /**
     * @return {?}
     */
    self.canv = function() {
      return canvas;
    };
    /** @type {function (): ?} */
    var slice = self.currentMeme = function() {
      return info[w];
    };
    /** @type {function (string): ?} */
    self.text = self.getText = function(t) {
      if (t !== type) {
        return list[t] ? (list[t].text || "").trim() : "";
      }
      /** @type {string} */
      t = "";
      /** @type {number} */
      var i = 0;
      for (;i < list.length;i++) {
        if (list[i].text) {
          t += (t ? " " : "") + list[i].text.trim();
        }
      }
      return t;
    };
    /**
     * @param {Function} type
     * @return {?}
     */
    self.boxCount = function(type) {
      /** @type {number} */
      var boxCount = 0;
      /** @type {number} */
      var last = list.length - 1;
      for (;0 <= last;last--) {
        if (!(type && list[last].type !== type)) {
          boxCount++;
        }
      }
      return boxCount;
    };
    /**
     * @return {?}
     */
    self.hasDrawing = function() {
      return has_drawing;
    };
    /**
     * @return {?}
     */
    self.isEmpty = function() {
      return!self.getText() && (!self.boxCount("image") && !self.hasDrawing());
    };
    /**
     * @param {number} details
     * @param {number} onlyIfAbsent
     * @return {?}
     */
    self.memeData = function(details, onlyIfAbsent) {
      /** @type {number} */
      var key = 0;
      /** @type {Array} */
      var items = [];
      var keys;
      /** @type {number} */
      var num_imgs = 0;
      /** @type {number} */
      var num_scumbag_hats = 0;
      details = details || 1;
      onlyIfAbsent = onlyIfAbsent || 1;
      /** @type {number} */
      var i = 0;
      for (;i < list.length;i++) {
        keys = list[i].getVals();
        items.push({
          type : list[i].type,
          x : details * keys[0] >> 0,
          y : onlyIfAbsent * keys[1] >> 0,
          w : details * keys[2] >> 0,
          h : onlyIfAbsent * keys[3] >> 0
        });
        if ("text" === list[i].type) {
          $.extend(items[i], {
            color : list[i].font_color,
            outline_width : list[i].outline_width,
            outline_color : list[i].outline_color,
            text : val ? list[i].text.toUpperCase() : list[i].text
          });
          if (keys[4] > key) {
            key = keys[4];
          }
        } else {
          if ("image" === list[i].type) {
            num_imgs++;
            if (-1 !== list[i].element.src.search(pattern)) {
              num_scumbag_hats++;
            }
          }
        }
      }
      return{
        boxes : items,
        size : key * onlyIfAbsent >> 0,
        template : 100 < slice().id ? slice().id : "",
        templates : slice().templates,
        font : list[0].getFont(),
        force_caps : val ? 1 : 0,
        num_imgs : num_imgs,
        num_scumbag_hats : num_scumbag_hats,
        has_drawing : has_drawing ? 1 : 0
      };
    };
    /**
     * @return {undefined}
     */
    self.ajaxSetPositions = function() {
      /** @type {Array} */
      var positions = [];
      /** @type {number} */
      var p = 0;
      for (;p < list.length;p++) {
        if ("text" === list[p].type) {
          positions.push(list[p].getVals());
        }
      }
      loading("Setting Meme Positions");
      $.ajax({
        url : "/ajax_set_meme_positions",
        data : {
          meme_id : slice().id,
          positions : positions
        },
        /**
         * @return {undefined}
         */
        success : function() {
          loading(false);
        }
      });
    };
    /**
     * @return {undefined}
     */
    self.reset = function() {
      $(".mm-text").val("");
      $(".gen-anon, .gen-private").attr("checked", false);
      /** @type {number} */
      var i = list.length - 1;
      for (;0 <= i;i--) {
        if (2 > i) {
          /** @type {string} */
          list[i].text = "";
        } else {
          self.removeBox(i);
        }
      }
      if ($("#mm-preview-outer .draw").hasClass("set")) {
        initialize();
      }
      if (ga) {
        image.width = image.width;
        /** @type {boolean} */
        has_drawing = false;
      }
      update();
    };
    /**
     * @param {number} pos
     * @return {undefined}
     */
    self.removeBox = function(pos) {
      list[pos].$box.remove();
      if (list[pos].$text_wrap) {
        list[pos].$text_wrap.remove();
      }
      list.splice(pos, 1);
    };
    /**
     * @param {number} i
     * @return {undefined}
     */
    self.select = function(i) {
      /** @type {number} */
      w = i;
      var data = info[i];
      var y = data.w;
      var h = data.h;
      if (err) {
        width = data.w;
        n = data.h;
      } else {
        width = callback(data.w, data.h);
        /** @type {number} */
        n = data.h / data.w * width;
      }
      tileHeight = height;
      /** @type {number} */
      height = Math.min(width, Math.min(data.w, $win.width()));
      /** @type {number} */
      tileSize = Math.min(1, height / data.w);
      $("#mm-meme-title").text(data.name || "Untitled Template");
      var t;
      /** @type {number} */
      i = list.length - 1;
      for (;0 <= i;i--) {
        if ("text" !== list[i].type) {
          self.removeBox(i);
        }
      }
      /** @type {number} */
      var x = Math.min(2, list.length);
      if (data.positions) {
        /** @type {*} */
        t = JSON.parse(data.positions);
        i = list.length;
        for (;i < list.length + t.length - self.boxCount("text");i++) {
          self.addText("middle");
        }
        x = t.length;
      } else {
        if (1 < list.length) {
          list[0].setAlign("top");
          list[1].setAlign("bottom");
        }
      }
      /** @type {number} */
      i = list.length - 1;
      for (;i >= x;i--) {
        self.removeBox(i);
      }
      /** @type {number} */
      i = 0;
      for (;i < list.length;i++) {
        list[i].autoResize(y, h, true);
        if (t) {
          if (t[i]) {
            list[i].setAlign("middle");
            list[i].setVals(t[i][0], t[i][1], t[i][2], t[i][3]);
          }
        }
      }
      if (y > height) {
        /** @type {number} */
        h = height / y * h >> 0;
        /** @type {number} */
        y = height;
      }
      if (ga) {
        t = load(data);
        element.attr({
          width : width,
          height : n
        });
        if (image) {
          $(image).attr({
            width : width,
            height : n
          });
          /** @type {number} */
          context.lineWidth = 2;
          /** @type {number} */
          context.shadowBlur = 0;
          /** @type {boolean} */
          has_drawing = false;
        }
        /** @type {number} */
        ctx.lineWidth = 2;
        i = $(img).attr("src");
        if (t !== i) {
          $(img).load(update);
          if (t) {
            if ("http" === t.substr(0, 4)) {
              img.setAttribute("crossorigin", "anonymous");
            } else {
              img.removeAttribute("crossorigin");
            }
            $(img).attr("src", t);
          }
        }
      } else {
        content.css({
          width : y,
          height : h
        }).attr("src", 0 === data.id ? node ? node.src : "" : IMAGE_DOMAIN + data.id.toString(36) + ".jpg");
      }
      update();
      $("#mm-meme-title").css({
        "font-weight" : 700
      });
    };
    /**
     * @param {number} slide
     * @return {undefined}
     */
    self.changeMeme = function(slide) {
      if (slide != w) {
        self.select(slide);
      }
    };
    /**
     * @return {undefined}
     */
    self.addTextAuto = function() {
      show(1 < list.length ? "middle" : "top", {}, true);
      go(true);
    };
    /**
     * @return {undefined}
     */
    self.init = function() {
      /** @type {Array} */
      list = [];
      /** @type {number} */
      w = h = s = 0;
      var options;
      if (ga) {
        if (img = content[0], options = element, !value) {
          $("#drawPanel,.draw-panel").remove();
          li = $('<div class="draw-panel clearfix">');
          var b = $('<div class="erase l but sml" title="erase all drawing">erase</div>');
          var $link = $('<div class="draw l but sml">Draw</div>');
          var container = $('<div title="Change Line Color"></div>');
          // li.append(b).append($link).append(container).append(slider).append(property).append(marker);
          image = $("<canvas/>")[0];
          context = image.getContext("2d");
          pos = $("<img/>", {
            width : 210,
            height : 220,
            src : pattern
          })[0];
          $link.click(initialize);
          b.click(function() {
            image.width = image.width;
            /** @type {boolean} */
            has_drawing = false;
            update();
          });
          $fruits.before(li);
          /** @type {string} */
          text = option[3];
          render(container, 3, option, function(textAlt) {
            /** @type {string} */
            text = textAlt;
          });
        }
      } else {
        options = content;
      }
      if (1 < blockCount) {
        show("top");
      }
      if (0 < blockCount) {
        show("bottom");
      }
      /** @type {number} */
      b = 2;
      for (;b < blockCount;b++) {
        show("middle");
      }
      var $page = $("#memewrap");
      target.keyup(function(e) {
        var keys = $page.find(".im");
        var tagName = target.val();
        var startIgnore = tagName.toLowerCase();
        /** @type {number} */
        var i = 0;
        var visible;
        /** @type {number} */
        var res = -1;
        for (;info[i];) {
          /** @type {boolean} */
          visible = -1 !== info[i].name.toLowerCase().search(startIgnore) || -1 !== (info[i].altNames || "").toLowerCase().search(startIgnore);
          keys.eq(i).css("display", visible ? "inline-block" : "none");
          if (visible) {
            if (-1 === res) {
              /** @type {number} */
              res = i;
            }
          }
          i++;
        }
        if (13 === e.which) {
          if (-1 !== res) {
            self.changeMeme(res);
          } else {
            e = GET().stream;
            /** @type {string} */
            win.location = "/memesearch?q=" + tagName + (e ? "&stream=" + e : "");
          }
        }
      });
      options.hover(function() {
        clearTimeout(h);
        $fruits.find(".cropBox").removeClass("off");
      }, function() {
        /** @type {number} */
        h = setTimeout(function() {
          $fruits.find(".cropBox").addClass("off");
        }, 10);
      }).click(function(types) {
        types.preventDefault();
      }).show();
      $e.find(".mm-add-text").click(self.addTextAuto);
      $e.find(".mm-all-caps").click(function() {
        /** @type {boolean} */
        val = !val;
        /** @type {number} */
        var k = 0;
        for (;k < list.length;k++) {
          if ("text" == list[k].type) {
            list[k].setText();
          }
        }
      });
      $e.find(".mm-reset").click(self.reset);
      $e.find(".mm-toggle-drag").change(function() {
        go($(this).prop("checked"));
      });
      $e.find(".gen-no-watermark").change(update);
      $e.find(".mm-output-original-resolution").click(function() {
        if (self.hasDrawing() && !confirm("Changing this option will remove drawings. Are you sure you wish to continue?")) {
          return false;
        }
        err = $(this).prop("checked");
        var args = slice();
        self.setCanvasWidth(err ? args.w : callback(args.w, args.h));
        update();
      });
      var error = widget.width();
      if (700 > error) {
        go(false);
      }
      $("#mm-show-upload").click(f);
      var $input = $("#mm-upload-public");
      $input.click(function() {
        $("#mm-upload-name-wrap").toggle($input.prop("checked"));
      });
      $("#mm-upload").submit(function() {
        if (!$("#mm-upload-file").val()) {
          return MSG("No file selected", "red"), false;
        }
        if (!$input.prop("checked")) {
          return process(), false;
        }
      });
      $("form").keydown(function(event) {
        if (13 == event.which) {
          return false;
        }
      });
      $("#genSubmit").attr("checked", false);
      $e.find(".mm-toggle-opts").click(function() {
        var el = $e.find(".mm-opts");
        var script = $(this);
        if ("none" === el.css("display")) {
          el.slideDown(200);
          script.text("Hide Options \u25b2");
        } else {
          el.slideUp(200);
          script.text("More Options \u25bc");
        }
      });
      widget.resize(debounce(function() {
        var err = widget.width();
        if (err !== error) {
          error = err;
          self.setWidth(Math.min(slice().w, $win.width()));
        }
      }));
    };
    /**
     * @return {undefined}
     */
    self.initPopMemes = function() {
      $("#memetab").click(parse);
      $("#mytab").click(start);
      parse();
    };
    /** @type {function (string, string, boolean): undefined} */
    self.addText = show;
    /** @type {function (): undefined} */
    self.preview = update;
  };
  /** @type {function (Object, number, Array, Function): undefined} */
  win.ColorPicker = render;
  /** @type {function (Function, Object, boolean, ?): undefined} */
  win.generate = remove;
  /** @type {boolean} */
  var ea = false;
  /** @type {function (): undefined} */
  win.preloadShareScript = old;
  /** @type {function (boolean, boolean): undefined} */
  win.imgDonePopup = fn;
  /** @type {function (Object, string, string, Object, string): undefined} */
  win.imgDone = init;
  /**
   * @return {undefined}
   */
  memeInit = function() {
    $(".mm-generate").click(function() {
      var i = GET().stream;
      if (i) {
        if (!I.user.id) {
          showLogin();
          MSG("You must be logged in to post to a stream!");
        } else {
          if (!mm.isEmpty() || confirm("Your meme is empty. Are you sure you want to post an empty meme?")) {
            loading("Generating Meme...");
            remove(function() {
              /** @type {string} */
              win.location = "/m/" + i;
            }, false, false, i);
          }
        }
      } else {
        remove(start, false, true);
      }
    });
    $("#shareGen").click(function() {
      $(this).select();
    });
    $(".draw").click(function() {
      _gaq.push(["_trackEvent", "draw panel", "draw", mm.currentMeme().name]);
    });
    $(".mm-add-img").click(function() {
      _gaq.push(["_trackEvent", "draw panel", "add image", mm.currentMeme().name]);
    });
    $(".add-scumbag").click(function() {
      _gaq.push(["_trackEvent", "draw panel", "add scumbag", mm.currentMeme().name]);
    });
    $(".mm-rotate").click(function() {
      _gaq.push(["_trackEvent", "draw panel", "rotate", mm.currentMeme().name]);
    });
    tabs.on("click", ".mm-set-positions", function() {
      mm.ajaxSetPositions();
    });
  };
  /**
   * @param {MessageEvent} e
   * @return {undefined}
   */
  showGenerator = function(e) {
    if (I.user.id) {
      if (1E3 > I.user.points) {
        error_dialog("You must earn 1,000 points to use meme comments!");
      } else {
        if (e.data("meme-iid")) {
          MSG("You already have a meme attached to this comment!", "red");
        } else {
          getMemes();
          tabs.off("click", ".mm-generate").on("click", ".mm-generate", function() {
            if (mm.isEmpty()) {
              alert("Your meme is empty! Add something to it or click Cancel");
            } else {
              loading("Generating Meme...");
              remove(function(event) {
                e.data("meme-iid", event.iid).addClass("has-pending-img").prepend('<img class="c-pending-img" src="//i.imgflip.com/' + event.iid.toString(36) + '.jpg"/>');
                loading(false);
                BOX.hide();
              }, true);
            }
          }).off("click", ".mm-cancel").on("click", ".mm-cancel", function() {
            BOX.hide();
          });
        }
      }
    } else {
      showLogin();
    }
  };
  /** @type {function (this:Window, function (number): ?, (Element|null)=): number} */
  var make = win.requestAnimationFrame || (win.mozRequestAnimationFrame || (win.webkitRequestAnimationFrame || win.msRequestAnimationFrame));
  /**
   * @param {string} url
   * @return {undefined}
   */
  win.lzs = function(url) {
    /**
     * @return {undefined}
     */
    var init = function() {
      /** @type {Element} */
      var tempLink = doc.createElement("link");
      /** @type {string} */
      tempLink.rel = "stylesheet";
      /** @type {string} */
      tempLink.href = url;
      var insertAt = doc.getElementsByTagName("head")[0];
      insertAt.parentNode.insertBefore(tempLink, insertAt);
    };
    if (make) {
      make(init);
    } else {
      if (win.addEventListener) {
        win.addEventListener("load", init);
      } else {
        init();
      }
    }
  };
  /**
   * @return {undefined}
   */
  getMemes = function() {
    loading("Materializing Meme Generator...");
    $.ajax({
      dataType : "json",
      url : "/ajax_get_meme_list",
      /**
       * @param {Object} data
       * @return {undefined}
       */
      success : function(data) {
        loading(false);
        if (data.error) {
          error_dialog(data.error);
        } else {
          BOX.show({
            html : data.html,
            bg : "transparent",
            noMaskClick : true
          });
          mm = new MemeMaker(data.memes, {
            numTexts : 2
          });
          mm.init();
          mm.initPopMemes();
          mm.select(0);
        }
      }
    });
  };
})(window, document, $(window), $(document));
