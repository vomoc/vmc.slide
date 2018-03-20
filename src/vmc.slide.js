/**
 * VmcSlide 图片轮播插件 v2.0.0
 * 维米客网页工作室 Vomoc Web Studio
 * http://www.vomoc.com/vmc/slide/
 * vomoc@qq.com
 * 2017/03/17
 **/
;(function ($, undefined) {
    var dataKey = 'vomoc';
    var ie6 = !-[1,] && !window.XMLHttpRequest;
    var ie9plus = navigator.appName !== 'Microsoft Internet Explorer' || parseInt(navigator.appVersion.split(';')[1].replace(/[ ]/g, '').replace('MSIE', '')) >= 9;
    var effects = {
        // 默认转场效果，淡入淡出，兼容低版本IE
        'fade': function (index) {
            var the = this,
                opts = the.options;
            the.transfer[3].fadeIn(opts.speed, function () {
                the._resetTransfer(index);
            });
        }
    };

    /**
     * 轮播图插件
     * @param settings
     * @returns {*}
     */
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

    /**
     * 注册转场效果
     */
    $.vmcSlideEffects = function () {
        if ($.isPlainObject(arguments[0])) {
            effects = $.extend({}, effects, arguments[0]);
        } else if ($.type(arguments[0]) === 'string' && $.type(arguments[1]) === 'function') {
            effects[arguments[0]] = arguments[1];
        }
    };

    /**
     * 构造函数
     * @param $element dom元素
     * @param settings 选项
     */
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
        // 轮播图宽度
        the.width = 0;
        // 轮播图高度
        the.height = 0;
        // 图片宽度
        the.imgWidth = 0;
        // 图片高度
        the.imgHeight = 0;
        // 是否自动播放
        the.auto = the.options.autoPlay;
        // 计时器
        the.timer = null;
    };

    // 默认选项
    vmcSlide.prototype.options = {
        // 场景数据
        data: [],
        // 宽度 （像素）
        width: 'auto',
        // 高度 （像素）
        height: 'auto',
        // 图片宽度 为0时同width
        imgWidth: 0,
        // 图片高度 为0时同height
        imgHeight: 0,
        // 最小宽度
        minWidth: 0,
        // 最小高度
        minHeight: 0,
        // 二维网格x轴切割份数（列数）
        gridTdX: 10,
        // 二维网格y轴切割份数（行数）
        gridTdY: 5,
        // 一维栅格x轴切割份数（列数）
        gridOdX: 30,
        // 一维栅格y轴切割份数（行数）
        gridOdY: 10,
        // 是否显示侧边按钮
        sideButton: true,
        // 是否显示导航按钮
        navButton: true,
        // 是否显示文本
        showText: 'auto',
        // 文本信息是否是HTML
        isHtml: false,
        // 自动播放
        autoPlay: true,
        // 图片按照升序播放
        ascending: true,
        // 转场动画效果
        effects: ['fade'],
        // IE6下精简效果
        ie6Tidy: false,
        // 随机使用转场动画效果
        random: true,
        // 图片停留时长（毫秒）
        duration: 4000,
        // 转场效果时长（毫秒）
        speed: 800,
        // 鼠标悬停则停止播放
        hoverStop: true,
        // 翻页回调
        flip: function (fromIndex, toIndex) {
        },
        // 创建完成回调
        created: function () {
        }
    };

    /**
     * 设置选项
     * @param name
     * @param value
     */
    vmcSlide.prototype.option = function (name, value) {
        var the = this,
            opts = the.options;
        opts[name] = value;

        if ($.inArray(name, ['data', 'gridTdX', 'gridTdY', 'gridOdX', 'gridOdY', 'sideButton', 'navButton']) > 0) {
            the._buildStage();
        }
        if ($.inArray(name, ['data', 'gridTdX', 'gridTdY', 'gridOdX', 'gridOdY', 'sideButton', 'navButton', 'width', 'height', 'imgWidth', 'imgHeight', 'minWidth', 'minHeight',]) > 0) {
            the._setSize();
        }

        switch (name) {
            case 'autoPlay':
                the.auto = value;
                break;
        }
    };

    /**
     * 初始化
     * @private
     */
    vmcSlide.prototype._init = function () {
        var the = this,
            opts = the.options;

        // 初始化数据
        the._setSceneData();

        // 创建舞台
        the._buildStage();

        // 初始化尺寸
        the._setSize();

        // 初始化场景
        the._resetTransfer(the.index);

        // 创建完成回调
        opts.created.call(the);

        // 事件
        the.mimic
            .on('click', '.vui-slide-handle-button', function () {
                // 圆点按钮
                the._goto($(this).index());
            })
            .on('click', '.vui-slide-side-button', function () {
                // 侧边按钮
                if ($(this).hasClass('next')) {
                    the._next();
                } else {
                    the._prev();
                }
            })
            .on('mouseenter', function () {
                // 鼠标进入停止自动播放
                the.mimic.find('.vui-slide-side-buttons').children().addClass('hover');
                if (opts.hoverStop) {
                    clearTimeout(the.timer);
                    the.auto = false;
                }
            })
            .on('mouseleave', function () {
                the.mimic.find('.vui-slide-side-buttons').children().removeClass('hover');
                if (opts.hoverStop) {
                    the.auto = the.options.autoPlay;
                    if (!the.animateStatus) {
                        the._resetTransfer(the.index);
                    }
                }
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
     * 设置转场切片图片
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
        if (!ie9plus) {
            the.transfer[3].children().find('img').attr('src', the.data[index].src);
            the.transfer[4].children().find('img').attr('src', the.data[index].src);
            the.transfer[5].children().find('img').attr('src', the.data[index].src);
        }
    };

    /**
     * 设置当前导航按钮
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
     * 设置文本
     * @param index
     * @private
     */
    vmcSlide.prototype._setText = function (index) {
        var the = this,
            opts = the.options;
        var text = the.data[index].text || '';
        var isShow = $.type(opts.showText) === 'boolean' ? opts.showText : !!text;
        var $text = the.mimic.children('.vui-slide-text');

        if (opts.isHtml) {
            $text.html(text);
        } else {
            $text.html($('<div>').addClass('text').text(text));
        }

        the.mimic
            .children('.vui-slide-mask,.vui-slide-text')
            .toggle(isShow);
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
        the._buildSideButton();
        the._buildText();
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
            $scene.append('<img>');
        }
        the.mimic.append($scene);
    };

    /**
     * 创建转场舞台
     * @private
     */
    vmcSlide.prototype._buildTransfer = function () {
        var the = this,
            opts = the.options;
        the.transfer = [
            // 二维
            $('<ul class="vui-slide-transfer" style="display:none;">' + the._buildTransferGrid(opts.gridTdX * opts.gridTdY) + '</ul>'),
            // 一维x方向切片
            $('<ul class="vui-slide-transfer" style="display:none;">' + the._buildTransferGrid(opts.gridOdX) + '</ul>'),
            // 一维y方向切片
            $('<ul class="vui-slide-transfer" style="display:none;">' + the._buildTransferGrid(opts.gridOdY) + '</ul>'),
            // 单整张
            $('<ul class="vui-slide-transfer" style="display:none;">' + the._buildTransferGrid(1) + '</ul>'),
            // 2整张x方向
            $('<ul class="vui-slide-transfer" style="display:none;">' + the._buildTransferGrid(2) + '</ul>'),
            // 2整张y方向
            $('<ul class="vui-slide-transfer" style="display:none;">' + the._buildTransferGrid(2) + '</ul>')
        ];
        if (!ie9plus) {
            the.transfer[3].children().append('<img>');
            the.transfer[4].children().append('<img>');
            the.transfer[5].children().append('<img>');
        }
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
     * 创建导航按钮
     * @private
     */
    vmcSlide.prototype._buildHandleButton = function () {
        var the = this,
            opts = the.options;
        if (opts.navButton) {
            var html = '';
            for (var i = 0; i < the.data.length; i++) {
                html += '<li class="vui-slide-handle-button"></li>';
            }
            html = '<ul class="vui-slide-handle-buttons">' + html + '</ul>';
            the.mimic.append(html);
        }
    };

    /**
     * 创建侧边按钮
     * @private
     */
    vmcSlide.prototype._buildSideButton = function () {
        var the = this,
            opts = the.options;
        if (opts.sideButton) {
            var html = '<div class="vui-slide-side-buttons">' +
                '<div class="vui-slide-side-button prev"></div>' +
                '<div class="vui-slide-side-button next"></div>' +
                '</div>';
            the.mimic.append(html);
        }
    };

    /**
     * 创建文本
     * @private
     */
    vmcSlide.prototype._buildText = function () {
        var the = this;
        var $textMask = $('<div class="vui-slide-mask" style="display:none;"></div>');
        var $text = $('<div class="vui-slide-text" style="display:none;"></div>');
        the.mimic
            .append($textMask)
            .append($text);
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
        the.transfer[0].children('.vui-slide-grid').each(function (index) {
            var width = (index + 1) % opts.gridTdX === 0 ? lastXyWidth : xyWidth;
            var height = index >= (opts.gridTdY - 1) * opts.gridTdX ? lastXyHeight : xyHeight;
            var top = xyHeight * Math.floor(index / opts.gridTdX);
            var left = xyWidth * (index % opts.gridTdX);
            $(this)
                .height(height)
                .width(width)
                .data({
                    width: width,
                    height: height,
                    left: left,
                    top: top,
                    imgLeft: imgLeft + left,
                    imgTop: imgTop + top
                })
                .css({
                    top: top,
                    left: left,
                    backgroundSize: imgWidth + 'px ' + imgHeight + 'px',
                    backgroundPosition: '-' + (imgLeft + left) + 'px -' + (imgTop + top) + 'px'
                });
        });

        // 设置一维转场X轴切片位置尺寸
        var xWidth = Math.round(the.width / opts.gridOdX);
        var lastXWidth = the.width - xWidth * (opts.gridOdX - 1);
        the.transfer[1].children('.vui-slide-grid').each(function (index) {
            var width = index >= opts.gridOdX - 1 ? lastXWidth : xWidth;
            var height = the.height;
            var top = 0;
            var left = xWidth * index;
            $(this)
                .height(height)
                .width(width)
                .data({
                    width: width,
                    height: height,
                    left: left,
                    top: top,
                    imgLeft: imgLeft + left,
                    imgTop: imgTop + top
                })
                .css({
                    top: top,
                    left: left,
                    backgroundSize: imgWidth + 'px ' + imgHeight + "px",
                    backgroundPosition: '-' + (imgLeft + left) + 'px -' + (imgTop + top) + 'px'
                });
        });

        // 设置一维转场Y轴切片位置尺寸
        var yHeight = Math.round(the.height / opts.gridOdY);
        var lastYHeight = the.height - yHeight * (opts.gridOdY - 1);
        the.transfer[2].children('.vui-slide-grid').each(function (index) {
            var width = the.width;
            var height = index >= opts.gridOdY - 1 ? lastYHeight : yHeight;
            var top = yHeight * index;
            var left = 0;
            $(this)
                .height(height)
                .width(width)
                .data({
                    width: width,
                    height: height,
                    left: left,
                    top: top,
                    imgLeft: imgLeft + left,
                    imgTop: imgTop + top
                })
                .css({
                    top: top,
                    left: left,
                    backgroundSize: imgWidth + 'px ' + imgHeight + "px",
                    backgroundPosition: '-' + (imgLeft + left) + 'px -' + (imgTop + top) + 'px'
                });
        });

        // 单张场景
        the.transfer[3].children('.vui-slide-grid')
            .height(the.height)
            .width(the.width)
            .data({
                width: the.width,
                height: the.height,
                left: 0,
                top: 0,
                imgLeft: imgLeft,
                imgTop: imgTop
            })
            .css({
                top: 0,
                left: 0,
                backgroundSize: imgWidth + 'px ' + imgHeight + "px",
                backgroundPosition: '-' + imgLeft + 'px -' + imgTop + 'px'
            });

        // 横向两张场景
        the.transfer[4]
            .width(the.width * 2)
            .children('.vui-slide-grid')
            .each(function (index) {
                var left = index * the.width;
                $(this)
                    .height(the.height)
                    .width(the.width)
                    .data({
                        width: the.width,
                        height: the.height,
                        left: left,
                        top: 0,
                        imgLeft: imgLeft,
                        imgTop: imgTop
                    })
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
                    .data({
                        width: the.width,
                        height: the.height,
                        left: 0,
                        top: top,
                        imgLeft: imgLeft,
                        imgTop: imgTop
                    })
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
        if (index - the.index === 0) {
            return;
        }
        the._play(index);
    };

    /**
     * 播放
     * @param index 目标场景索引
     * @private
     */
    vmcSlide.prototype._play = function (index) {
        var the = this,
            opts = the.options;

        clearTimeout(the.timer);

        if (!the.animateStatus && the.data.length > 1) {
            the.animateStatus = true;

            // 设置当前园标
            the._setHandleButtonActive(index);

            // 设置说明文本
            the._setText(index);

            // 设置转场切片
            the._setTransferGrid(index);

            // 翻页回调
            opts.flip.call(the, the.index, index);

            // 调用转场效果
            effects[the._getEffect()].call(the, index);
        }
    };

    /**
     * 重置转场
     * @param index 目标场景索引
     * @private
     */
    vmcSlide.prototype._resetTransfer = function (index) {
        var the = this,
            opts = the.options;

        the._setScene(index);
        the._setHandleButtonActive(index);
        the._setText(index);
        the.mimic.find('.vui-slide-grid').clearQueue();
        the.mimic.children('.vui-slide-transfer').hide();
        the.index = index;
        the.animateStatus = false;

        if (the.auto) {
            the.timer = setTimeout(function () {
                if (opts.ascending) {
                    the._next();
                } else {
                    the._prev();
                }
            }, opts.duration);
        }
    };

    /**
     * 获取转场效果名称
     * 如果浏览器是IE6，并开启IE6精简模式，则一定返回fade
     * 如果浏览器是IE，版本低于9，并且图片尺寸与显示尺寸不一致时，返回fade
     * @returns {string}
     * @private
     */
    vmcSlide.prototype._getEffect = function () {
        var the = this,
            opts = the.options,
            ie6Tidy = ie6 && opts.ie6Tidy,
            ie9Tidy = !ie9plus && (the.width - opts.imgWidth !== 0 || the.height - opts.imgHeight !== 0);
        if (ie6Tidy || ie9Tidy) {
            return 'fade';
        } else {
            if (opts.random) {
                the.effectIndex = Math.floor(opts.effects.length * Math.random());
            } else {
                the.effectIndex++;
            }
            if (the.effectIndex >= opts.effects.length) {
                the.effectIndex = 0;
            }
            return opts.effects[the.effectIndex];
        }
    };
})(jQuery);