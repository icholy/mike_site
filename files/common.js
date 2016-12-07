$w = $(window);
$d = $(document);
(function(self, doc, $window, element, right) {

  /**
   * @param {Function} func
   * @param {number} wait
   * @param {boolean} immediate
   * @param {number} threshold
   * @return {?}
   */
  function debounce(func, wait, immediate, threshold) {
    wait = wait || 100;
    var timeout;
    var args;
    var context;
    var previous;
    var start;
    var result;
    /**
     * @return {undefined}
     */
    var later = function() {
      /** @type {number} */
      var now = +new Date;
      if (now - previous < wait && (!threshold || now - start < threshold)) {
        /** @type {number} */
        timeout = setTimeout(later, wait - (now - previous));
      } else {
        /** @type {null} */
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          /** @type {null} */
          context = args = null;
        }
      }
    };
    return function() {
      context = this;
      /** @type {Arguments} */
      args = arguments;
      /** @type {number} */
      previous = +new Date;
      if (!start) {
        /** @type {number} */
        start = +new Date;
      }
      var callNow = immediate && !timeout;
      if (!timeout) {
        /** @type {number} */
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        /** @type {null} */
        context = args = null;
      }
      return result;
    };
  }
  /**
   * @param {Function} func
   * @param {number} wait
   * @return {?}
   */
  function connect(func, wait) {
    wait = wait || 150;
    return debounce(func, wait, false, wait);
  }
  /**
   * @param {Object} e
   * @return {undefined}
   */
  function stopPropagation(e) {
    e = e || self.event;
    /** @type {boolean} */
    e.cancelBubble = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  }
  /**
   * @param {Object} event
   * @return {?}
   */
  function cancelEvent(event) {
    event = event || self.event;
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    if (event.preventDefault) {
      event.preventDefault();
    }
    /** @type {boolean} */
    event.cancelBubble = true;
    /** @type {boolean} */
    event.cancel = true;
    return event.returnValue = false;
  }
  /**
   * @return {?}
   */
  function getUrlVars() {
    var flags = {};
    self.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(dataAndEvents, key, value) {
      flags[key] = value;
    });
    return flags;
  }
  /**
   * @param {Object} options
   * @return {undefined}
   */
  function init(options) {
    var isFixed = options.fixed;
    var headerHeight = options.pad || 0;
    /** @type {(number|string)} */
    var width = options.w ? Math.min(options.w, $window.width() - 2 * headerHeight) : "auto";
    var height = options.h || "auto";
    var pickWinTop = options.top || 0;
    var render = options.opacity || 60;
    var port = options.iframe;
    /** @type {boolean} */
    var n = !!options.full;
    var self = options.img;
    var cnl = $(".BOX").length;
    if (n) {
      /** @type {boolean} */
      isFixed = true;
      /** @type {string} */
      width = height = "100%";
    }
    var $link = $("<div/>", {
      "class" : "mask-back",
      css : {
        opacity : render / 100,
        "z-index" : 5999 + cnl
      }
    });
    var $container = $("<div/>", {
      "class" : "BOX ",
      css : {
        width : width,
        height : port ? height + 10 : height,
        background : options.bg || "#fff",
        position : isFixed ? "fixed" : "absolute",
        top : pickWinTop,
        padding : headerHeight,
        "z-index" : 6E3 + cnl
      }
    });
    if (n) {
      $container.css("left", 0);
    }
    /**
     * @return {undefined}
     */
    var update = function() {
      $container.css("margin-left", -$container.width() / 2 - headerHeight);
    };
    /**
     * @return {undefined}
     */
    var resize = function() {
      if (!n) {
        update();
        if (isFixed) {
          $container.css({
            top : "50%",
            "margin-top" : -$container.height() / 2
          });
        } else {
          if (!pickWinTop) {
            $container.css({
              top : $window.scrollTop() + Math.max($window.height() / 2 - $container.height() / 2, 10)
            });
          }
        }
      }
    };
    /**
     * @param {Event} event
     * @return {undefined}
     */
    var handler = function(event) {
      if (27 === event.which) {
        click();
      }
    };
    /** @type {function (): undefined} */
    var click = this.hide = function() {
      if (options.onclose) {
        options.onclose();
      }
      $link.remove();
      $container.remove();
      $window.off("resize", update);
      element.off("keyup", handler);
    };
    /**
     * @param {number} n
     * @param {number} _
     * @param {?} obj
     * @return {undefined}
     */
    this.size = function(n, _, obj) {
      $container.width(width = n).height(height = _);
      if (obj) {
        resize();
      }
    };
    /** @type {string} */
    port = port ? "<iframe width=" + width + " height=" + height + ' frameborder=0 src="' + port + '"></iframe>' : "";
    if (self) {
      self = $('<img style="vertical-align:top;" src="' + self + '"/>');
      /**
       * @return {undefined}
       */
      render = function() {
        resize();
        $container.show();
        /** @type {number} */
        var percent = self[0].height / self[0].width;
        width = "auto" === width ? Math.min(self[0].width, $window.width() - 2 * headerHeight) : width;
        /** @type {number} */
        height = width * percent;
        self.css({
          width : width,
          height : height
        });
      };
      self.load(render);
      if (self[0].complete) {
        render();
      }
    }
    $container.html(self || (port || options.html));
    if (!options.hideX) {
      $container.append($('<div class="x">&times</div>').click(click));
    }
    if (!options.noMaskClick) {
      $link.click(click);
      element.on("keyup", handler);
    }
    $("body").append($link).append($container);
    if (!self) {
      resize();
      $container.show();
    }
    if (options.onopen) {
      options.onopen();
    }
    $window.on("resize", update);
  }
  /**
   * @return {?}
   */
  function error() {
    return I.user && I.user.id;
  }
  /**
   * @return {undefined}
   */
  function save() {
    complete("Logging in...");
    $.ajax({
      url : "/ajax_login",
      type : "post",
      dataType : "json",
      data : {
        email : $("#email").val(),
        pass : $("#pass").val(),
        stayLogged : $("#stayLogged").prop("checked") ? 1 : 0
      },
      /**
       * @param {Object} jqXHR
       * @return {undefined}
       */
      success : function(jqXHR) {
        if (jqXHR.error) {
          complete(false);
          error_dialog(jqXHR.error);
        } else {
          self.location.reload();
        }
      }
    });
  }
  /**
   * @return {undefined}
   */
  function onload() {
    complete("Logging out...");
    var currentDfd = $.get("/ajax_logout");
    /**
     * @param {Object} $rootScope
     * @return {undefined}
     */
    self.google_login_callback = function($rootScope) {
      console.log($rootScope);
      if ($rootScope.error) {
        $.when(currentDfd).done(function() {
          self.location.reload();
        });
      } else {
        self.gapi.auth.signOut();
      }
    };
    $("body").append('<div id="google-login-button" style="display:none"></div>');
    $.getScript("https://apis.google.com/js/client:platform.js?onload=render_google_login_button");
  }
  /**
   * @return {?}
   */
  function handler() {
    var str = $("#suser").val();
    var value = $("#semail").val();
    var inputStr = $("#pass1").val();
    var lastUrlChar = $("#pass2").val();
    /** @type {string} */
    var escaped = "";
    if ("" === str || ("" === value || ("" === inputStr || "" === lastUrlChar))) {
      escaped += "<li>Fill in all fields!</li>";
    }
    if (inputStr !== lastUrlChar) {
      escaped += "<li>Password Mismatch, try again</li>";
    }
    if (-1 !== str.search(" ")) {
      escaped += "<li>Username cannot contain spaces! Try dash or underscore.</li>";
    }
    if (0 !== value.search(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i)) {
      escaped += "<li>Type a valid email</li>";
    }
    if (!$(".g-recaptcha-response").val()) {
      escaped += "<li>Please verify you are not a robot</li>";
    }
    return escaped ? ($("#signupMessage").html(escaped), false) : true;
  }
  /**
   * @return {undefined}
   */
  function select() {
    /** @type {string} */
    var blockHTML = '<div id="loginFrame"><div class="clear"></div><div class="loginBox"><h2>Login</h2><div id="loginMessage"></div><div id="google-login-button" class="but lrg">Login with Google</div><div class="login-or">- OR -</div><form id="lForm" method="post"><div>Email or Username</div><input id="email" name="email" type="text" autocomplete="email" value="' + decodeURIComponent((doc.cookie.split("rootemail=")[1] || "").split(";")[0]) + '"/><div>Password <span><a href="/forgot" tabindex="-1">forgot?</a></span></div><input id="pass" name="pass" type="password"/></form><label class="stay"><input type="checkbox" id="stayLogged" name="stayLogged" checked="checked" value="1"/> Stay Logged In</label><div id="login-button" class="b but lrg loginButton">Login</div></div><div class="loginBox"><h2>Signup</h2><div id="signupMessage"></div><form id="sForm" method="post" action="/signup?redirect=' + 
    self.location.href + '"><div>Email</div><input id="semail" name="email" type="email" autocomplete="email"/><div>Username</div><input id="suser" name="user" type="text"/><div>Password</div><input id="pass1" name="pass" type="password"/><div>Pass again</div><input id="pass2" type="password"/><label class="stay"><input type="checkbox" id="stay2" name="stayLogged" checked="checked" value="1"/> Stay Logged In</label><div class="g-recaptcha" data-sitekey="6Lf0rggTAAAAAAwrUfoyjuhbdFumfFFF3fgmUa8D"></div><input type="submit" class="y but lrg loginButton" value="Signup"/></form></div></div>';
    BOX.show({
      html : blockHTML,
      bg : "transparent",
      pad : 10,
      top : 50
    });
    $.getScript("https://apis.google.com/js/client:platform.js?onload=render_google_login_button");
    $.getScript("https://www.google.com/recaptcha/api.js");
    $("#lForm input").keydown(function(event) {
      if (13 == event.which) {
        save();
      }
    });
    if ($("#email").val()) {
      $("#pass").focus();
    } else {
      $("#semail").focus();
    }
  }
  /**
   * @return {undefined}
   */
  function click() {
    $("#miniNots").hide().find(".new").removeClass("new");
    $("#numNots").text(0).removeClass("has-nots");
    element.off("click", click);
  }
  /**
   * @param {Object} event
   * @return {undefined}
   */
  function create(event) {
    cancelEvent(event);
    var container = $("#miniNots");
    if ("none" === container.css("display")) {
      container.show();
      if ("" === container.html()) {
        container.html('<img class="load" src="//s.imgflip.com/preloader.gif"/>');
        $.ajax({
          url : "/getNots?len=5",
          /**
           * @param {?} feed
           * @return {undefined}
           */
          success : function(feed) {
            container.html("<div class='notifs'><a class='notif all' href='/notifications'>View All Notifications</a></div>").find(".notifs").prepend(feed);
          }
        });
        container.click(stopPropagation);
      }
      element.on("click", click);
    } else {
      click();
    }
  }
  /**
   * @return {undefined}
   */
  function onSuccess() {
    var register_pw = $(this).closest(".com").attr("id").substr(3);
    if (confirm("Delete comment?")) {
      $.ajax({
        url : "/ajax_com_delete",
        data : "cid=" + register_pw,
        /**
         * @param {string} s
         * @return {undefined}
         */
        success : function(s) {
          if (!s >> 0) {
            alert(s);
          } else {
            $("#com" + s).slideUp(function() {
              $(this).remove();
            });
          }
        }
      });
    }
  }
  /**
   * @return {undefined}
   */
  function callback() {
    var $btn = $(this);
    var cid = $btn.closest(".com").attr("id").substr(3);
    if (confirm("Are you sure you want to flag this comment for violating the Imgflip Terms of Use? If you disagree with someone but they are not breaking the rules, use the downvote button!")) {
      complete("Flagging comment...");
      $.ajax({
        url : "/ajax_com_flag",
        data : {
          cid : cid
        },
        dataType : "json",
        /**
         * @param {Object} jqXHR
         * @return {undefined}
         */
        success : function(jqXHR) {
          complete(false);
          if (jqXHR.error) {
            error_dialog(jqXHR.error);
          } else {
            MSG("Flag submitted successfully!", "green");
            $btn.remove();
          }
        }
      });
    }
  }
  /**
   * @return {undefined}
   */
  function update() {
    if (error()) {
      if (I.user.email_verified || I.user.pro) {
        var $item = $(this).closest(".com");
        var $link = $item.find(".c-new-wrap");
        if ($link[0]) {
          if (!$link.find(".c-new-text").val()) {
            $link.remove();
          }
        } else {
          $link = $("#c-new-main").clone();
          $link.attr("id", "");
          $item.append($link);
          $link.find(".c-new-text").focus();
        }
      } else {
        valueAccessor();
      }
    } else {
      select();
    }
  }
  /**
   * @return {undefined}
   */
  function valueAccessor() {
    DLG("Email Verification Required", 'To leave a comment, your email address must be verified (Pro accounts and Google Login are auto-verified). If you are a new user, just check your email and find the "Verify your Imgflip email" message. Otherwise, you can either login with Google, subscribe to Imgflip Pro, or re-send the verification email using the button in your <a href="/settings">Imgflip settings</a>.');
  }
  /**
   * @param {string} rows
   * @return {undefined}
   */
  function render(rows) {
    $(rows).each(function() {
      var btn = $(this);
      if (!btn.data("dimImage")) {
        btn.data("dimImage", true);
        btn.click(function() {
          BOX.show({
            img : btn.attr("src")
          });
          if (btn.hasClass("ctx-gif")) {
            $(".BOX img").addClass("ctx-gif");
          } else {
            $(".BOX img").removeClass("ctx-gif");
          }
        });
      }
    });
  }
  /**
   * @param {boolean} gotoEnd
   * @return {undefined}
   */
  function stop(gotoEnd) {
    $window[false === gotoEnd ? "off" : "on"]("keydown", onClick);
  }
  /**
   * @param {KeyboardEvent} event
   * @return {undefined}
   */
  function onClick(event) {
    if (!(event.metaKey || (event.ctrlKey || event.altKey))) {
      switch(event.which) {
        case 83:
        ;
        case 72:
          show(img.id, 0, ".img-vote-wrap");
          break;
        case 87:
        ;
        case 76:
          show(img.id, 1, ".img-vote-wrap");
          break;
        case 68:
          initialize();
          break;
        case 74:
        ;
        case 39:
          $("#img-next").click();
          break;
        case 75:
        ;
        case 37:
          $("#img-prev").click();
          break;
        case 65:
          self.history.back();
      }
    }
  }
  /**
   * @return {undefined}
   */
  function initialize() {
    var text;
    var str = $(this).attr("id") || "hotkey";
    /**
     * @return {undefined}
     */
    var action = function() {
      if (text) {
        self.location = text;
      } else {
        setTimeout(action, 10);
      }
    };
    $.get("/ajax_img_flip?current_iid=" + (self.img ? self.img.id >> 0 : 0), function(textAlt) {
      /** @type {string} */
      text = textAlt;
      if (27 === I.user.id) {
        action();
      }
    });
  }
  /**
   * @param {string} positions
   * @param {number} recurring
   * @param {Object} item
   * @return {undefined}
   */
  function show(positions, recurring, item) {
    if (I.done) {
      if (!error()) {
        select();
      } else {
        if (positions) {
          var label = $(item);
          item = label.find(".img-up");
          label = label.find(".img-down");
          var alias = item.hasClass("set");
          var set = label.hasClass("set");
          /** @type {number} */
          var new_vote = -1;
          item.add(label).removeClass("set");
          if (recurring || set) {
            if (recurring) {
              if (!alias) {
                item.addClass("set");
                /** @type {number} */
                new_vote = 1;
              }
            }
          } else {
            label.addClass("set");
            /** @type {number} */
            new_vote = 0;
          }
          $.ajax({
            url : "/ajax_vote",
            dataType : "json",
            data : {
              new_vote : new_vote,
              iid : positions
            },
            /**
             * @param {Object} jqXHR
             * @return {undefined}
             */
            success : function(jqXHR) {
              if (jqXHR.error) {
                error_dialog(jqXHR.error);
              }
            }
          });
        }
      }
    }
  }
  /**
   * @return {undefined}
   */
  function fn() {
    if (I.done) {
      if (error()) {
        var view = $(this);
        /** @type {number} */
        var cid = view.closest(".com").attr("id").substr(3) >> 0;
        /** @type {string} */
        var div = "#com" + cid;
        var bulk = view.hasClass("set");
        var length = view.hasClass("c-up");
        /** @type {number} */
        var value = 0;
        if (length) {
          /** @type {number} */
          value = bulk ? -1 : 1;
        } else {
          if (!bulk) {
            if ($(div + " .c-up").hasClass("set")) {
              /** @type {number} */
              value = -1;
            }
          }
        }
        div = $(div + " .points").first();
        /** @type {number} */
        value = parseInt(div.text()) + value;
        div.text(value + (1 === value ? " up" : " ups"));
        view.parent().find(".set").removeClass("set");
        if (!bulk) {
          view.addClass("set");
        }
        $.ajax({
          url : "/ajax_comment_vote",
          data : {
            new_vote : bulk ? -1 : length ? 1 : 0,
            cid : cid
          },
          /**
           * @param {?} textStatus
           * @return {undefined}
           */
          success : function(textStatus) {
            if (textStatus) {
              alert(textStatus);
            }
          }
        });
      } else {
        select();
      }
    }
  }
  /**
   * @param {string} signal_eof
   * @param {Object} elem
   * @return {?}
   */
  function next(signal_eof, elem) {
    if (!signal_eof || submitting) {
      return false;
    }
    /** @type {boolean} */
    submitting = true;
    /** @type {number} */
    var comImage = elem.data("meme-iid") >> 0;
    var val = elem.find(".c-new-text").val() || "";
    var context = elem.closest(".com");
    var pid = (context.attr("id") || "").substr(3) || 0;
    /** @type {string} */
    var later = "";
    if (!comImage) {
      if (!(val != right && "" != val)) {
        later += "<li>Enter some text</li>";
      }
    }
    if ("" !== later) {
      error_dialog(later);
      /** @type {boolean} */
      submitting = false;
    } else {
      complete("Adding comment...");
      $.ajax({
        url : "/ajax_add_comment",
        type : "post",
        dataType : "json",
        data : {
          text : val,
          iid : signal_eof,
          comImage : comImage,
          parent_id : pid,
          level : pid ? ~~context.data("l") + 1 : 0
        },
        /**
         * @param {Object} data
         * @return {undefined}
         */
        success : function(data) {
          if (data.error) {
            error_dialog(data.error);
          } else {
            data = $(data.com_html);
            if (pid) {
              elem.remove();
              context.after(data);
            } else {
              elem.find(".c-new-text").val("");
              if (comImage) {
                elem.removeClass("has-pending-img").data("meme-iid", null).find(".c-pending-img").remove();
              }
              var that = $("#comments");
              that.append(data);
              /** @type {number} */
              that = that.offset().top + that.innerHeight() - ($window.scrollTop() + $window.height());
              if (0 < that) {
                $("html,body").animate({
                  scrollTop : "+=" + (that + 150)
                });
              }
            }
            render(".c-text img");
            load(data);
          }
        },
        /**
         * @return {undefined}
         */
        complete : function() {
          complete(false);
          /** @type {boolean} */
          submitting = false;
        }
      });
    }
  }
  /**
   * @param {string} e
   * @return {undefined}
   */
  function load(e) {
    var cmp = I.user;
    var n;
    var id;
    var range;
    $(e || ".com").quickEach(function() {
      n = this.attr("id").substr(3);
      if (I.com_votes[n]) {
        /** @type {string} */
        id = "1" === I.com_votes[n] ? ".c-up" : ".c-down";
        this.find(id).addClass("set");
      }
      var uid = this.data("uid");
      if (4 < cmp.priv || (cmp.id == uid || cmp.id === img.stream_owner_uid)) {
        if (!this.find(".c-delete")[0]) {
          this.find(".comTitle").before('<div class="c-delete a">delete</div>');
        }
      }
      range = this.find(".c-text");
      if (!(range.is(":empty") && !range.data("text"))) {
        this.find(".comTitle").before('<div class="c-flag a">flag</div>');
      }
    });
  }
  /**
   * @param {boolean} mayParseLabeledStatementInstead
   * @return {undefined}
   */
  function complete(mayParseLabeledStatementInstead) {
    if (false === mayParseLabeledStatementInstead) {
      if (s) {
        s.remove();
      }
      /** @type {boolean} */
      h = s = false;
    } else {
      if (!s) {
        s = $('<div id="site-loading"><div id="site-loading-inner"><div id="site-loading-msg"></div><div id="site-loading-bar"><div id="site-loading-progress"></div></div></div></div>');
        $("body").append(s);
      }
      $("#site-loading-msg").html(mayParseLabeledStatementInstead || "Loading...");
    }
  }
  /**
   * @return {undefined}
   */
  function handle() {
    /** @type {string} */
    var blockHTML = '<div class="img-flag-popup" data-iid="' + $(this).data("iid") + '"><div class="img-flag-title">Flag Image</div><div class="img-flag-label">Reason:</div><select class="img-flag-select"><option value></option>' + (27 === I.user.id ? '<option value="img-sfw">SFW</option>' : "") + '<option value="img-nsfw">NSFW (adult/mature content)</option><option value="img-spam">Spam (advertising, website spam, etc)</option><option value="img-abuse">Abuse (anything breaching our Terms of Service)</option></select><div class="img-flag-label">Additional Comments [optional]</div><textarea class="img-flag-text" maxlength="200"></textarea><div class="img-flag-submit b but">Submit</div><div class="img-flag-cancel l but">Cancel</div></div>';
    BOX.show({
      html : blockHTML
    });
  }
  /**
   * @return {undefined}
   */
  function clicked() {
    BOX.hide();
  }
  /**
   * @return {undefined}
   */
  function get() {
    var msg = $(this).closest(".img-flag-popup");
    var iid = msg.data("iid");
    var paramType = msg.find(".img-flag-select").val();
    msg = msg.find(".img-flag-text").val();
    if (paramType) {
      complete();
      $.ajax({
        url : "/ajax_flag",
        type : "post",
        dataType : "json",
        data : {
          iid : iid,
          type : paramType,
          text : msg
        },
        /**
         * @param {Object} log
         * @return {undefined}
         */
        success : function(log) {
          complete(false);
          BOX.hide();
          $('.img-flag[data-iid="' + iid + '"]').remove();
          if (log.error) {
            MSG(log.error, "red");
          } else {
            MSG(log.message, "green");
          }
        }
      });
    } else {
      MSG("Select a reason", "red");
    }
  }
  /**
   * @param {string} url
   * @return {undefined}
   */
  function open(url) {
    complete();
    $.get("/ajax_submit_popup", {
      iid : url,
      subsLeft : I.user.subsLeft
    }, function(_html) {
      complete(false);
      BOX.show({
        html : _html,
        bg : "transparent"
      });
      $("#submit-submit").click(function() {
        start(url);
      });
      $("#submit-cancel").click(function() {
        BOX.hide();
      });
    });
  }
  /**
   * @param {string} index
   * @return {undefined}
   */
  function start(index) {
    BOX.hide();
    complete("Submitting image...");
    $.get("/ajax_submit_creation?iid=" + index, function(deepDataAndEvents) {
      complete(false);
      if (deepDataAndEvents) {
        error_dialog(deepDataAndEvents);
      } else {
        BOX.show({
          html : "<h2>Image submitted successfully!</h2><p>Sharing your image will make it more likely to reach the homepage.</p>",
          w : 400,
          pad : 20
        });
      }
    });
  }
  /**
   * @param {string} total
   * @param {string} type
   * @return {undefined}
   */
  function done(total, type) {
    /** @type {string} */
    var msg = "/pro?from=" + type;
    total = total.replace(/Imgflip Pro/, '<a href="' + msg + '">Imgflip Pro</a>');
    BOX.show({
      html : '<div class="pro-msg">' + total + '</div><a class="b but pro-learn-more" href="' + msg + '">Learn More &rsaquo;</a>',
      w : 500,
      pad : 20
    });
  }
  /**
   * @return {?}
   */
  function getBrowser() {
    var requestUrl = navigator.userAgent || (navigator.vendor || self.opera);
    return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(requestUrl) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(requestUrl.substr(0, 
    4));
  }
  I = self.I || {
    user : {}
  };
  if (!self.console) {
    console = {};
  }
  if (!console.log) {
    /**
     * @return {undefined}
     */
    console.log = function() {
    };
  }
  $.ajaxSetup({
    cache : true
  });
  $(doc).ajaxError(function(deepDataAndEvents, httpRequest, req, dataAndEvents) {
    if ("/" === req.url[0]) {
      if ("/ajax_get_le_data" !== req.url) {
        if (!req.error) {
          complete(false);
          error_dialog("Request error. Try again in a minute. If this keeps happening, and other websites (e.g. google.com) still load fine, let us know with the Feedback button!");
        }
      }
    }
  });
  var X = $window.width();
  $.fn.quickEach = function() {
    var elems = jQuery([1]);
    return function(fn) {
      /** @type {number} */
      var i = -1;
      var helperMissingString;
      var size = this.length;
      try {
        for (;++i < size && ((helperMissingString = elems[0] = this[i]) && false !== fn.call(elems, i, helperMissingString));) {
        }
      } catch (h) {
        throw delete elems[0], h;
      }
      delete elems[0];
      return this;
    };
  }();
  /** @type {function (Function, number, boolean, number): ?} */
  self.debounce = debounce;
  /** @type {function (Function, number): ?} */
  self.throttle = connect;
  /** @type {function (Object): undefined} */
  self.stopProp = stopPropagation;
  /** @type {function (Object): ?} */
  self.cancelEvent = cancelEvent;
  /**
   * @param {?} c
   * @param {string} left
   * @return {?}
   */
  $.fn.fieldFill = function(c, left) {
    var b = $(this).val();
    if (left == right) {
      /** @type {string} */
      left = "#666";
    }
    if (!("" != b && b != c)) {
      $(this).val(c).css("color", left);
    }
    $(this).focus(function() {
      if ($(this).val() == c) {
        $(this).val("").css("color", "#000");
      }
    });
    $(this).blur(function() {
      if ("" == $(this).val()) {
        $(this).val(c).css("color", left);
      }
    });
    return this;
  };
  /** @type {function (): ?} */
  self.GET = getUrlVars;
  if (!Array.indexOf) {
    /**
     * @param {T} elt
     * @param {number=} start
     * @return {number}
     * @template T
     */
    Array.prototype.indexOf = function(elt, start) {
      /** @type {number} */
      var i = start || 0;
      for (;i < this.length;i++) {
        if (this[i] == elt) {
          return i;
        }
      }
      return-1;
    };
  }
  if (!String.prototype.trim) {
    /**
     * @return {string}
     */
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, "");
    };
  }
  /**
   * @param {string} dataAndEvents
   * @return {undefined}
   */
  webkitWarn = function(dataAndEvents) {
    /** @type {string} */
    var ua = navigator.userAgent;
    /** @type {string} */
    var optsData = "";
    if (-1 === ua.search(/webkit|firefox/i)) {
      optsData += "Please note: the " + dataAndEvents + ' performs best in a modern web browser such as <a href="https://www.google.com/chrome">Chrome</a> or <a href="http://www.mozilla.org/firefox">Firefox</a>';
      if (-1 !== ua.search(/MSIE [6-9]/)) {
        optsData += ' <p style="color:#f44">Internet Explorer versions 6-9 tend to be very error prone</p>';
      }
    }
    if (optsData) {
      $("#generator-qa").prepend("<h2>" + optsData + "</h2>");
    }
  };
  var d;
  /** @type {function (Object): undefined} */
  self.Box = init;
  self.BOX = {
    /**
     * @param {?} opt_attributes
     * @return {undefined}
     */
    show : function(opt_attributes) {
      d = new init(opt_attributes);
    },
    /**
     * @return {undefined}
     */
    hide : function() {
      if (d) {
        d.hide();
      }
    },
    /**
     * @return {undefined}
     */
    size : function() {
      if (d) {
        d.size();
      }
    }
  };
  /**
   * @param {string} var_args
   * @param {string} deepDataAndEvents
   * @return {undefined}
   */
  DLG = function(var_args, deepDataAndEvents) {
    BOX.show({
      html : "<p><b>" + var_args + "</b></p><p>" + deepDataAndEvents + "</p>",
      w : 400,
      pad : 20
    });
  };
  /**
   * @param {string} deepDataAndEvents
   * @return {undefined}
   */
  error_dialog = function(deepDataAndEvents) {
    DLG("Error", deepDataAndEvents);
  };
  MSG = function() {
    var el;
    var timerId;
    return function(block, color, threshold) {
      if (false === block && el) {
        el.hide();
      } else {
        color = color || "white";
        threshold = threshold || 5E3;
        if (!el) {
          el = $('<div id="quick-msg">').appendTo("body");
        }
        el.html(block).css({
          "margin-left" : -el.outerWidth() / 2,
          top : 10
        }).attr("class", color).stop().fadeIn(200);
        clearTimeout(timerId);
        /** @type {number} */
        timerId = setTimeout(function() {
          el.fadeOut(1E3);
        }, threshold);
      }
    };
  }();
  /**
   * @param {string} source
   * @param {number} target
   * @param {?} fn
   * @param {Object} options
   * @return {undefined}
   */
  self.Dragger = function(source, target, fn, options) {
    /**
     * @param {number} name
     * @param {number} num
     * @param {number} w
     * @param {number} key
     * @param {?} opt_default
     * @return {undefined}
     */
    function get(name, num, w, key, opt_default) {
      /** @type {number} */
      left = name;
      /** @type {number} */
      i = num;
      /** @type {number} */
      width = w;
      /** @type {number} */
      j = key;
      if (fn) {
        fn(left, i, width, j);
      }
      if (opt_default) {
        element.css({
          transform : "scale3d(0,0,0)"
        });
      }
      element.css({
        left : ~~left - 1,
        top : ~~i - 1,
        width : ~~width,
        height : ~~j
      });
      if (opt_default) {
        element.css({
          transition : "1s",
          transform : "scale3d(1,1,1)"
        });
        setTimeout(function() {
          element.css({
            transition : ""
          });
        }, 1500);
      }
    }
    /**
     * @param {Event} event
     * @return {undefined}
     */
    function start(event) {
      cancelEvent(event);
      right = $target.width();
      length = $target.height();
      r = width;
      y = j;
      t = left;
      x = i;
      clientX = event.clientX;
      last_y = event.clientY;
      $("body").addClass("nosel");
      element.on("vmousemove", move).on("vmouseup", toggle);
    }
    /**
     * @param {Event} e
     * @return {undefined}
     */
    function move(e) {
      if (key) {
        /** @type {number} */
        g = e.clientX - clientX;
        /** @type {number} */
        delta = e.clientY - last_y;
        if (ratio) {
          if (6 === key || 8 === key) {
            /** @type {number} */
            g = Math.round(ratio * delta);
          } else {
            if (7 === key || 9 === key) {
              /** @type {number} */
              g = -Math.round(ratio * delta);
            }
          }
        }
        if (1 === key) {
          left = t + g;
          i = x + delta;
          if (0 > left) {
            /** @type {number} */
            left = 0;
          } else {
            if (left + width > right) {
              /** @type {number} */
              left = right - width;
            }
          }
          if (0 > i) {
            /** @type {number} */
            i = 0;
          } else {
            if (i + j > length) {
              /** @type {number} */
              i = length - j;
            }
          }
        }
        if (2 == key || (6 == key || 7 == key)) {
          i = x + delta;
          /** @type {number} */
          j = y - delta;
          if (0 > i) {
            /** @type {number} */
            i = 0;
            j = y + x;
          } else {
            if (j < size) {
              j = size;
              /** @type {number} */
              i = x + y - size;
            }
          }
        } else {
          if (4 == key || (8 == key || 9 == key)) {
            j = y + delta;
            if (i + j > length) {
              /** @type {number} */
              j = length - i;
            } else {
              if (j < size) {
                j = size;
              }
            }
          }
        }
        if (5 == key || (6 == key || 9 == key)) {
          left = t + g;
          /** @type {number} */
          width = r - g;
          if (0 > left) {
            /** @type {number} */
            left = 0;
            width = r + t;
          } else {
            if (width < size) {
              width = size;
              /** @type {number} */
              left = t + r - size;
            }
          }
        } else {
          if (3 == key || (7 == key || 8 == key)) {
            width = r + g;
            if (left + width > right) {
              /** @type {number} */
              width = right - left;
            } else {
              if (width < size) {
                width = size;
              }
            }
          }
        }
        get(left, i, width, j);
      }
    }
    /**
     * @return {undefined}
     */
    function toggle() {
      /** @type {number} */
      key = 0;
      if (ratio) {
        /** @type {number} */
        ratio = width / j;
      }
      $("body").removeClass("nosel");
      element.off("vmouseup", toggle);
    }
    options = options || {};
    var size = options.minWidth || 20;
    var element = $(source);
    var $target = $(target);
    /** @type {number} */
    var left = 0;
    /** @type {number} */
    var i = 0;
    var width = size;
    var j = size;
    var ratio;
    var t;
    var x;
    var r;
    var y;
    var key;
    var g;
    var delta;
    var right;
    var length;
    var clientX;
    var last_y;
    /** @type {Array.<string>} */
    var targets = "N E S W NW NE SE SW".split(" ");
    /** @type {string} */
    source = "";
    /** @type {number} */
    target = 0;
    for (;target < targets.length;target++) {
      /** @type {string} */
      source = 4 > target ? source + ('<div class="wrap' + targets[target] + '"><div class="resize ' + targets[target] + '" data-dir="' + targets[target] + '"></div></div>') : source + ('<div class="resize ' + targets[target] + '" data-dir="' + targets[target] + '"></div>');
    }
    /**
     * @return {?}
     */
    this.getVals = function() {
      return{
        x : left,
        y : i,
        w : width,
        h : j
      };
    };
    /** @type {function (number, number, number, number, ?): undefined} */
    this.setVals = get;
    /**
     * @return {undefined}
     */
    this.lockRatio = function() {
      /** @type {number} */
      ratio = width / j;
    };
    element.on("vmousedown", function(socket) {
      /** @type {number} */
      key = 1;
      start(socket);
    }).on("vmousedown", ".resize", function(socket) {
      /** @type {number} */
      key = targets.indexOf($(this).attr("data-dir")) + 2;
      start(socket);
    });
    element.html(source);
  };
  /**
   * @param {?} sourceContainer
   * @return {undefined}
   */
  self.hoverGifs = function(sourceContainer) {
    $(sourceContainer).find("a img").each(function() {
      var g = $(this)[0];
      $(this).hover(function() {
        g.src = g.src.replace(/\/2\/([a-z0-9]+)\.jpg/, "/$1.gif");
      }, function() {
        g.src = g.src.replace(/\/([a-z0-9]+)\.gif/, "/2/$1.jpg");
      });
    });
  };
  /**
   * @param {Object} context
   * @return {undefined}
   */
  applyTips = function(context) {
    (context && context.jquery ? context.find(".tip") : "string" === typeof context ? $(context + " .tip") : $(".tip")).each(function() {
      var tref;
      var sel = $(this);
      sel.parent().hover(function(e) {
        /** @type {number} */
        tref = setTimeout(function() {
          var r2 = sel.text().length;
          var x = e.clientX;
          var y = e.clientY;
          var len = $window.width();
          var windowScroll = $window.height();
          /** @type {number} */
          r2 = Math.min(260 + r2 / 5 >> 0, Math.max(len - x, x) - 40);
          sel.width(r2);
          y = y > windowScroll / 2 ? y - sel.height() - 20 : y + 20;
          sel.css({
            top : y,
            left : x > windowScroll / 2 ? x - r2 - 20 : x + 20
          }).fadeIn(200);
        }, sel.attr("data-delay") || 400);
      }, function() {
        clearTimeout(tref);
        sel.fadeOut(200);
      }).click(function() {
        clearTimeout(tref);
      });
    });
  };
  /** @type {function (): ?} */
  self.checkSignup = handler;
  /** @type {function (): undefined} */
  self.showLogin = select;
  /**
   * @return {undefined}
   */
  self.render_google_login_button = function() {
    gapi.signin.render("google-login-button", {
      callback : "google_login_callback",
      clientid : "16163237658-20l9nkv7bci04f890j3rocd67cpdbmu0.apps.googleusercontent.com",
      cookiepolicy : "single_host_origin",
      scope : "profile email",
      redirecturi : "postmessage",
      accesstype : "offline"
    });
  };
  /**
   * @param {Object} response
   * @return {undefined}
   */
  self.google_login_callback = function(response) {
    if (response.code) {
      if ("AUTO" === response.status.method) {
        gapi.auth.signOut();
      } else {
        complete("Logging in...");
        var params = getUrlVars();
        $.ajax({
          type : "POST",
          url : "/ajax_google_login",
          data : {
            code : response.code,
            claim_iid : params.claim_iid
          },
          dataType : "json",
          /**
           * @param {Object} jqXHR
           * @return {undefined}
           */
          success : function(jqXHR) {
            if (jqXHR.error) {
              complete(false);
              error_dialog(jqXHR.error);
            } else {
              if (params.claim_iid) {
                /** @type {string} */
                self.location = "/i/" + (~~params.claim_iid).toString(36) + "?herp=" + +new Date;
              } else {
                self.location.reload();
              }
            }
          }
        });
      }
    } else {
      if (response.error) {
        console.log("There was an error: " + response.error);
      } else {
        console.log("wtf?!");
      }
    }
  };
  /** @type {function (string): undefined} */
  self.dimImage = render;
  /** @type {function (boolean): undefined} */
  self.navKeys = stop;
  /** @type {function (string, number, Object): undefined} */
  self.vote = show;
  /** @type {function (string, Object): ?} */
  self.comment = next;
  var s;
  /** @type {function (boolean): undefined} */
  self.loading = complete;
  var h;
  /**
   * @param {number} obj
   * @return {undefined}
   */
  self.progress = function(obj) {
    if (!h) {
      $("#site-loading-bar").show();
      h = $("#site-loading-progress");
    }
    h.width(100 * obj + "%");
  };
  /** @type {function (string): undefined} */
  self.submitImg = open;
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} row
   * @param {number} height
   * @param {number} idx
   * @return {undefined}
   */
  self.signCanvas = function(ctx, row, height, idx) {
    idx = idx || 4E4;
    if (!(I.user.pro && true === $(".gen-no-watermark").prop("checked") || row * height <= idx)) {
      ctx.save();
      /** @type {string} */
      ctx.font = "10px Arial";
      /** @type {string} */
      ctx.fillStyle = "#ddd";
      /** @type {number} */
      ctx.shadowBlur = 2;
      /** @type {string} */
      ctx.shadowColor = "#000";
      /** @type {number} */
      row = 0;
      for (;7 > row;row++) {
        ctx.fillText("imgflip.com", 3, height - 4);
      }
      ctx.restore();
    }
  };
  /** @type {function (string, string): undefined} */
  self.upgradeBox = done;
  (function(self) {
    /**
     * @param {Function} callback
     * @return {undefined}
     */
    function select(callback) {
      $(".main-tag").change(function() {
        /** @type {string} */
        var text = "";
        /** @type {Array} */
        var radio = [];
        radio[0] = $("#show-other")[0];
        radio[1] = $("#show-memes")[0];
        radio[2] = $("#show-gifs")[0];
        /** @type {number} */
        var i = 0;
        for (;3 > i;i++) {
          /** @type {string} */
          text = radio[i].checked ? text + "1" : text + "0";
        }
        $.ajax({
          url : "/ajax_main_tags",
          data : "cookie_tags=" + text,
          /** @type {Function} */
          success : callback
        });
      });
      element.on("click", "#safe-button", function(event) {
        if (!I.done) {
          return cancelEvent(event);
        }
        /** @type {string} */
        var val = $(this).parent().hasClass("safe-status-SFW") ? "NSFW" : "SFW";
        /** @type {string} */
        var name = "SFW" === val ? "NSFW" : "SFW";
        if (!error()) {
          return cancelEvent(event), select();
        }
        $(this).parent().removeClass("safe-status-" + name).addClass("safe-status-" + val);
        $.ajax({
          url : "/ajax_safemode",
          data : "safe=" + val,
          /** @type {Function} */
          success : callback
        });
      });
    }
    /**
     * @param {?} failing_message
     * @return {undefined}
     */
    function report(failing_message) {
      if (failing_message) {
        /** @type {string} */
        location.href = location.href.replace(/\/\?tgz=([10]{3}|memes|gifs)/, "");
      }
    }
    /**
     * @param {?} xxx
     * @return {undefined}
     */
    function win(xxx) {
      if (xxx) {
        $("#flip-notify").html("Your next flip will reflect your new settings").fadeIn();
      }
    }
    /**
     * @return {undefined}
     */
    function update() {
    }
    /**
     * @return {undefined}
     */
    function run() {
      element.on("vclick", ".pause-gif", function(event) {
        var $slide = $(this);
        var image = $slide.find("img");
        var lastLine = image.attr("src");
        if (lastLine) {
          image.attr("src", lastLine.replace("/2/", "/").replace(".jpg", ".gif"));
          $slide.removeClass("pause-gif");
        }
        return cancelEvent(event);
      });
    }
    /**
     * @return {undefined}
     */
    function get() {
      $(".img-embed-codes").each(function() {
        var content = $(this);
        if (!content.html()) {
          content.html(fn(img.id.toString(36), img.type, false, true, img.generator));
        }
        content.toggle();
      });
    }
    /**
     * @param {string} message
     * @param {string} text
     * @param {boolean} z
     * @param {string} format
     * @param {boolean} range
     * @return {?}
     */
    function fn(message, text, z, format, range) {
      var charset;
      var gifgenerator;
      switch(range) {
        case "gif":
          /** @type {string} */
          charset = "GIF Maker";
          /** @type {string} */
          gifgenerator = "gifgenerator";
          break;
        case "meme":
          /** @type {string} */
          charset = "Meme Generator";
          /** @type {string} */
          gifgenerator = "memegenerator";
          break;
        case "pie":
          /** @type {string} */
          charset = "Pie Chart Maker";
          /** @type {string} */
          gifgenerator = "piemaker";
      }
      /** @type {string} */
      var value = message + "." + text;
      /** @type {string} */
      var tval = "https://i.imgflip.com/" + value;
      /** @type {string} */
      var s = "https://imgflip.com/" + ("gif" === text ? "gif/" : "i/") + message;
      /** @type {string} */
      var out = "";
      if (!z) {
        out += '<div class="img-code-wrap"><div class="img-code-label">Image Link:</div><input type="text" class="img-code link" value="' + s + '"/></div><div class="img-code-wrap"><div class="img-code-label">BBCode (forums):</div><input type="text" class="img-code forum" value="' + ("[url=" + s + "][img]" + tval + "[/img][/url]" + (charset ? "[url=https://imgflip.com/" + gifgenerator + "]via Imgflip " + charset + "[/url]" : "")) + '"/></div><div class="img-code-wrap"><div class="img-code-label">Image HTML:</div><input type="text" class="img-code html" value=\'' + 
        ('<a href="' + s + '"><img src="' + tval + '"' + (range ? ' title="made at imgflip.com"' : "") + "/></a>") + "'/></div>";
      }
      if (!format) {
        /** @type {string} */
        format = "";
        if (doc.createElement("a").hasOwnProperty("download")) {
          /** @type {string} */
          message = z ? "https://i2.imgflip.com/" + value : tval;
          /** @type {string} */
          format = ' download="' + value + '"';
        } else {
          /** @type {string} */
          message = "/download_image?idsmall=" + message + "&ext=" + text;
        }
        out += '<div class="img-code-wrap"><a id="img-download" class="img-download l but" href="' + message + '"' + format + ">Download Image</a></div>";
      }
      return out;
    }
    /**
     * @param {string} two
     * @param {string} total
     * @param {string} val
     * @param {string} end
     * @return {undefined}
     */
    function done(two, total, val, end) {
      end = end.replace(/"/g, "&quot;");
      /** @type {string} */
      var e = "https://imgflip.com/" + ("gif" === val ? "gif/" : "i/") + total;
      /** @type {string} */
      total = "http://i.imgflip.com/" + total + "." + val;
      $(two).html('<div class="pw-widget pw-size-large" pw:image="' + total + '" pw:url="' + e + '"' + (end ? ' pw:title="' + end + '"' : "") + ' pw:twitter-via="imgflip"><a class="pw-button-facebook"></a><a class="pw-button-twitter"></a><a class="pw-button-reddit"></a><a class="pw-button-tumblr"></a><a class="pw-button-pinterest"></a><a class="pw-button-post"></a></div>');
      after();
    }
    /**
     * @return {undefined}
     */
    function after() {
      if (self.post_init) {
        post_init();
      } else {
        setTimeout(after, 50);
      }
    }
    /**
     * @param {string} dataAndEvents
     * @param {string} s
     * @param {string} ss
     * @param {boolean} charset
     * @return {?}
     */
    function escapeInnerText(dataAndEvents, s, ss, charset) {
      if (I.user.pro) {
        return "";
      }
      /** @type {string} */
      var e = "display:inline-block;vertical-align:top;";
      if (s) {
        if (ss) {
          e += "width:" + s + "px;height:" + ss + "px;";
        }
      }
      /** @type {string} */
      s = s && ss ? "" : " imgflip-banner-top";
      $.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
      return'<div class="ad"><ins class="adsbygoogle' + s + '" style="' + e + '" data-ad-client="ca-pub-2078578220372194" data-ad-slot="' + dataAndEvents + '"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});\x3c/script>' + (charset ? '<div class="ad-pro-callout">tip: <a href="/pro?from=side_ad">Pro users don\'t see ads</a></div>' : "") + "</div>";
    }
    /**
     * @param {number} opt_attributes
     * @param {string} elem
     * @return {undefined}
     */
    function next(opt_attributes, elem) {
      /** @type {Element} */
      var s = doc.createElement("script");
      /** @type {string} */
      s.id = "rc_" + Math.floor(1E3 * Math.random());
      /** @type {string} */
      s.type = "text/javascript";
      /** @type {string} */
      s.src = "https://trends.revcontent.com/serve.js.php?w=" + opt_attributes + "&t=" + s.id + "&c=" + (new Date).getTime() + "&width=" + (self.outerWidth || doc.documentElement.clientWidth);
      /** @type {boolean} */
      s.async = true;
      doc.getElementById(elem).appendChild(s);
    }
    /**
     * @return {undefined}
     */
    function onSuccess() {
      $.ajax({
        url : "/ajax_change_table",
        data : "toImages=" + img.id,
        /**
         * @param {?} textStatus
         * @return {undefined}
         */
        success : function(textStatus) {
          if (textStatus) {
            alert(textStatus);
          } else {
            $("#toImages").fadeOut();
          }
        }
      });
    }
    /**
     * @return {undefined}
     */
    function login() {
      $.ajax({
        url : "/ajax_moderate",
        type : "post",
        data : "action=approve&live=1&iid=" + img.id,
        /**
         * @return {undefined}
         */
        success : function() {
          $("#img-approve").fadeOut();
        }
      });
    }
    /**
     * @return {undefined}
     */
    function post() {
      $.ajax({
        url : "/ajax_moderate",
        type : "post",
        data : "action=disapprove&iid=" + img.id,
        /**
         * @return {undefined}
         */
        success : function() {
          $("#img-disapprove").fadeOut();
        }
      });
    }
    /**
     * @return {undefined}
     */
    function callback() {
      if (confirm("Permanently delete this image?")) {
        complete("Deleting Image...");
        $.ajax({
          url : "/ajax_img_delete",
          data : "iid=" + img.id,
          /**
           * @param {?} textStatus
           * @return {undefined}
           */
          success : function(textStatus) {
            if (textStatus) {
              complete(false);
              MSG(textStatus, "red");
            } else {
              /** @type {string} */
              self.location = "/creations";
            }
          }
        });
      }
    }
    /**
     * @return {undefined}
     */
    function remove() {
      $("#img-update").replaceWith("<p>Updating...</p>");
      $.ajax({
        url : "/ajax_img_update",
        data : {
          iid : img.id,
          title : $("#img-title-edit").val(),
          tags : $("#img-tags-edit").val(),
          desc : $("#img-desc-edit").val(),
          main_tag : $('input[name="img-main-tag-edit"]:checked').val()
        },
        /**
         * @param {?} textStatus
         * @return {undefined}
         */
        success : function(textStatus) {
          if (textStatus) {
            alert(textStatus);
          } else {
            /** @type {string} */
            self.location = self.location.href.replace(/\?lerp=[0-9]+/, "") + "?lerp=" + +new Date;
          }
        }
      });
    }
    /**
     * @return {undefined}
     */
    function handler() {
      if (!handler.done) {
        /** @type {boolean} */
        handler.done = true;
        $(this).removeClass("l but sml").html("Loading...");
        request();
      }
    }
    /**
     * @return {undefined}
     */
    function request() {
      $.ajax({
        url : "/ajax_img_admin",
        data : {
          iid : img.id
        },
        /**
         * @param {?} status
         * @return {undefined}
         */
        success : function(status) {
          $("#img-edit-btn").remove();
          $("#img-admin").append(status);
        }
      });
    }
    /**
     * @param {string} selector
     * @return {undefined}
     */
    function bindEvents(selector) {
      if (getBrowser()) {
        $(selector).each(function() {
          var list = $(this);
          /** @type {boolean} */
          var b = true;
          list.parent().parent().addClass("pause-gif");
          list.on("vclick", function(event) {
            list.parent().parent().removeClass("pause-gif");
            list[0].play();
            if (b) {
              return b = false, cancelEvent(event);
            }
          });
        });
      }
    }
    /**
     * @return {undefined}
     */
    function load() {
      var j = I.user;
      var input = j.cookie_tags;
      /** @type {Array} */
      var modes = ["other", "memes", "gifs"];
      if (j.id) {
        if (j.id === img.uid || (j.id === img.stream_owner_uid || 4 < j.priv)) {
          /** @type {string} */
          var later = "";
          /** @type {string} */
          later = img.submitted ? img.featured ? "<span class='my-label-featured'>Featured</span>" : "<span class='my-label-submitted'>Submitted</span>" : "<span class='my-submit-btn l but sml' data-iid='" + img.id + "'>Submit Image</span>";
          /** @type {string} */
          later = '<div id="img-admin" class="fPane clearfix"><div class="my-submit-status">' + later + "</div>" + (img.featured ? "" : '<div id="img-edit-btn" class="l but sml">Edit Image</div>') + '<div id="img-delete" class="l but sml">Delete Image</div></div>';
          $("#fNav").after(later);
          element.on("click", "#img-edit-btn", handler).on("click", "#img-delete", callback).on("click", "#img-update", remove).on("click", "#img-approve", login).on("click", "#img-disapprove", post).on("click", "#toImages", onSuccess);
          if (4 < j.priv) {
            request();
          }
        }
        if ("1" === I.vote) {
          $(".img-up").addClass("set");
        }
        if ("0" === I.vote) {
          $(".img-down").addClass("set");
        }
        load();
      }
      /** @type {string} */
      j = 0 < j.flags ? "NSFW" : "SFW";
      $(".main-tags").append('<label class="safe-status-' + j + '"><input id="safe-button" type="checkbox"' + ("NSFW" === j ? " checked" : "") + " /> NSFW</label>");
      /** @type {number} */
      j = 0;
      for (;3 > j;j++) {
        if ("1" === input.charAt(j)) {
          $("#show-" + modes[j]).prop("checked", true);
        }
      }
      if (I.can_claim) {
        $("#img-panel").before('<div class="ibox img-claim-msg">You created this image, but you were not logged in. You\'ll only be able to claim it for up to an hour after you created it. <a href="/login?claim_iid=' + img.id + '">Login to claim or delete it</a></div>');
      }
    }
    /**
     * @param {Object} event
     * @return {undefined}
     */
    function start(event) {
      cancelEvent(event);
      $(this).closest(".menu-wrap").find(".menu").toggle();
    }
    /**
     * @return {undefined}
     */
    function init() {
      var o = I.user;
      var distanceToUserValue;
      var newThis;
      if (o.id) {
        $(".gen-anon-wrap").show();
        if (o.pro) {
          $("#logo").after('<div id="pro-logo">pro</div>');
          $(".pro-callout").remove();
        }
        /** @type {string} */
        distanceToUserValue = '<a href="/user/' + o.user + '">Profile</a><a href="/creations">My Images</a><a href="/notifications" id="menu-nots">Notifications</a><a href="/settings">Settings</a><a id="aLogout" href="javascript:void(0)">Logout</a>';
        /** @type {string} */
        newThis = '<span id="u-user">' + o.user + '</span> <small>(<span id="u-points">' + o.points + "</span>)</small> ";
        $("#userTitle").after('<div id="numNots"' + (o.nots ? ' class="has-nots"' : "") + ">" + o.nots + "</div>");
      } else {
        $(".gen-login-wrap").show();
        $("#u-anon").show();
        /** @type {string} */
        distanceToUserValue = '<a href="javascript:void(0)" class="show-login">Login</a><a href="/signup">Signup</a>';
        /** @type {string} */
        newThis = "Login ";
      }
      $("#userMenu").html(distanceToUserValue);
      $("#u-long").html(newThis);
      switch(self.location.pathname.split("/")[1]) {
        case "memegenerator":
          if (!o.pro) {
            if (self.sfw) {
              $(".head").prepend(escapeInnerText("2970038127"));
            }
          }
          if (o.pro) {
            $(".gen-no-watermark-wrap").show();
          }
          if (8 < o.priv) {
            $(".gen-wrap").append('<div class="mm-set-positions l but">[]</div>');
          }
          break;
        case "gifgenerator":
        ;
        case "images-to-gif":
          if (!o.pro) {
            $(".head").prepend(escapeInnerText("9016571729"));
          }
          break;
        case "i":
        ;
        case "gif":
          load();
          if (990 <= X) {
            if (!o.pro) {
              if (!img.author_pro) {
                if (img.featured) {
                  if (!self.disable_rc) {
                    if (2 <= $(".com").length) {
                      $(".img-hotkeys").after('<div class="img-sidebar-ad"><div id="rcjsload_18e3c6"></div></div>');
                      next(24852, "rcjsload_18e3c6");
                    }
                  }
                }
              }
            }
          }
          break;
        case "":
        ;
        case "meme":
          if (o.pro || (0 === self.sfw || self.disable_rc)) {
            break;
          }
          if (1086 <= X) {
            if (3 <= self.num_images) {
              $("#base-right").append('<div class="base-ad"><div id="rcjsload_e74494"></div></div>');
              next(23680, "rcjsload_e74494");
            }
          }
          if (5 < self.num_images) {
            var e = $window.height();
            var f = element.height();
            /** @type {boolean} */
            var g = false;
            $window.scroll(connect(function() {
              if (!g) {
                if ($window.scrollTop() + e > f / 2) {
                  /** @type {boolean} */
                  g = true;
                  $("#base-left").find(".pager").after('<div class="pager-ad"><div id="rcjsload_f6f896"></div></div>');
                  next(24849, "rcjsload_f6f896");
                }
              }
            }));
          }
        ;
      }
    }
    /** @type {function (string, string, boolean, string, boolean): ?} */
    self.embedCodes = fn;
    /** @type {function (string, string, string, string): undefined} */
    self.insertShares = done;
    /** @type {function (string, string, string, boolean): ?} */
    self.adsenseCode = escapeInnerText;
    /**
     * @param {Object} execResult
     * @return {?}
     */
    self.form_values = function(execResult) {
      var cssNumber = {};
      execResult.find("input,textarea,select").each(function() {
        var $field = $(this);
        switch($field.attr("type")) {
          case "checkbox":
            /** @type {number} */
            cssNumber[$field.attr("name")] = $field.prop("checked") ? 1 : 0;
            break;
          case "submit":
            break;
          default:
            cssNumber[$field.attr("name")] = $field.val();
        }
      });
      return cssNumber;
    };
    if (I.done) {
      init();
    }
    $(function() {
      /** @type {number} */
      nt = nt_off = nt_on = 0;
      $(".menu-wrap").each(function() {
        var $this = $(this);
        var loading = $this.find(".menu");
        $this.hover(function() {
          loading.show();
        }, function() {
          loading.hide();
        });
      });
      element.on("vclick", ".my-submit-btn", function() {
        open($(this).attr("data-iid"));
      }).on("click", ".img-flag-cancel", clicked).on("click", ".img-flag-submit", get).on("click", ".img-flag", handle).on("vclick", ".img-flip", initialize).on("submit", "#sForm", handler).on("click", "#login-button", save).on("vclick", ".menu-btn", start).on("click", ".show-login", select).on("vclick", "#numNots", create).on("vclick", "#aLogout", onload).on("click", ".gen-no-watermark", function(event) {
        if (!I.done) {
          return false;
        }
        if (!I.user.pro) {
          return done("You can remove our watermark and get a bunch of other cool upgrades with Imgflip Pro!", ({
            "/gifgenerator" : "vgif",
            "/images-to-gif" : "igif"
          }[location.pathname] || location.pathname) + "_watermark"), cancelEvent(event);
        }
      });
      applyTips();
      update();
      run();
    });
    /**
     * @return {undefined}
     */
    self.initHome = function() {
      var pos0 = $(".base-unit").eq(5);
      var resizeHandler = connect(function() {
        if (100 > pos0.offset().top - $window.height() - $window.scrollTop()) {
          $("div.base-img").quickEach(function() {
            this.replaceWith('<img class="' + this.attr("class") + '" src="' + this.data("src") + '" alt="' + this.data("alt") + '"/>');
          });
          $window.off("scroll", resizeHandler);
        }
      });
      if (pos0[0]) {
        $window.on("scroll", resizeHandler);
        resizeHandler();
      }
      after();
      element.on("vclick", ".base-toggle-main-tags", function(event) {
        $(".main-tags").toggleClass("force-show");
        return cancelEvent(event);
      }).on("vclick", ".base-toggle-leaderboard", function(event) {
        $("#base-right,#leaderboard").toggleClass("force-show");
        return cancelEvent(event);
      });
      bindEvents("video.base-img");
      select(report);
    };
    /**
     * @return {undefined}
     */
    self.initFlip = function() {
      if (self.img) {
        /** @type {number} */
        fetching = submitting = 0;
        /** @type {boolean} */
        hasComs = true;
        /** @type {number} */
        lastCom = 0;
        select(win);
        render("#im");
        $("#c-new-main").find(".c-new-text").focus(function() {
          if (I.done && !error()) {
            select();
          } else {
            if (!!I.done) {
              if (!I.user.email_verified) {
                if (!I.user.pro) {
                  valueAccessor();
                }
              }
            }
          }
        });
        $("#img-prev,#img-next").click(function(event) {
          var dest = $(this).attr("href");
          if (27 === I.user.id) {
            self.location = dest;
          }
          cancelEvent(event);
        });
        $(".img-down").click(function() {
          show(img.id, 0, this.parentNode);
        });
        $(".img-up").click(function() {
          show(img.id, 1, this.parentNode);
        });
        render(".c-text img");
        done("#fShare", img.id.toString(36), img.type, doc.title.split(" - Imgflip")[0].split(/ Meme$/)[0]);
        $("#img-embed-codes-btn").click(get);
        stop();
        element.on("focus", "input,textarea", function() {
          stop(false);
        }).on("blur", "input,textarea", stop).on("click", ".bad-com", function() {
          var $btn = $(this);
          var form = $btn.closest(".com");
          var span = form.find(".c-text");
          span.append(span.data("text"));
          form.removeClass("hidden");
          form = form.next();
          for (;form.hasClass("child-of-bad");) {
            form.removeClass("child-of-bad");
            form = form.next();
          }
          $btn.remove();
        }).on("click", ".c-up,.c-down", fn).on("click", ".c-delete", onSuccess).on("click", ".c-reply", update).on("click", ".c-flag", callback).on("click", ".c-add-btn", function() {
          next(img.id, $(this).closest(".c-new-wrap"));
        }).on("click", ".c-meme-btn", function() {
          if (I.done && !error()) {
            select();
          } else {
            if (!I.done || (I.user.email_verified || I.user.pro)) {
              if (I.done) {
                if (error()) {
                  showGenerator($(this).closest(".c-new-wrap"));
                }
              }
            } else {
              valueAccessor();
            }
          }
        }).on("click", ".comRight", function(self) {
          if (-1 !== ["com", "comRight", "c-text", "comStats"].indexOf($(self.target).attr("class"))) {
            self = $(this).closest(".com");
            /** @type {number} */
            var b = ~~self.data("l");
            var view = self.next();
            var val = self.hasClass("collapsed");
            /** @type {boolean} */
            var e = false;
            for (;~~view.data("l") > b;) {
              if (val) {
                view.show();
              } else {
                view.hide();
              }
              view = view.next();
              /** @type {boolean} */
              e = true;
            }
            if (e) {
              self.toggleClass("collapsed", !val);
            }
          }
        }).on("click", ".c-img-link", function() {
          var $el = $(this);
          if ($el.data("shown")) {
            $el.next(".c-img").hide();
            $el.data("shown", false);
          } else {
            $el.after('<img class="c-img" src="//' + $el.text().split(" ")[0] + '"/>');
            render($el.next());
            $el.data("shown", true);
          }
        });
        var pos0 = $(".com").eq(7);
        var resizeHandler = connect(function() {
          if (100 > pos0.offset().top - $window.height() - $window.scrollTop()) {
            $(".c-lazy-img").quickEach(function() {
              this.replaceWith('<img src="' + this.data("src") + '"/>');
            });
            $window.off("scroll", resizeHandler);
            render(".c-text img");
          }
        });
        if (pos0[0]) {
          $window.on("scroll", resizeHandler);
          resizeHandler();
        }
        if ("gif" === img.type) {
          bindEvents("video#vid");
        }
      }
    };
    /** @type {function (): undefined} */
    self.initData = init;
  })(self);
  (function($, codeSegments, el, dataAndEvents) {
    /**
     * @param {Object} event
     * @return {?}
     */
    function getNativeEvent(event) {
      for (;event && "undefined" !== typeof event.originalEvent;) {
        event = event.originalEvent;
      }
      return event;
    }
    /**
     * @param {Object} element
     * @return {?}
     */
    function getVirtualBindingFlags(element) {
      var flags = {};
      var b;
      var key;
      for (;element;) {
        b = $.data(element, dataPropertyName);
        for (key in b) {
          if (b[key]) {
            /** @type {boolean} */
            flags[key] = flags.hasVirtualBinding = true;
          }
        }
        element = element.parentNode;
      }
      return flags;
    }
    /**
     * @return {undefined}
     */
    function startResetTimer() {
      if (tref) {
        clearTimeout(tref);
        /** @type {number} */
        tref = 0;
      }
      /** @type {number} */
      tref = setTimeout(function() {
        /** @type {number} */
        lastTouchID = tref = 0;
        /** @type {number} */
        clickBlockList.length = 0;
        /** @type {boolean} */
        K = false;
        /** @type {boolean} */
        stack = true;
      }, $.vmouse.resetTimerDuration);
    }
    /**
     * @param {Object} eventType
     * @param {Object} ev
     * @param {Object} target
     * @return {?}
     */
    function triggerVirtualEvent(eventType, ev, target) {
      var event;
      var result;
      if (!(result = target && target[eventType])) {
        if (target = !target) {
          target = ev.target;
          a: for (;target;) {
            if ((result = $.data(target, dataPropertyName)) && (!eventType || result[eventType])) {
              break a;
            }
            target = target.parentNode;
          }
        }
        /** @type {Object} */
        result = target;
      }
      if (result) {
        /** @type {Object} */
        event = ev;
        target = event.type;
        var e;
        var _len;
        event = $.Event(event);
        /** @type {Object} */
        event.type = eventType;
        eventType = event.originalEvent;
        result = $.event.props;
        if (-1 < target.search(/^(mouse|click)/)) {
          result = subKey;
        }
        if (eventType) {
          _len = result.length;
          e;
          for (;_len;) {
            e = result[--_len];
            event[e] = eventType[e];
          }
        }
        if (-1 < target.search(/mouse(down|up)|click/)) {
          if (!event.which) {
            /** @type {number} */
            event.which = 1;
          }
        }
        if (-1 !== target.search(/^touch/) && (e = getNativeEvent(eventType), target = e.touches, e = e.changedTouches, eventType = target && target.length ? target[0] : e && e.length ? e[0] : dataAndEvents)) {
          /** @type {number} */
          target = 0;
          /** @type {number} */
          result = cache.length;
          for (;target < result;target++) {
            /** @type {string} */
            e = cache[target];
            event[e] = eventType[e];
          }
        }
        $(ev.target).trigger(event);
      }
      return event;
    }
    /**
     * @param {Object} event
     * @return {undefined}
     */
    function mouseEventCallback(event) {
      var ve = $.data(event.target, touchTargetPropertyName);
      if (!K) {
        if (!(lastTouchID && lastTouchID === ve)) {
          if (!!(ve = triggerVirtualEvent("v" + event.type, event))) {
            if (ve.isDefaultPrevented()) {
              event.preventDefault();
            }
            if (ve.isPropagationStopped()) {
              event.stopPropagation();
            }
            if (ve.isImmediatePropagationStopped()) {
              event.stopImmediatePropagation();
            }
          }
        }
      }
    }
    /**
     * @param {Object} event
     * @return {undefined}
     */
    function handleTouchStart(event) {
      var flags = getNativeEvent(event).touches;
      var target;
      if (flags) {
        if (1 === flags.length) {
          target = event.target;
          flags = getVirtualBindingFlags(target);
          if (flags.hasVirtualBinding) {
            /** @type {number} */
            lastTouchID = nextTouchID++;
            $.data(target, touchTargetPropertyName, lastTouchID);
            if (tref) {
              clearTimeout(tref);
              /** @type {number} */
              tref = 0;
            }
            /** @type {boolean} */
            list = stack = false;
            target = getNativeEvent(event).touches[0];
            ax = target.pageX;
            y = target.pageY;
            triggerVirtualEvent("vmouseover", event, flags);
            triggerVirtualEvent("vmousedown", event, flags);
          }
        }
      }
    }
    /**
     * @param {Object} event
     * @return {undefined}
     */
    function handleScroll(event) {
      if (!stack) {
        if (!list) {
          triggerVirtualEvent("vmousecancel", event, getVirtualBindingFlags(event.target));
        }
        /** @type {boolean} */
        list = true;
        startResetTimer();
      }
    }
    /**
     * @param {Object} event
     * @return {undefined}
     */
    function handleTouchMove(event) {
      if (!stack) {
        var touch = getNativeEvent(event).touches[0];
        var v = list;
        var moveThreshold = $.vmouse.moveDistanceThreshold;
        var basePrototype = getVirtualBindingFlags(event.target);
        if (list = list || (Math.abs(touch.pageX - ax) > moveThreshold || Math.abs(touch.pageY - y) > moveThreshold)) {
          if (!v) {
            triggerVirtualEvent("vmousecancel", event, basePrototype);
          }
        }
        triggerVirtualEvent("vmousemove", event, basePrototype);
        startResetTimer();
      }
    }
    /**
     * @param {Object} event
     * @return {undefined}
     */
    function handleTouchEnd(event) {
      if (!stack) {
        /** @type {boolean} */
        stack = true;
        var basePrototype = getVirtualBindingFlags(event.target);
        var evt;
        triggerVirtualEvent("vmouseup", event, basePrototype);
        if (!list) {
          if (evt = triggerVirtualEvent("vclick", event, basePrototype)) {
            if (evt.isDefaultPrevented()) {
              evt = getNativeEvent(event).changedTouches[0];
              clickBlockList.push({
                touchID : lastTouchID,
                x : evt.clientX,
                y : evt.clientY
              });
              /** @type {boolean} */
              K = true;
            }
          }
        }
        triggerVirtualEvent("vmouseout", event, basePrototype);
        /** @type {boolean} */
        list = false;
        startResetTimer();
      }
    }
    /**
     * @param {Object} map
     * @return {?}
     */
    function hasVirtualBindings(map) {
      map = $.data(map, dataPropertyName);
      var letter;
      if (map) {
        for (letter in map) {
          if (map[letter]) {
            return true;
          }
        }
      }
      return false;
    }
    /**
     * @return {undefined}
     */
    function moveHandler() {
    }
    /**
     * @param {string} eventType
     * @return {?}
     */
    function getSpecialEventObject(eventType) {
      var realType = eventType.substr(1);
      return{
        /**
         * @return {undefined}
         */
        setup : function() {
          if (!hasVirtualBindings(this)) {
            $.data(this, dataPropertyName, {});
          }
          /** @type {boolean} */
          $.data(this, dataPropertyName)[eventType] = true;
          _listeners[eventType] = (_listeners[eventType] || 0) + 1;
          if (1 === _listeners[eventType]) {
            $document.bind(realType, mouseEventCallback);
          }
          $(this).bind(realType, moveHandler);
          if (isSupported) {
            _listeners.touchstart = (_listeners.touchstart || 0) + 1;
            if (1 === _listeners.touchstart) {
              $document.bind("touchstart", handleTouchStart).bind("touchend", handleTouchEnd).bind("touchmove", handleTouchMove).bind("scroll", handleScroll);
            }
          }
        },
        /**
         * @return {undefined}
         */
        teardown : function() {
          --_listeners[eventType];
          if (!_listeners[eventType]) {
            $document.unbind(realType, mouseEventCallback);
          }
          if (isSupported) {
            --_listeners.touchstart;
            if (!_listeners.touchstart) {
              $document.unbind("touchstart", handleTouchStart).unbind("touchmove", handleTouchMove).unbind("touchend", handleTouchEnd).unbind("scroll", handleScroll);
            }
          }
          var $this = $(this);
          var bindings = $.data(this, dataPropertyName);
          if (bindings) {
            /** @type {boolean} */
            bindings[eventType] = false;
          }
          $this.unbind(realType, moveHandler);
          if (!hasVirtualBindings(this)) {
            $this.removeData(dataPropertyName);
          }
        }
      };
    }
    /** @type {string} */
    var dataPropertyName = "virtualMouseBindings";
    /** @type {string} */
    var touchTargetPropertyName = "virtualTouchID";
    /** @type {Array.<string>} */
    codeSegments = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" ");
    /** @type {Array.<string>} */
    var cache = "clientX clientY pageX pageY screenX screenY".split(" ");
    var subKey = $.event.props.concat($.event.mouseHooks ? $.event.mouseHooks.props : []);
    var _listeners = {};
    /** @type {number} */
    var tref = 0;
    /** @type {number} */
    var ax = 0;
    /** @type {number} */
    var y = 0;
    /** @type {boolean} */
    var list = false;
    /** @type {Array} */
    var clickBlockList = [];
    /** @type {boolean} */
    var K = false;
    /** @type {boolean} */
    var stack = false;
    /** @type {boolean} */
    var isSupported = "addEventListener" in el;
    var $document = $(el);
    /** @type {number} */
    var nextTouchID = 1;
    /** @type {number} */
    var lastTouchID = 0;
    var threshold;
    $.vmouse = {
      moveDistanceThreshold : 10,
      clickDistanceThreshold : 10,
      resetTimerDuration : 1500
    };
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i++) {
      $.event.special[codeSegments[i]] = getSpecialEventObject(codeSegments[i]);
    }
    if (isSupported) {
      el.addEventListener("click", function(e) {
        /** @type {number} */
        var valuesLen = clickBlockList.length;
        /** @type {(EventTarget|null)} */
        var target = e.target;
        var x;
        var y;
        var ele;
        var i;
        var o;
        if (valuesLen) {
          /** @type {number} */
          x = e.clientX;
          /** @type {number} */
          y = e.clientY;
          threshold = $.vmouse.clickDistanceThreshold;
          /** @type {(EventTarget|null)} */
          ele = target;
          for (;ele;) {
            /** @type {number} */
            i = 0;
            for (;i < valuesLen;i++) {
              if (o = clickBlockList[i], ele === target && (Math.abs(o.x - x) < threshold && Math.abs(o.y - y) < threshold) || $.data(ele, touchTargetPropertyName) === o.touchID) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
            }
            ele = ele.parentNode;
          }
        }
      }, true);
    }
  })(jQuery, self, doc);
})(window, document, $w, $d);
