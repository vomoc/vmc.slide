/**
 * vmc.slide 图片轮播JQuery插件 v2.0.0
 * 维米客网页工作室 vomoc.com
 * https://github.com/vomoc/vmc.slide
 * vomoc@qq.com
 * 2017/03/20
 **/
;(function ($, undefined) {
    var dataKey = "vomoc";
    var ie6 = !-[1,] && !window.XMLHttpRequest;
    var ie9plus = navigator.appName !== "Microsoft Internet Explorer" || parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) >= 9;
    var effects = {
        "fade": function (index) {
            var the = this, opts = the.options;
            the.transfer[3].fadeIn(opts.speed, function () {
                the._resetTransfer(index)
            })
        }
    };
    $.fn.vmcSlide = function (settings) {
        var run = $.type(settings) === "string", args = [].slice.call(arguments, 1);
        if (!this.length) {
            return
        }
        return this.each(function () {
            var $element = $(this), instance = $element.data(dataKey);
            if (run && settings.charAt(0) !== "_" && instance) {
                vmcSlide.prototype[settings] && vmcSlide.prototype[settings].apply(instance, args)
            } else {
                if (!run && !instance) {
                    instance = new vmcSlide($element, settings);
                    instance._init();
                    $element.data(dataKey, instance)
                }
            }
        })
    };
    $.vmcSlideEffects = function () {
        if ($.isPlainObject(arguments[0])) {
            effects = $.extend({}, effects, arguments[0])
        } else {
            if ($.type(arguments[0]) === "string" && $.type(arguments[1]) === "function") {
                effects[arguments[0]] = arguments[1]
            }
        }
    };
    var vmcSlide = function ($element, settings) {
        var the = this;
        the.options = $.extend({}, the.options, settings);
        the.elem = $element;
        the.original = $element.children();
        the.mimic = null;
        the.transfer = [];
        the.data = [];
        the.index = 0;
        the.effectIndex = 0;
        the.animateStatus = false;
        the.width = 0;
        the.height = 0;
        the.imgWidth = 0;
        the.imgHeight = 0;
        the.auto = the.options.autoPlay;
        the.timer = null
    };
    vmcSlide.prototype.options = {
        data: [],
        width: "auto",
        height: "auto",
        imgWidth: 0,
        imgHeight: 0,
        minWidth: 0,
        minHeight: 0,
        gridTdX: 10,
        gridTdY: 5,
        gridOdX: 30,
        gridOdY: 10,
        sideButton: true,
        navButton: true,
        showText: "auto",
        isHtml: false,
        autoPlay: true,
        ascending: true,
        effects: ["fade"],
        ie6Tidy: false,
        random: true,
        duration: 4000,
        speed: 800,
        hoverStop: true,
        flip: function (fromIndex, toIndex) {
        },
        created: function () {
        }
    };
    vmcSlide.prototype.option = function (name, value) {
        var the = this, opts = the.options;
        opts[name] = value;
        if ($.inArray(name, ["data", "gridTdX", "gridTdY", "gridOdX", "gridOdY", "sideButton", "navButton"]) > 0) {
            the._buildStage()
        }
        if ($.inArray(name, ["data", "gridTdX", "gridTdY", "gridOdX", "gridOdY", "sideButton", "navButton", "width", "height", "imgWidth", "imgHeight", "minWidth", "minHeight",]) > 0) {
            the._setSize()
        }
        switch (name) {
            case"autoPlay":
                the.auto = value;
                break
        }
    };
    vmcSlide.prototype._init = function () {
        var the = this, opts = the.options;
        the._setSceneData();
        the._buildStage();
        the._setSize();
        the._resetTransfer(the.index);
        opts.created.call(the);
        the.mimic.on("click", ".vui-slide-handle-button", function () {
            the._goto($(this).index())
        }).on("click", ".vui-slide-side-button", function () {
            if ($(this).hasClass("next")) {
                the._next()
            } else {
                the._prev()
            }
        }).on("mouseenter", function () {
            the.mimic.find(".vui-slide-side-buttons").children().addClass("hover");
            if (opts.hoverStop) {
                clearTimeout(the.timer);
                the.auto = false
            }
        }).on("mouseleave", function () {
            the.mimic.find(".vui-slide-side-buttons").children().removeClass("hover");
            if (opts.hoverStop) {
                the.auto = the.options.autoPlay;
                if (!the.animateStatus) {
                    the._resetTransfer(the.index)
                }
            }
        });
        $(window).on("resize", function () {
            the._setSize()
        })
    };
    vmcSlide.prototype._setSceneData = function () {
        var the = this, opts = the.options;
        var sceneData = the.original.children().map(function () {
            var $this = $(this);
            return {
                src: $this.data("src") || $this.find("img").attr("src"),
                text: $this.data("text"),
                href: $this.data("href") || $this.find("a").attr("href"),
                target: $this.data("target") || $this.find("a").attr("target")
            }
        }).toArray();
        the.data = sceneData.concat(opts.data)
    };
    vmcSlide.prototype._setScene = function (index) {
        var the = this;
        var $scene = the.mimic.children(".vui-slide-scene");
        $scene.attr("href", the.data[index].href || "javascript:void(0);").css({backgroundImage: "url(" + the.data[index].src + ")"});
        if (the.data[index].target) {
            $scene.attr("target", the.data[index].target)
        }
        if (!ie9plus) {
            $scene.children("img").attr("src", the.data[index].src)
        }
    };
    vmcSlide.prototype._setTransferGrid = function (index) {
        var the = this;
        the.mimic.find(".vui-slide-grid").css({backgroundImage: "url(" + the.data[index].src + ")"});
        if (index > the.index) {
            the.transfer[4].children(".vui-slide-grid").first().css({backgroundImage: "url(" + the.data[the.index].src + ")"});
            the.transfer[5].children(".vui-slide-grid").first().css({backgroundImage: "url(" + the.data[the.index].src + ")"})
        } else {
            the.transfer[4].children(".vui-slide-grid").last().css({backgroundImage: "url(" + the.data[the.index].src + ")"});
            the.transfer[5].children(".vui-slide-grid").last().css({backgroundImage: "url(" + the.data[the.index].src + ")"})
        }
        if (!ie9plus) {
            the.transfer[3].children().find("img").attr("src", the.data[index].src);
            the.transfer[4].children().find("img").attr("src", the.data[index].src);
            the.transfer[5].children().find("img").attr("src", the.data[index].src)
        }
    };
    vmcSlide.prototype._setHandleButtonActive = function (index) {
        var the = this;
        the.mimic.find(".vui-slide-handle-button").removeClass("active").eq(index).addClass("active")
    };
    vmcSlide.prototype._setText = function (index) {
        var the = this, opts = the.options;
        var text = the.data[index].text || "";
        var isShow = $.type(opts.showText) === "boolean" ? opts.showText : !!text;
        var $text = the.mimic.children(".vui-slide-text");
        if (opts.isHtml) {
            $text.html(text)
        } else {
            $text.html($("<div>").addClass("text").text(text))
        }
        the.mimic.children(".vui-slide-mask,.vui-slide-text").toggle(isShow)
    };
    vmcSlide.prototype._buildStage = function () {
        var the = this;
        the._buildMimic();
        the._buildScene();
        the._buildTransfer();
        the._buildHandleButton();
        the._buildSideButton();
        the._buildText();
        the.elem.empty().append(the.mimic)
    };
    vmcSlide.prototype._buildMimic = function () {
        var the = this;
        the.mimic = $("<div>").addClass("vui-slide-mimic")
    };
    vmcSlide.prototype._buildScene = function () {
        var the = this;
        var $scene = $("<a>").addClass("vui-slide-scene");
        if (!ie9plus) {
            $scene.append("<img>")
        }
        the.mimic.append($scene)
    };
    vmcSlide.prototype._buildTransfer = function () {
        var the = this, opts = the.options;
        the.transfer = [$('<ul class="vui-slide-transfer" style="display:none;">' + the._buildTransferGrid(opts.gridTdX * opts.gridTdY) + "</ul>"), $('<ul class="vui-slide-transfer" style="display:none;">' + the._buildTransferGrid(opts.gridOdX) + "</ul>"), $('<ul class="vui-slide-transfer" style="display:none;">' + the._buildTransferGrid(opts.gridOdY) + "</ul>"), $('<ul class="vui-slide-transfer" style="display:none;">' + the._buildTransferGrid(1) + "</ul>"), $('<ul class="vui-slide-transfer" style="display:none;">' + the._buildTransferGrid(2) + "</ul>"), $('<ul class="vui-slide-transfer" style="display:none;">' + the._buildTransferGrid(2) + "</ul>")];
        if (!ie9plus) {
            the.transfer[3].children().append("<img>");
            the.transfer[4].children().append("<img>");
            the.transfer[5].children().append("<img>")
        }
        the.mimic.append(the.transfer)
    };
    vmcSlide.prototype._buildTransferGrid = function (count) {
        var html = "";
        for (var i = 0; i < count; i++) {
            html += '<li class="vui-slide-grid"></li>'
        }
        return html
    };
    vmcSlide.prototype._buildHandleButton = function () {
        var the = this, opts = the.options;
        if (opts.navButton) {
            var html = "";
            for (var i = 0; i < the.data.length; i++) {
                html += '<li class="vui-slide-handle-button"></li>'
            }
            html = '<ul class="vui-slide-handle-buttons">' + html + "</ul>";
            the.mimic.append(html)
        }
    };
    vmcSlide.prototype._buildSideButton = function () {
        var the = this, opts = the.options;
        if (opts.sideButton) {
            var html = '<div class="vui-slide-side-buttons">' + '<div class="vui-slide-side-button prev"></div>' + '<div class="vui-slide-side-button next"></div>' + "</div>";
            the.mimic.append(html)
        }
    };
    vmcSlide.prototype._buildText = function () {
        var the = this;
        var $textMask = $('<div class="vui-slide-mask" style="display:none;"></div>');
        var $text = $('<div class="vui-slide-text" style="display:none;"></div>');
        the.mimic.append($textMask).append($text)
    };
    vmcSlide.prototype._setSize = function () {
        var the = this, $elem = the.elem, opts = the.options;
        the.width = opts.width === "auto" ? $elem.width() : opts.width;
        the.height = opts.height === "auto" ? $elem.height() : opts.height;
        the.width = the.width < opts.minWidth ? opts.minWidth : the.width;
        the.height = the.height < opts.minHeight ? opts.minHeight : the.height;
        the.imgWidth = opts.imgWidth <= 0 ? the.width : opts.imgWidth;
        the.imgHeight = opts.imgHeight <= 0 ? the.height : opts.imgHeight;
        var imgHeight, imgWidth, imgTop, imgLeft;
        if (the.imgWidth / the.imgHeight > the.width / the.height) {
            imgHeight = the.height;
            imgWidth = Math.round(imgHeight * the.imgWidth / the.imgHeight);
            imgLeft = Math.round((imgWidth - the.width) / 2);
            imgTop = 0
        } else {
            imgWidth = the.width;
            imgHeight = Math.round(imgWidth * the.imgHeight / the.imgWidth);
            imgTop = Math.round((imgHeight - the.height) / 2);
            imgLeft = 0
        }
        opts.width === "auto" || $elem.width(the.width);
        opts.height === "auto" || $elem.height(the.height);
        the.mimic.height(the.height).width(the.width);
        the.mimic.children(".vui-slide-scene").height(the.height).width(the.width).css({
            backgroundSize: imgWidth + "px " + imgHeight + "px",
            backgroundPosition: "-" + imgLeft + "px -" + imgTop + "px"
        });
        var xyHeight = Math.round(the.height / opts.gridTdY);
        var xyWidth = Math.round(the.width / opts.gridTdX);
        var lastXyHeight = the.height - xyHeight * (opts.gridTdY - 1);
        var lastXyWidth = the.width - xyWidth * (opts.gridTdX - 1);
        the.transfer[0].children(".vui-slide-grid").each(function (index) {
            var width = (index + 1) % opts.gridTdX === 0 ? lastXyWidth : xyWidth;
            var height = index >= (opts.gridTdY - 1) * opts.gridTdX ? lastXyHeight : xyHeight;
            var top = xyHeight * Math.floor(index / opts.gridTdX);
            var left = xyWidth * (index % opts.gridTdX);
            $(this).height(height).width(width).data({
                width: width,
                height: height,
                left: left,
                top: top,
                imgLeft: imgLeft + left,
                imgTop: imgTop + top
            }).css({
                top: top,
                left: left,
                backgroundSize: imgWidth + "px " + imgHeight + "px",
                backgroundPosition: "-" + (imgLeft + left) + "px -" + (imgTop + top) + "px"
            })
        });
        var xWidth = Math.round(the.width / opts.gridOdX);
        var lastXWidth = the.width - xWidth * (opts.gridOdX - 1);
        the.transfer[1].children(".vui-slide-grid").each(function (index) {
            var width = index >= opts.gridOdX - 1 ? lastXWidth : xWidth;
            var height = the.height;
            var top = 0;
            var left = xWidth * index;
            $(this).height(height).width(width).data({
                width: width,
                height: height,
                left: left,
                top: top,
                imgLeft: imgLeft + left,
                imgTop: imgTop + top
            }).css({
                top: top,
                left: left,
                backgroundSize: imgWidth + "px " + imgHeight + "px",
                backgroundPosition: "-" + (imgLeft + left) + "px -" + (imgTop + top) + "px"
            })
        });
        var yHeight = Math.round(the.height / opts.gridOdY);
        var lastYHeight = the.height - yHeight * (opts.gridOdY - 1);
        the.transfer[2].children(".vui-slide-grid").each(function (index) {
            var width = the.width;
            var height = index >= opts.gridOdY - 1 ? lastYHeight : yHeight;
            var top = yHeight * index;
            var left = 0;
            $(this).height(height).width(width).data({
                width: width,
                height: height,
                left: left,
                top: top,
                imgLeft: imgLeft + left,
                imgTop: imgTop + top
            }).css({
                top: top,
                left: left,
                backgroundSize: imgWidth + "px " + imgHeight + "px",
                backgroundPosition: "-" + (imgLeft + left) + "px -" + (imgTop + top) + "px"
            })
        });
        the.transfer[3].children(".vui-slide-grid").height(the.height).width(the.width).data({
            width: the.width,
            height: the.height,
            left: 0,
            top: 0,
            imgLeft: imgLeft,
            imgTop: imgTop
        }).css({
            top: 0,
            left: 0,
            backgroundSize: imgWidth + "px " + imgHeight + "px",
            backgroundPosition: "-" + imgLeft + "px -" + imgTop + "px"
        });
        the.transfer[4].width(the.width * 2).children(".vui-slide-grid").each(function (index) {
            var left = index * the.width;
            $(this).height(the.height).width(the.width).data({
                width: the.width,
                height: the.height,
                left: left,
                top: 0,
                imgLeft: imgLeft,
                imgTop: imgTop
            }).css({
                top: 0,
                left: left,
                backgroundSize: imgWidth + "px " + imgHeight + "px",
                backgroundPosition: "-" + imgLeft + "px -" + imgTop + "px"
            })
        });
        the.transfer[5].height(the.height * 2).children(".vui-slide-grid").each(function (index) {
            var top = index * the.height;
            $(this).height(the.height).width(the.width).data({
                width: the.width,
                height: the.height,
                left: 0,
                top: top,
                imgLeft: imgLeft,
                imgTop: imgTop
            }).css({
                top: top,
                left: 0,
                backgroundSize: imgWidth + "px " + imgHeight + "px",
                backgroundPosition: "-" + imgLeft + "px -" + imgTop + "px"
            })
        })
    };
    vmcSlide.prototype._next = function () {
        var the = this;
        var index = the.index + 1;
        index = index >= the.data.length ? 0 : index;
        the._play(index)
    };
    vmcSlide.prototype._prev = function () {
        var the = this;
        var index = the.index - 1;
        index = index < 0 ? the.data.length - 1 : index;
        the._play(index)
    };
    vmcSlide.prototype._goto = function (index) {
        var the = this;
        index = index > the.data.length - 1 ? the.data.length - 1 : index;
        index = index < 0 ? 0 : index;
        if (index - the.index === 0) {
            return
        }
        the._play(index)
    };
    vmcSlide.prototype._play = function (index) {
        var the = this, opts = the.options;
        clearTimeout(the.timer);
        if (!the.animateStatus && the.data.length > 1) {
            the.animateStatus = true;
            the._setHandleButtonActive(index);
            the._setText(index);
            the._setTransferGrid(index);
            opts.flip.call(the, the.index, index);
            effects[the._getEffect()].call(the, index)
        }
    };
    vmcSlide.prototype._resetTransfer = function (index) {
        var the = this, opts = the.options;
        the._setScene(index);
        the._setHandleButtonActive(index);
        the._setText(index);
        the.mimic.find(".vui-slide-grid").clearQueue();
        the.mimic.children(".vui-slide-transfer").hide();
        the.index = index;
        the.animateStatus = false;
        if (the.auto) {
            the.timer = setTimeout(function () {
                if (opts.ascending) {
                    the._next()
                } else {
                    the._prev()
                }
            }, opts.duration)
        }
    };
    vmcSlide.prototype._getEffect = function () {
        var the = this, opts = the.options, ie6Tidy = ie6 && opts.ie6Tidy,
            ie9Tidy = !ie9plus && (the.width - opts.imgWidth !== 0 || the.height - opts.imgHeight !== 0);
        if (ie6Tidy || ie9Tidy) {
            return "fade"
        } else {
            if (opts.random) {
                the.effectIndex = Math.floor(opts.effects.length * Math.random())
            } else {
                the.effectIndex++
            }
            if (the.effectIndex >= opts.effects.length) {
                the.effectIndex = 0
            }
            return opts.effects[the.effectIndex]
        }
    }
})(jQuery);

(function ($, undefined) {
    $.vmcSlideEffects({
        "slideX": function (index) {
            var the = this, opts = the.options;
            if (index > the.index) {
                the.transfer[4].show().animate({left: -the.width}, opts.speed, function () {
                    $(this).css({left: 0});
                    the._resetTransfer(index)
                })
            } else {
                the.transfer[4].show().css("left", -the.width).animate({left: 0}, opts.speed, function () {
                    the._resetTransfer(index)
                })
            }
        }, "slideY": function (index) {
            var the = this, opts = the.options;
            if (index > the.index) {
                the.transfer[5].show().animate({top: -the.height}, opts.speed, function () {
                    $(this).css({top: 0});
                    the._resetTransfer(index)
                })
            } else {
                the.transfer[5].show().css("top", -the.height).animate({top: 0}, opts.speed, function () {
                    the._resetTransfer(index)
                })
            }
        }, "page": function (index) {
            var the = this, opts = the.options;
            if (index > the.index) {
                the.transfer[0].show().children(".vui-slide-grid").css({opacity: 0}).each(function (i) {
                    var x = i % opts.gridTdX;
                    var y = Math.floor(i / opts.gridTdX);
                    var delay = ((y + 1) / opts.gridTdY + (x + 1) / opts.gridTdX) / 2;
                    delay = opts.speed / 3 * 2 * delay;
                    $(this).delay(delay).animate({opacity: 1}, opts.speed / 3)
                }).last().queue(function () {
                    the._resetTransfer(index)
                })
            } else {
                the.transfer[0].show().children(".vui-slide-grid").css({opacity: 0}).each(function (i) {
                    var x = i % opts.gridTdX;
                    var y = Math.floor(i / opts.gridTdX);
                    var delay = 1 - (y / opts.gridTdY + x / opts.gridTdX) / 2;
                    delay = opts.speed / 3 * 2 * delay;
                    $(this).delay(delay).animate({opacity: 1}, opts.speed / 3)
                }).first().queue(function () {
                    the._resetTransfer(index)
                })
            }
        }, "circle": function (index) {
            var the = this, opts = the.options;
            the.transfer[0].show().children(".vui-slide-grid").css({
                opacity: 0,
                width: 0,
                height: 0,
                borderRadius: "50%"
            }).each(function (i) {
                var $this = $(this);
                var x = i % opts.gridTdX;
                var y = Math.floor(i / opts.gridTdX);
                var delay = ((y + 1) / opts.gridTdY + (x + 1) / opts.gridTdX) / 2;
                delay = opts.speed / 3 * 2 * delay;
                $this.css({
                    marginLeft: parseInt($this.data("width")) / 2,
                    marginTop: parseInt($this.data("height")) / 2,
                    backgroundPositionX: -(parseInt($this.data("imgLeft")) + parseInt($this.data("width")) / 2),
                    backgroundPositionY: -(parseInt($this.data("imgTop")) + parseInt($this.data("height")) / 2)
                });
                $this.animate({
                    opacity: 0.6,
                    marginLeft: 0,
                    marginTop: 0,
                    backgroundPositionX: -parseInt($this.data("imgLeft")),
                    backgroundPositionY: -parseInt($this.data("imgTop")),
                    width: $this.data("width"),
                    height: $this.data("height"),
                }, opts.speed / 3 * 2, "linear").animate({opacity: 1, borderRadius: 0}, opts.speed / 3, "linear")
            }).last().queue(function () {
                the._resetTransfer(index)
            })
        }, "rollingX": function (index) {
            var the = this, opts = the.options;
            if (index > the.index) {
                the.transfer[1].show().children(".vui-slide-grid").css({opacity: 0}).each(function (i) {
                    var delay = opts.speed / 3 * 2 / opts.gridOdX * (i + 1);
                    $(this).delay(delay).animate({opacity: 1}, opts.speed / 3)
                }).last().queue(function () {
                    the._resetTransfer(index)
                })
            } else {
                the.transfer[1].show().children(".vui-slide-grid").css({opacity: 0}).each(function (i) {
                    var delay = opts.speed / 3 * 2 / opts.gridOdX * (opts.gridOdX - i);
                    $(this).delay(delay).animate({opacity: 1}, opts.speed / 3)
                }).first().queue(function () {
                    the._resetTransfer(index)
                })
            }
        }, "rollingY": function (index) {
            var the = this, opts = the.options;
            if (index > the.index) {
                the.transfer[2].show().children(".vui-slide-grid").css({opacity: 0}).each(function (i) {
                    var delay = opts.speed / 3 * 2 / opts.gridOdY * (i + 1);
                    $(this).delay(delay).animate({opacity: 1}, opts.speed / 3)
                }).last().queue(function () {
                    the._resetTransfer(index)
                })
            } else {
                the.transfer[2].show().children(".vui-slide-grid").css({opacity: 0}).each(function (i) {
                    var delay = opts.speed / 3 * 2 / opts.gridOdY * (opts.gridOdY - i);
                    $(this).delay(delay).animate({opacity: 1}, opts.speed / 3)
                }).first().queue(function () {
                    the._resetTransfer(index)
                })
            }
        }, "blindsX": function (index) {
            var the = this, opts = the.options;
            if (index > the.index) {
                the.transfer[1].show().children().css({width: 0, opacity: 0}).each(function (i) {
                    var $this = $(this);
                    var delay = opts.speed / 3 * 2 / opts.gridOdX * (i + 1);
                    $this.delay(delay).animate({width: $this.data("width"), opacity: 1}, opts.speed / 3)
                }).last().queue(function () {
                    the._resetTransfer(index)
                })
            } else {
                the.transfer[1].show().children().css({width: 0, opacity: 0}).each(function (i) {
                    var $this = $(this);
                    var delay = opts.speed / 3 * 2 / opts.gridOdX * (opts.gridOdX - i);
                    $this.delay(delay).animate({width: $this.data("width"), opacity: 1}, opts.speed / 3)
                }).first().queue(function () {
                    the._resetTransfer(index)
                })
            }
        }, "blindsY": function (index) {
            var the = this, opts = the.options;
            if (index > the.index) {
                the.transfer[2].show().children().css({height: 0, opacity: 0}).each(function (i) {
                    var $this = $(this);
                    var delay = opts.speed / 3 * 2 / opts.gridOdY * (i + 1);
                    $this.delay(delay).animate({height: $this.data("height"), opacity: 1}, opts.speed / 3)
                }).last().queue(function () {
                    the._resetTransfer(index)
                })
            } else {
                the.transfer[2].show().children().css({height: 0, opacity: 0}).each(function (i) {
                    var $this = $(this);
                    var delay = opts.speed / 3 * 2 / opts.gridOdY * (opts.gridOdY - i);
                    $this.delay(delay).animate({height: $this.data("height"), opacity: 1}, opts.speed / 3)
                }).first().queue(function () {
                    the._resetTransfer(index)
                })
            }
        }
    })
})(jQuery);