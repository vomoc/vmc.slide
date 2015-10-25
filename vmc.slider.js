/**
 * Vmc Slider v1.0.0 图片轮播插件
 * 维米客网页工作室
 * http://www.vomoc.com/vmc/slider/
 * vomoc@qq.com
 * 2015/06/29
 **/
;
(function($, undefined) {
	var dataKey = 'vomoc';
	var ie6 = !-[1, ] && !window.XMLHttpRequest;
	var effects = {
		'fade': function() {
			var the = this,
				node = the.node,
				opts = the.options;
			node.item.eq(the.index).css({
				display: 'none',
				zIndex: 2
			}).fadeIn(opts.speed, function() {
				the._afterTransfer();
			});
		}
	};
	//**************************************************************************************************************
	// 插件
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
		} else {
			effects[arguments[0]] = arguments[1];
		}
	};
	//**************************************************************************************************************
	// 构造函数
	var vmcSlider = function($element, settings) {
		var the = this;
		the.options = $.extend({}, the.options, settings);
		the.node = {
			elem: $element
		};
		the.index = 0;
		the.effectIndex = 0;
		the.animateStatus = false;
	};
	//**************************************************************************************************************
	// 配置参数
	vmcSlider.prototype.options = {
		width: 1000,
		height: 330,
		gridCol: 10,
		gridRow: 5,
		gridVertical: 20,
		gridHorizontal: 10,
		autoPlay: true,
		ascending: true,
		effects: ['fade'],
		ie6Tidy: false,
		random: false,
		duration: 4000,
		speed: 900
	};
	//**************************************************************************************************************
	// 初始化
	vmcSlider.prototype._init = function() {
		var the = this,
			node = the.node,
			opts = the.options;
		the._create();
		the._setSize();
		the._bind();
		node.item.eq(the.index).show();
		node.button.eq(the.index).addClass('vui-button-cur');
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
	// 创建
	vmcSlider.prototype._create = function() {
		var the = this,
			node = the.node,
			opts = the.options,
			gridWidth, gridHeight;
		node.mimic = $('<div class="vui-slider"></div>');
		node.items = $('<div class="vui-items"></div>').appendTo(node.mimic);
		node.buttons = $('<div class="vui-buttons"></div>').appendTo(node.mimic);
		node.prev = $('<div class="vui-prev"></div>').appendTo(node.mimic);
		node.next = $('<div class="vui-next"></div>').appendTo(node.mimic);
		node.transfer = $('<div class="vui-transfer"></div>').appendTo(node.mimic);
		node.elem.children().each(function() {
			$('<div class="vui-item"></div>').append($(this)).appendTo(node.items);
			$('<div class="vui-button"></div>').appendTo(node.buttons);
		});
		node.item = node.items.children();
		node.button = node.buttons.children();
		node.elem.replaceWith(node.mimic);
		// 创建舞台
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
			node = the.node,
			opts = the.options;
		node.mimic.width(opts.width).height(opts.height);
		node.buttons.css({
			left: (opts.width - node.buttons.width()) / 2
		});
	};
	//**************************************************************************************************************
	// 绑定事件
	vmcSlider.prototype._bind = function() {
		var the = this,
			node = the.node;
		node.button.on('click', function() {
			if (false === the.animateStatus) {
				clearTimeout(the.time);
				the.index = $(this).index();
				the._play();
			}
		});
		node.prev.add(node.next).hover(function() {
			$(this).addClass('vui-sidebutton-hover');
		}, function() {
			$(this).removeClass('vui-sidebutton-hover');
		}).on('click', function() {
			if (false === the.animateStatus) {
				clearTimeout(the.time);
				if ($(this).hasClass('vui-next')) {
					the._next();
				} else {
					the._prev();
				}
			}
		});
	};
	//**************************************************************************************************************
	// 播放
	vmcSlider.prototype._play = function() {
		var the = this,
			node = the.node,
			opts = the.options;
		node.button.eq(the.index).addClass('vui-button-cur').siblings().removeClass('vui-button-cur');
		if (opts.effects.length) {
			the.animateStatus = true;
			node.transfer.children().stop(true);
			effects[the._getEffect()].call(the);
		} else {
			the._afterTransfer();
		}
	};
	//**************************************************************************************************************
	// 转场效果结束
	vmcSlider.prototype._afterTransfer = function() {
		var the = this,
			node = the.node,
			opts = the.options;
		node.transfer.hide();
		node.item.css('zIndex', 1).eq(the.index).show().siblings().hide();
		the.animateStatus = false;
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
			node = the.node;
		the.url = node.item.eq(the.index).find('img')[0].src;
		node.transfer.html(the.stageHtml[stage]).show().children().css({
			backgroundImage: 'url(' + the.url + ')'
		});
	};
	//**************************************************************************************************************
	// 上一张
	vmcSlider.prototype._prev = function() {
		var the = this,
			node = the.node;
		the.index--;
		if (the.index < 0) {
			the.index = node.item.length - 1;
		}
		the._play();
	};
	//**************************************************************************************************************
	// 下一张
	vmcSlider.prototype._next = function() {
		var the = this,
			node = the.node;
		the.index++;
		if (the.index >= node.item.length) {
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
			var i = 0;
			if (opts.random === true) {
				i = Math.floor(opts.effects.length * Math.random());
			} else {
				i = the.effectIndex;
				the.effectIndex++;
				if (the.effectIndex >= opts.effects.length) {
					the.effectIndex = 0;
				}
			}
			return opts.effects[i];
		}
	};
	//**************************************************************************************************************
})(jQuery);