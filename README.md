# vmc.slide 图片轮播JQuery插件

### 演示

[demo](http://vomoc.github.io/vmc.slide/test/demo.html)


### 更新说明

v2.0.0 - 2018.3.20

1. 轮播图宽度可随父层元素变化，支持响应式网页
2. 解决过场动画缝隙BUG
3. 特效显示，固定尺寸可兼容到IE6，不固定尺寸兼容到IE9。不兼容情况显示默认淡入淡出转场
4. 代码重构，对 `1.x` 版本不能无缝升级。

### 特点

1. 支持左右箭头和圆点按钮播放控制。
2. 能够灵活制定播放方式及转场特效顺序。
3. 经过多种浏览器，包括IE6，测试均能很好兼容。
4. 提供接口，支持自定义转场效果。方便网页开发者自行编写更多转场特效。
5. 优化转场特效算法提高执行效率。

### 使用

```html
<script src="jquery-1.11.2.min.js"></script>
<script src="vmc.slide.js"></script>
<script src="vmc.slide.effects.js"></script>
```

##### 方法一，使用 `html` 载入场景数据
```html
<div id="slide">
    <ul>
         <li data-text="这是文本"><a href="javascript:;" target="_blank"><img src="demo1.jpg"/></a></li>
         ...
    </ul>
</div>

<script>
    var options = {};
    $('#slide').vmcSlide(options);
</script>
```

##### 方法二，使用选项 `option.data` 载入场景数据
```html
<div id="slide"></div>

<script>
    var options = {
        data: [
            {
                src: 'demo.jpg',
                text: '这是demo',
                href: 'http://www.vomoc.com/slide',
                target: '_blank'
            },
            ...
        ]
    };
    $('#slide').vmcSlide(options);
</script>
```

### 选项

##### data
* 类型：array，默认值：[]
* 场景数据
* 说明：插件会从li标签解析数据与data数据合并，生成最终场景数据
```javascript
// 示例
[
    {
        src: 'demo.jpg', // 图片地址
        text: '这是demo', // 说明文本
        href: 'http://www.vomoc.com/slide', // 超链接
        target: '_blank' // 链接打开方式
    }
]
```

##### width
* 类型：int/string，默认值：'auto'，单位：px
* 宽度
* 说明：为'auto'时，轮播图宽度随父层变化

##### height
* 类型：int/string，默认值：'auto'，单位：px
* 高度
* 说明：为'auto'时，轮播图高度随父层变化

##### imgWidth
* 类型：int，默认值：0，单位：px
* 图片实际宽度
* 说明：为0时，图片实际宽度按照轮播图宽度计算

##### imgHeight
* 类型：int，默认值：0，单位：px
* 图片实际高度
* 说明：为0时，图片实际高度按照轮播图高度计算

##### minWidth
* 类型：int，默认值：0，单位：px
* 轮播图最小宽度

##### minHeight
* 类型：int，默认值：0，单位：px
* 轮播图最小高度

##### gridTdX
* 类型：int，默认值：10
* 网格切片模式下x轴切片份数

##### gridTd
* 类型：int，默认值：5
* 网格切片模式下y轴切片份数

##### gridOdX
* 类型：int，默认值：30
* 水平切片模式下x轴切片份数

##### gridOdY
* 类型：int，默认值：10
* 垂直切片模式下y轴切片份数

##### sideButton
* 类型：boolean，默认值：true
* 是否显示两侧翻页按钮

##### navButton
* 类型：boolean，默认值：true
* 是否显示导航圆点按钮

##### showText
* 类型：boolean/string，默认值：'auto'
* 是否显示说明文本
* 说明：为'auto'时，只有场景数据中text不为空才显示

##### isHtml
* 类型：boolean，默认值：false
* 说明文本是否是HTML

##### autoPlay
* 类型：boolean，默认值：true
* 是否自动播放

##### ascending
* 类型：boolean，默认值：true
* 是否按照升序播放

##### effects
* 类型：array，默认值：['fade']
* 转场动画效果名称
* 说明：默认效果 `fade` 可兼容低版本IE浏览器，其他效果需要引入 `vmc.slide.effects.js` 扩展，或者自定义编写。效果名称请查看 `vmc.slide.effects.js` 。 `vmc.slide.full.min.js` 已包含 `vmc.slide.effects.js`。

##### ie6Tidy
* 类型：boolean，默认值：false
* 是否IE6下精简效果

##### random
* 类型：boolean，默认值：true
* 是否随机使用转场动画效果

##### duration
* 类型：int，默认值：4000，单位：毫秒
* 图片停留时长

##### speed
* 类型：int，默认值：800，单位：毫秒
* 转场效果时长

##### hoverStop
* 类型：boolean，默认值：true
* 是否鼠标悬停暂停动画

##### flip
* 类型：function
* 翻页回调
* 参数：

```javascript
formIndex  // 离开场景索引
toIndex // 打开场景索引
```

##### created
* 类型：function
* 创建完成回调

### 方法

##### option(optionName, value)
* 设置选项值