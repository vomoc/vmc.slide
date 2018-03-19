/**
 * VmcSlider 图片轮播插件 v1.2.0
 * 维米客网页工作室 Vomoc Web Studio
 * http://www.vomoc.com/vmc/slider/
 * vomoc@qq.com
 * 2017/03/17
 **/
;(function ($, undefined) {
    var dataKey = 'vomoc';
    var ie6 = !-[1,] && !window.XMLHttpRequest;
    var ie9plus = true;
    var effects = {
        // 淡入淡出
        'fade': function (index) {
            var the = this,
                opts = the.options;
            the.transfer[3].fadeIn(opts.speed, function () {
                the._resetTransfer(index);
            });
        },
        // 横向滑动
        'slideX': function (index) {
            var the = this,
                opts = the.options;

            if (index > the.index) {
                // next
                the.transfer[4].show().animate({
                    left: -the.width
                }, opts.speed, function () {
                    $(this).css({
                        left: 0
                    });
                    the._resetTransfer(index);
                });
            } else {
                // the.transfer[4].append(the.transfer[4].children('.vui-slide-grid').first());

                the.transfer[4].show().css('left', -the.width).animate({
                    left: 0
                }, opts.speed, function () {
                    the._resetTransfer(index);
                    // the.transfer[4].append(the.transfer[4].children().first());
                });
            }


        },
        // 纵向滑动
        'slideY': function (index) {
            var the = this,
                opts = the.options;

            if (index > the.index) {
                // next
                the.transfer[5].show().animate({
                    top: -the.height
                }, opts.speed, function () {
                    $(this).css({
                        top: 0
                    });
                    the._resetTransfer(index);
                });
            } else {

                the.transfer[5].show().css('top', -the.height).animate({
                    top: 0
                }, opts.speed, function () {
                    the._resetTransfer(index);
                });
            }


        },
        // 翻页
        'page': function (index) {
            var the = this,
                opts = the.options;
            if (index > the.index) {
                the.transfer[0].show()
                    .children('.vui-slide-grid')
                    .css({
                        opacity: 0
                    })
                    .each(function (i) {
                        var x = i % opts.gridTdX;
                        var y = Math.floor(i / opts.gridTdX);
                        var delay = ((y + 1) / opts.gridTdY + (x + 1) / opts.gridTdX) / 2;
                        delay = opts.speed / 3 * 2 * delay;
                        $(this).delay(delay).animate({
                            opacity: 1
                        }, opts.speed / 3);
                    })
                    .last()
                    .queue(function () {
                        the._resetTransfer(index);
                    });
            } else {
                the.transfer[0]
                    .show()
                    .children('.vui-slide-grid')
                    .css({
                        opacity: 0
                    })
                    .each(function (i) {
                        var x = i % opts.gridTdX;
                        var y = Math.floor(i / opts.gridTdX);
                        var delay = 1 - (y / opts.gridTdY + x / opts.gridTdX) / 2;
                        delay = opts.speed / 3 * 2 * delay;
                        $(this).delay(delay).animate({
                            opacity: 1
                        }, opts.speed / 3);
                    })
                    .first()
                    .queue(function () {
                        the._resetTransfer(index);
                    });
            }

        },
        // 横向卷帘
        'rollingX': function (index) {
            var the = this,
                opts = the.options;
            if (index > the.index) {
                the.transfer[1].show().children('.vui-slide-grid').css({
                    opacity: 0
                }).each(function (i) {
                    var delay = opts.speed / 3 * 2 / opts.gridOdX * (i + 1);
                    $(this).delay(delay).animate({
                        opacity: 1
                    }, opts.speed / 3);
                }).last().queue(function () {
                    the._resetTransfer(index);
                });
            } else {
                the.transfer[1].show().children('.vui-slide-grid').css({
                    opacity: 0
                }).each(function (i) {
                    var delay = opts.speed / 3 * 2 / opts.gridOdX * (opts.gridOdX - i);
                    $(this).delay(delay).animate({
                        opacity: 1
                    }, opts.speed / 3);
                }).first().queue(function () {
                    the._resetTransfer(index);
                });
            }
        },
        // 纵向卷帘
        'rollingY': function (index) {
            var the = this,
                opts = the.options;
            if (index > the.index) {
                the.transfer[2].show().children('.vui-slide-grid').css({
                    opacity: 0
                }).each(function (i) {
                    var delay = opts.speed / 3 * 2 / opts.gridOdY * (i + 1);
                    $(this).delay(delay).animate({
                        opacity: 1
                    }, opts.speed / 3);
                }).last().queue(function () {
                    the._resetTransfer(index);
                });
            } else {
                the.transfer[2].show().children('.vui-slide-grid').css({
                    opacity: 0
                }).each(function (i) {
                    var delay = opts.speed / 3 * 2 / opts.gridOdY * (opts.gridOdY - i);
                    $(this).delay(delay).animate({
                        opacity: 1
                    }, opts.speed / 3);
                }).first().queue(function () {
                    the._resetTransfer(index);
                });
            }
        },
        // 横向百叶窗
        'blindsX': function (index) {
            var the = this,
                opts = the.options;
            if (index > the.index) {
                the.transfer[1].show().children().css({
                    width: 0,
                    opacity: 0
                }).each(function (i) {
                    var $this = $(this);
                    var delay = opts.speed / 3 * 2 / opts.gridOdX * (i + 1);
                    $this.delay(delay).animate({
                        width: $this.data('width'),
                        opacity: 1
                    }, opts.speed / 3);
                }).last().queue(function () {
                    the._resetTransfer(index);
                });
            } else {
                the.transfer[1].show().children().css({
                    width: 0,
                    opacity: 0
                }).each(function (i) {
                    var $this = $(this);
                    var delay = opts.speed / 3 * 2 / opts.gridOdX * (opts.gridOdX - i);
                    $this.delay(delay).animate({
                        width: $this.data('width'),
                        opacity: 1
                    }, opts.speed / 3);
                }).first().queue(function () {
                    the._resetTransfer(index);
                });
            }
        },
        // 纵向百叶窗
        'blindsY': function (index) {
            var the = this,
                opts = the.options;
            if (index > the.index) {
                the.transfer[2].show().children().css({
                    height: 0,
                    opacity: 0
                }).each(function (i) {
                    var $this = $(this);
                    var delay = opts.speed / 3 * 2 / opts.gridOdY * (i + 1);
                    $this.delay(delay).animate({
                        height: $this.data('height'),
                        opacity: 1
                    }, opts.speed / 3);
                }).last().queue(function () {
                    the._resetTransfer(index);
                });
            } else {
                the.transfer[2].show().children().css({
                    height: 0,
                    opacity: 0
                }).each(function (i) {
                    var $this = $(this);
                    var delay = opts.speed / 3 * 2 / opts.gridOdY * (opts.gridOdY - i);
                    $this.delay(delay).animate({
                        height: $this.data('height'),
                        opacity: 1
                    }, opts.speed / 3);
                }).first().queue(function () {
                    the._resetTransfer(index);
                });
            }
        }
        // 幕布
        // 交叉
    };

    $.fn.vmcSlide = function (settings) {
        var run = $.type(settings) === 'string',
            args = [].slice.call(arguments, 1);
        if (!this.length) return;
        return this.each(function () {
            var $element = $(this),
                instance = $element.data(dataKey);
            if (run && settings.charAt(0) !== '_' && instance) {
                vmcSlide.prototype[settings] && vmcSlide.prototype[settings].apply(instance, args);
            } else if (!run && !instance) {
                instance = new vmcSlide($element, settings);
                instance._init();
                $element.data(dataKey, instance);
            }
        });
    };

    $.vmcSlideEffects = function () {
        if ($.isPlainObject(arguments[0])) {
            effects = $.extend({}, effects, arguments[0]);
        } else if ($.type(arguments[0]) === 'string' && $.type(arguments[1]) === 'function') {
            effects[arguments[0]] = arguments[1];
        }
    };

    var vmcSlide = function ($element, settings) {
        var the = this;
        // 合并后的参数
        the.options = $.extend({}, the.options, settings);
        // 整个元素
        the.elem = $element;
        // 要被替换掉的原元素
        the.original = $element.children();
        // 模拟的新元素，将替换掉原元素
        the.mimic = null;
        // 过场舞台
        the.transfer = [];
        // 从原元素和data参数合并的原数据，场景数据
        the.data = [];
        // 当前显示的数据索引
        the.index = 0;
        // 当前使用的效果索引
        the.effectIndex = 0;
        // 动画播放状态
        the.animateStatus = false;
        // 幻灯片的宽度
        the.width = 0;
        // 幻灯片的高度
        the.height = 0;
        the.imgWidth = 0;
        the.imgHeight = 0;
        // 是否自动播放
        the.auto = the.options.autoPlay;
    };

    vmcSlide.prototype.options = {
        data: [],
        // 宽度 （像素）
        width: 'auto',
        // 高度 （像素）
        height: 400,
        imgWidth: 1000,
        imgHeight: 330,
        // 最小宽度
        minWidth: 0,
        // 最小高度
        minHeight: 0,
        // 二维网格x轴切割份数（列数）
        gridTdX: 10,
        // 二维网格y轴切割份数（行数）
        gridTdY: 5,
        // 一维栅格x轴切割份数（列数）
        gridOdX: 20,
        // 一维栅格y轴切割份数（行数）
        gridOdY: 10,
        // 是否显示侧边按钮
        sideButton: true,
        // 是否显示原点按钮
        navButton: true,
        // 自动播放
        autoPlay: true,
        // 图片按照升序播放
        ascending: true,
        // 使用的转场动画效果
        effects: ['fade'],
        // IE6下精简效果
        ie6Tidy: false,
        // 随机使用转场动画效果
        random: false,
        // 图片停留时长（毫秒）
        duration: 4000,
        // 转场效果时长（毫秒）
        speed: 800,
        // 翻页时触发事件
        flip: function (event, vi) {
        },
        // 创建完成触发事件
        create: function (event, vi) {
        }
    };

    vmcSlide.prototype._init = function () {
        var the = this,
            elem = the.elem,
            opts = the.options;

        // 初始化数据
        the._setSceneData();

        // 创建舞台
        the._buildStage();

        // 初始化场景
        the._setScene(the.index);

        // 初始化尺寸
        the._setSize();

        // 播放下一张
        the._next();

        the.mimic.on('click', '.vui-slide-handle-button', function () {
            the._goto($(this).index());
        });
        // 浏览器事件
        $(window).on('resize', function () {
            the._setSize();
        });
    };

    /**
     * 设置场景数据
     * @private
     */
    vmcSlide.prototype._setSceneData = function () {
        var the = this,
            opts = the.options;
        var sceneData = the.original.children().map(function () {
            var $this = $(this);
            return {
                src: $this.data('src') || $this.find('img').attr('src'),
                text: $this.data('text'),
                href: $this.data('href') || $this.find('a').attr('href'),
                target: $this.data('target') || $this.find('a').attr('target')
            };
        }).toArray();
        the.data = sceneData.concat(opts.data);
    };

    /**
     * 设置场景
     * @param index 场景索引
     * @private
     */
    vmcSlide.prototype._setScene = function (index) {
        var the = this;
        var $scene = the.mimic.children('.vui-slide-scene');
        $scene.attr('href', the.data[index].href || 'javascript:void(0);').css({
            backgroundImage: 'url(' + the.data[index].src + ')'
        });
        if (the.data[index].target) {
            $scene.attr('target', the.data[index].target);
        }
        if (!ie9plus) {
            $scene.children('img').attr('src', the.data[index].src);
        }
    };

    /**
     * 设置转场切片
     * @param index
     * @private
     */
    vmcSlide.prototype._setTransferGrid = function (index) {
        var the = this;
        the.mimic.find('.vui-slide-grid').css({
            backgroundImage: 'url(' + the.data[index].src + ')'
        });
        if (index > the.index) {
            the.transfer[4].children('.vui-slide-grid').first().css({
                backgroundImage: 'url(' + the.data[the.index].src + ')'
            });
            the.transfer[5].children('.vui-slide-grid').first().css({
                backgroundImage: 'url(' + the.data[the.index].src + ')'
            });
        } else {
            the.transfer[4].children('.vui-slide-grid').last().css({
                backgroundImage: 'url(' + the.data[the.index].src + ')'
            });
            the.transfer[5].children('.vui-slide-grid').last().css({
                backgroundImage: 'url(' + the.data[the.index].src + ')'
            });
        }

    };


    /**
     * 设置当前圆点按钮
     * @param index
     * @private
     */
    vmcSlide.prototype._setHandleButtonActive = function (index) {
        var the = this;
        the.mimic
            .find('.vui-slide-handle-button')
            .removeClass('active')
            .eq(index)
            .addClass('active');
    };

    /**
     * 创建舞台
     * @private
     */
    vmcSlide.prototype._buildStage = function () {
        var the = this;
        the._buildMimic();
        the._buildScene();
        the._buildTransfer();
        the._buildHandleButton();
        the.elem.empty().append(the.mimic);
    };

    /**
     * 创建模拟元素
     * @private
     */
    vmcSlide.prototype._buildMimic = function () {
        var the = this;
        the.mimic = $('<div>').addClass('vui-slide-mimic');
    };

    /**
     * 创建场景
     * @private
     */
    vmcSlide.prototype._buildScene = function () {
        var the = this;
        var $scene = $('<a>').addClass('vui-slide-scene');
        if (!ie9plus) {
            var $img = $('<img>');
            $scene.append($img);
        }
        the.mimic.append($scene);
    };

    /**
     * 创建过场
     * @private
     */
    vmcSlide.prototype._buildTransfer = function () {
        var the = this,
            opts = the.options;
        the.transfer = [
            // 二维
            $('<ul class="vui-slide-transfer vui-slide-transfer-xy" style="display:none;">' + the._buildTransferGrid(opts.gridTdX * opts.gridTdY) + '</ul>'),
            // 一维x方向切片
            $('<ul class="vui-slide-transfer vui-slide-transfer-x" style="display:none;">' + the._buildTransferGrid(opts.gridOdX) + '</ul>'),
            // 一维y方向切片
            $('<ul class="vui-slide-transfer vui-slide-transfer-y" style="display:none;">' + the._buildTransferGrid(opts.gridOdY) + '</ul>'),
            // 单整张
            $('<ul class="vui-slide-transfer vui-slide-transfer-a" style="display:none;">' + the._buildTransferGrid(1) + '</ul>'),
            // 2整张x方向
            $('<ul class="vui-slide-transfer vui-slide-transfer-zx" style="display:none;">' + the._buildTransferGrid(2) + '</ul>'),
            // 2整张y方向
            $('<ul class="vui-slide-transfer vui-slide-transfer-zy" style="display:none;">' + the._buildTransferGrid(2) + '</ul>')
        ];
        the.mimic.append(the.transfer);
    };

    /**
     * 创建过场网格
     * @param count
     * @returns {string}
     * @private
     */
    vmcSlide.prototype._buildTransferGrid = function (count) {
        var html = '';
        for (var i = 0; i < count; i++) {
            html += '<li class="vui-slide-grid"></li>';
        }
        return html;
    };

    /**
     * 添加圆点按钮
     * @private
     */
    vmcSlide.prototype._buildHandleButton = function () {
        var the = this;
        var html = '';
        for (var i = 0; i < the.data.length; i++) {
            html += '<li class="vui-slide-handle-button"></li>';
        }
        html = '<ul class="vui-slide-handle-buttons">' + html + '</ul>';
        the.mimic.append(html);

    };

    /**
     * 设置舞台尺寸
     * @private
     */
    vmcSlide.prototype._setSize = function () {
        var the = this,
            $elem = the.elem,
            opts = the.options;

        // 定义显示范围长宽
        the.width = opts.width === 'auto' ? $elem.width() : opts.width;
        the.height = opts.height === 'auto' ? $elem.height() : opts.height;

        // 保持长宽最小值
        the.width = the.width < opts.minWidth ? opts.minWidth : the.width;
        the.height = the.height < opts.minHeight ? opts.minHeight : the.height;

        // 定义默认图片长宽
        the.imgWidth = opts.imgWidth <= 0 ? the.width : opts.imgWidth;
        the.imgHeight = opts.imgHeight <= 0 ? the.height : opts.imgHeight;

        // 定义图片显示尺寸和图片位置
        var imgHeight, imgWidth, imgTop, imgLeft;
        if (the.imgWidth / the.imgHeight > the.width / the.height) {
            // 图片高是短边
            imgHeight = the.height;
            imgWidth = Math.round(imgHeight * the.imgWidth / the.imgHeight);
            imgLeft = Math.round((imgWidth - the.width) / 2);
            imgTop = 0;
        } else {
            // 图片宽度是短边
            imgWidth = the.width;
            imgHeight = Math.round(imgWidth * the.imgHeight / the.imgWidth);
            imgTop = Math.round((imgHeight - the.height) / 2);
            imgLeft = 0;
        }

        // 如果长宽不是自动获取，则设置最外层元素尺寸
        opts.width === 'auto' || $elem.width(the.width);
        opts.height === 'auto' || $elem.height(the.height);

        // 设置模拟元素尺寸
        the.mimic.height(the.height).width(the.width);

        // 设置舞台背景图尺寸和位置
        the.mimic.children('.vui-slide-scene').height(the.height).width(the.width).css({
            backgroundSize: imgWidth + 'px ' + imgHeight + 'px',
            backgroundPosition: '-' + imgLeft + 'px -' + imgTop + 'px'
        });


        // 设置二维转场切片位置尺寸
        var xyHeight = Math.round(the.height / opts.gridTdY);
        var xyWidth = Math.round(the.width / opts.gridTdX);
        var lastXyHeight = the.height - xyHeight * (opts.gridTdY - 1);
        var lastXyWidth = the.width - xyWidth * (opts.gridTdX - 1);
        the.transfer[0].children('.vui-slide-grid').each(function () {
            var index = $(this).index();
            var width = (index + 1) % opts.gridTdX === 0 ? lastXyWidth : xyWidth;
            var height = index >= (opts.gridTdY - 1) * opts.gridTdX ? lastXyHeight : xyHeight;
            var top = xyHeight * Math.floor(index / opts.gridTdX);
            var left = xyWidth * (index % opts.gridTdX);
            $(this).height(height).width(width).data({width: width, height: height}).css({
                top: top,
                left: left,
                backgroundSize: imgWidth + 'px ' + imgHeight + 'px',
                backgroundPosition: '-' + (imgLeft + left) + 'px -' + (imgTop + top) + 'px'
            });
        });

        // 设置一维转场X轴切片位置尺寸
        var xWidth = Math.round(the.width / opts.gridOdX);
        var lastXWidth = the.width - xWidth * (opts.gridOdX - 1);
        the.transfer[1].children('.vui-slide-grid').each(function () {
            var index = $(this).index();
            var width = index >= opts.gridOdX - 1 ? lastXWidth : xWidth;
            var height = the.height;
            var top = 0;
            var left = xWidth * index;
            $(this).height(height).width(width).data({width: width, height: height}).css({
                top: top,
                left: left,
                backgroundSize: imgWidth + 'px ' + imgHeight + "px",
                backgroundPosition: '-' + (imgLeft + left) + 'px -' + (imgTop + top) + 'px'
            });
        });

        // 设置一维转场Y轴切片位置尺寸
        var yHeight = Math.round(the.height / opts.gridOdY);
        var lastYHeight = the.height - yHeight * (opts.gridOdY - 1);
        the.transfer[2].children('.vui-slide-grid').each(function () {
            var index = $(this).index();
            var width = the.width;
            var height = index >= opts.gridOdY - 1 ? lastYHeight : yHeight;
            var top = yHeight * index;
            var left = 0;
            $(this).height(height).width(width).data({width: width, height: height}).css({
                top: top,
                left: left,
                backgroundSize: imgWidth + 'px ' + imgHeight + "px",
                backgroundPosition: '-' + (imgLeft + left) + 'px -' + (imgTop + top) + 'px'
            });
        });

        the.transfer[3].children('.vui-slide-grid').height(the.height).width(the.width).css({
            top: 0,
            left: 0,
            backgroundSize: imgWidth + 'px ' + imgHeight + "px",
            backgroundPosition: '-' + imgLeft + 'px -' + imgTop + 'px'
        });
        the.transfer[4]
            .width(the.width * 2)
            .children('.vui-slide-grid')
            .each(function (index) {
                var left = index * the.width;
                $(this)
                    .height(the.height)
                    .width(the.width)
                    .css({
                        top: 0,
                        left: left,
                        backgroundSize: imgWidth + 'px ' + imgHeight + "px",
                        backgroundPosition: '-' + imgLeft + 'px -' + imgTop + 'px'
                    });
            });
        the.transfer[5]
            .height(the.height * 2)
            .children('.vui-slide-grid')
            .each(function (index) {
                var top = index * the.height;
                $(this)
                    .height(the.height)
                    .width(the.width)
                    .css({
                        top: top,
                        left: 0,
                        backgroundSize: imgWidth + 'px ' + imgHeight + "px",
                        backgroundPosition: '-' + imgLeft + 'px -' + imgTop + 'px'
                    });
            });

    };

    /**
     * 下一张
     * @private
     */
    vmcSlide.prototype._next = function () {
        var the = this;
        var index = the.index + 1;
        index = index >= the.data.length ? 0 : index;
        the._play(index);
    };

    /**
     * 上一张
     * @private
     */
    vmcSlide.prototype._prev = function () {
        var the = this;
        var index = the.index - 1;
        index = index < 0 ? the.data.length - 1 : index;
        the._play(index);
    };

    /**
     * 跳转到指定张
     * @param index 跳转目标图片索引
     * @private
     */
    vmcSlide.prototype._goto = function (index) {
        var the = this;
        index = index > the.data.length - 1 ? the.data.length - 1 : index;
        index = index < 0 ? 0 : index;
        if (index - the.index == 0) {
            return;
        }
        the._play(index);
    };

    /**
     * 播放
     * @param index
     * @private
     */
    vmcSlide.prototype._play = function (index) {
        var the = this,
            opts = the.options;


        if (!the.animateStatus && the.data.length > 1) {
            the.animateStatus = true;

            // 设置当前园标
            the._setHandleButtonActive(index);

            // 设置说明文本
            // the._setSummary(index);

            // 设置转场切片
            the._setTransferGrid(index);

            effects['blindsY'].call(the, [index]);
        }
    };

    /**
     * 转场结束
     * @param index
     * @private
     */
    vmcSlide.prototype._resetTransfer = function (index) {
        var the = this;
        the.index = index;
        the._setScene(index);
        the.mimic.find('.vui-slide-grid').clearQueue();
        the.mimic.children('.vui-slide-transfer').hide();
        the.animateStatus = false;
    };
})(jQuery);