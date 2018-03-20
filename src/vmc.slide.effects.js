;(function ($, undefined) {
    $.vmcSlideEffects({
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

                the.transfer[4].show().css('left', -the.width).animate({
                    left: 0
                }, opts.speed, function () {
                    the._resetTransfer(index);
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
        'page2': function (index) {
            var the = this,
                opts = the.options;

            the.transfer[0].show()
                .children('.vui-slide-grid')
                .css({
                    opacity: 0,
                    // margin:40,
                    width: 0,
                    height: 0,
                    borderRadius: '50%'
                })
                .each(function (i) {
                    var $this = $(this);
                    var x = i % opts.gridTdX;
                    var y = Math.floor(i / opts.gridTdX);
                    var delay = ((y + 1) / opts.gridTdY + (x + 1) / opts.gridTdX) / 2;
                    delay = opts.speed / 3 * 2 * delay;
                    $this.css({
                        marginLeft: parseInt($this.data('width')) / 2,
                        marginTop: parseInt($this.data('height')) / 2,
                        backgroundPositionX: -(parseInt($this.data('imgLeft')) + parseInt($this.data('width')) / 2),
                        backgroundPositionY: -(parseInt($this.data('imgTop')) + parseInt($this.data('height')) / 2)
                    });
                    $this.animate({
                        opacity: 0.6,
                        marginLeft: 0,
                        marginTop: 0,
                        backgroundPositionX: -parseInt($this.data('imgLeft')),
                        backgroundPositionY: -parseInt($this.data('imgTop')),
                        width: $this.data('width'),
                        height: $this.data('height'),
                        // borderRadius:0
                    }, opts.speed / 3 * 2, 'linear').animate({
                        opacity: 1,
                        borderRadius: 0
                    }, opts.speed / 3, 'linear');
                })
                .last()
                .queue(function () {
                    the._resetTransfer(index);
                });


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
    });
})(jQuery);