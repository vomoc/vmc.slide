/**
 * VmcSlider 图片轮播插件 v1.1.0
 * 维米客网页工作室 Vomoc Web Studio
 * http://www.vomoc.com/vmc/slider/
 * vomoc@qq.com
 * 2015/11/14
 **/
;
(function($, undefined) {
    var dataKey = 'vomoc';
    var ie6 = !-[1, ] && !window.XMLHttpRequest;
    var effects = {
        'fade': function() {
            var the = this,
                elem = the.elem,
                opts = the.options;
            elem.find('.vui-item').eq(the.index).css({
                display: 'none',
                zIndex: 2
            }).fadeIn(opts.speed, function() {
                the._afterTransfer();
            });
        }
    };
    //**************************************************************************************************************
    // 图片轮播插件
    $.fn.vmcSlider = function(settings) {
        var run = $.type(settings) === 'string',
            args = [].slice.call(arguments, 1);
        if (!this.length) return;
        return this.each(function() {
            var $element = $(this),
                instance = $element.data(dataKey);
            if (run && settings.charAt(0) !== '_' && instance) {
                vmcSlider.prototype[settings] && vmcSlider.prototype[settings].apply(instance, args);
            } else if (!run && !instance) {
                instance = new vmcSlider($element, settings);
                instance._init();
                $element.data(dataKey, instance);
            }
        });
    };
    //**************************************************************************************************************
    // 效果插件
    $.vmcSliderEffects = function() {
        if ($.isPlainObject(arguments[0])) {
            effects = $.extend({}, effects, arguments[0]);
        } else if ($.type(arguments[0]) === 'string' && $.type(arguments[1]) === 'function') {
            effects[arguments[0]] = arguments[1];
        }
    };
    //**************************************************************************************************************
    // 构造函数
    var vmcSlider = function($element, settings) {
        var the = this;
        the.options = $.extend({}, the.options, settings);
        the.elem = $element;
        the.index = 0;
        the.effectIndex = 0;
        the.animateStatus = false;
    };
    //**************************************************************************************************************
    // 配置参数
    vmcSlider.prototype.options = {
        // 宽度 （像素）
        width: 1000,
        // 高度 （像素）
        height: 330,
        // 网格列数
        gridCol: 10,
        // 网格行数
        gridRow: 5,
        // 栅格列数
        gridVertical: 20,
        // 栅格行数
        gridHorizontal: 10,
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
        speed: 900,
        // 翻页时触发事件
        flip: function(event, vi) {},
        // 创建完成触发事件
        create: function(event, vi) {}
    };
    //**************************************************************************************************************
    // 设置配置参数
    vmcSlider.prototype.option = function(name, value) {
        var the = this,
            opts = the.options;
        opts[name] = value;
        if ($.inArray(name, ['width', 'height']) > 0) {
            the._setSize();
        }
        if ($.inArray(name, ['width', 'height', 'gridCol', 'gridRow', 'gridVertical', 'gridHorizontal']) > 0) {
            the._buildStage();
        }
    };
    //**************************************************************************************************************
    // 初始化
    vmcSlider.prototype._init = function() {
        var the = this,
            elem = the.elem,
            opts = the.options;
        // 创建dom
        the._create();
        // 创建过场舞台
        the._buildStage();
        // 设置尺寸
        the._setSize();
        // 绑定事件
        the._bind();
        // 初始化图片
        elem.find('.vui-item').eq(the.index).show();
        // 初始化按钮
        elem.find('.vui-button').eq(the.index).addClass('vui-button-cur');
        // 触发创建事件
        elem.trigger('vmcslidercreate', the);
        // 自动播放
        if (true === opts.autoPlay) {
            $(window).on('load', function() {
                the.time = setTimeout(function() {
                    if (true === opts.ascending) {
                        the._next();
                    } else {
                        the._prev();
                    }
                }, opts.duration);
            });
        }
    };
    //**************************************************************************************************************
    // 创建slider
    vmcSlider.prototype._create = function() {
        var the = this,
            elem = the.elem,
            sliderHtml = '',
            itemHtml = '',
            buttonHtml = '';
        elem.children().each(function() {
            itemHtml += '<div class="vui-item">' + $(this).html() + '</div>';
            buttonHtml += '<div class="vui-button"></div>';
        });
        sliderHtml += '<div class="vui-slider">';
        sliderHtml += '<div class ="vui-items">' + itemHtml + '</div>';
        sliderHtml += '<div class="vui-buttons">' + buttonHtml + '</div>';
        sliderHtml += '<div class="vui-prev"></div>';
        sliderHtml += '<div class="vui-next"></div>';
        sliderHtml += '<div class="vui-transfer"></div>';
        sliderHtml += '</div>';
        elem.html(sliderHtml);
    };
    //**************************************************************************************************************
    // 创建舞台html
    vmcSlider.prototype._buildStage = function() {
        var the = this,
            opts = the.options,
            gridWidth, gridHeight;
        the.stageHtml = ['', '', ''];
        gridWidth = opts.width / opts.gridCol;
        gridHeight = opts.height / opts.gridRow;
        for (var i = 0; i < opts.gridCol * opts.gridRow; i++) {
            var top = gridHeight * Math.floor(i / opts.gridCol);
            var left = gridWidth * (i % opts.gridCol);
            the.stageHtml[0] += '<div style="position:absolute;top:' + top + 'px;left:' + left + 'px;';
            the.stageHtml[0] += 'width:' + gridWidth + 'px;height:' + gridHeight + 'px;background-position:-' + left + 'px -' + top + 'px;"></div>';
        }
        gridHeight = opts.height / opts.gridHorizontal;
        for (var i = 0; i < opts.gridHorizontal; i++) {
            the.stageHtml[1] += '<div style="position:absolute;top:' + (gridHeight * i) + 'px;left:0;';
            the.stageHtml[1] += 'width:' + opts.width + 'px;height:' + gridHeight + 'px;background-position:0 -' + (gridHeight * i) + 'px;"></div>';
        }
        gridWidth = opts.width / opts.gridVertical;
        for (var i = 0; i < opts.gridVertical; i++) {
            the.stageHtml[2] += '<div style="position:absolute;top:0;left:' + (gridWidth * i) + 'px;';
            the.stageHtml[2] += 'width:' + gridWidth + 'px;height:' + opts.height + 'px;background-position:-' + (gridWidth * i) + 'px 0;"></div>';
        }
    };
    //**************************************************************************************************************
    // 设置尺寸
    vmcSlider.prototype._setSize = function() {
        var the = this,
            elem = the.elem,
            opts = the.options;
        elem.find('.vui-slider').width(opts.width).height(opts.height);
        elem.find('.vui-buttons').css({
            left: (opts.width - elem.find('.vui-buttons').width()) / 2
        });
    };
    //**************************************************************************************************************
    // 绑定事件
    vmcSlider.prototype._bind = function() {
        var the = this,
            elem = the.elem,
            opts = the.options;
        elem.on('mouseover', '.vui-prev,.vui-next', function() {
            $(this).addClass('vui-sidebutton-hover');
        }).on('mouseout', '.vui-prev,.vui-next', function() {
            $(this).removeClass('vui-sidebutton-hover');
        }).on('click', '.vui-prev,.vui-next,.vui-button', function() {
            if (false === the.animateStatus) {
                clearTimeout(the.time);
                if ($(this).hasClass('vui-next')) {
                    the._next();
                } else if ($(this).hasClass('vui-prev')) {
                    the._prev();
                } else if ($(this).hasClass('vui-button')) {
                    the.index = $(this).index();
                    the._play();
                }
            }
        }).on('vmcsliderflip', function(e) {
            opts.flip.call(elem[0], e, the);
        }).on('vmcslidercreate', function(e) {
            opts.create.call(elem[0], e, the);
        });
    };
    //**************************************************************************************************************
    // 播放
    vmcSlider.prototype._play = function() {
        var the = this,
            elem = the.elem,
            opts = the.options;
        // 圆点按钮样式
        elem.find('.vui-button').eq(the.index).addClass('vui-button-cur').siblings().removeClass('vui-button-cur');
        // 触发翻页事件
        elem.trigger('vmcsliderflip', the);
        // 翻页
        if (opts.effects.length) {
            the.animateStatus = true;
            elem.find('.vui-transfer').children().stop(true);
            effects[the._getEffect()].call(the);
        } else {
            // 无过场效果
            the._afterTransfer();
        }
    };
    //**************************************************************************************************************
    // 转场效果结束
    vmcSlider.prototype._afterTransfer = function() {
        var the = this,
            elem = the.elem,
            opts = the.options;
        elem.find('.vui-transfer').hide();
        elem.find('.vui-item').css('zIndex', 1).eq(the.index).show().siblings().hide();
        the.animateStatus = false;
        // 下一次
        if (true === opts.autoPlay) {
            the.time = setTimeout(function() {
                if (true === opts.ascending) {
                    the._next();
                } else {
                    the._prev();
                }
            }, opts.duration);
        }
    };
    //**************************************************************************************************************
    // 设置舞台
    vmcSlider.prototype._setStage = function(stage) {
        var the = this,
            elem = the.elem;
        the.url = elem.find('.vui-item').eq(the.index).find('img')[0].src;
        elem.find('.vui-transfer').html(the.stageHtml[stage]).show().children().css({
            backgroundImage: 'url(' + the.url + ')'
        });
    };
    //**************************************************************************************************************
    // 上一张
    vmcSlider.prototype._prev = function() {
        var the = this,
            elem = the.elem;
        the.index--;
        if (the.index < 0) {
            the.index = elem.find('.vui-item').length - 1;
        }
        the._play();
    };
    //**************************************************************************************************************
    // 下一张
    vmcSlider.prototype._next = function() {
        var the = this,
            elem = the.elem;
        the.index++;
        if (the.index >= elem.find('.vui-item').length) {
            the.index = 0;
        }
        the._play();
    };
    //**************************************************************************************************************
    // 获取转场效果名称
    vmcSlider.prototype._getEffect = function() {
        var the = this,
            opts = the.options;
        if (ie6 && opts.ie6Tidy) {
            return 'fade';
        } else {
            var i = the.effectIndex;
            if (opts.random === true) {
                the.effectIndex = Math.floor(opts.effects.length * Math.random());
            } else {
                the.effectIndex++;
            }
            if (the.effectIndex >= opts.effects.length) {
                the.effectIndex = 0;
            }
            i = i >= opts.effects.length ? 0 : i;
            return opts.effects[i];
        }
    };
    //**************************************************************************************************************
})(jQuery);
