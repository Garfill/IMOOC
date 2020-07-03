;(function(window, document) {
  function on(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = handler
    }
  }
  function off(element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false)
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler)
    } else {
      element['on' + type] = null
    }
  }

  function throttle(func, interval, context) {
    let lock = false
    return function(arg) {
      if (lock) {
        return
      }
      lock = true
      func.apply(context, arg)
      setTimeout(() => {
        lock = false
      }, interval);
    }
  }

  function Swipe2(container, options) {
    let self = this
    // 合并配置项
    self.options = Object.assign(self._defaultOptions, options || {})
    // 获取container
    self.container = container
    // 获取列表
    self.wrapper = container.children[0]
    window.addEventListener('load', function () {
      // 初始化轮播
      self.initSwipe()
      // 初始化slider
      self.initSlider()
      // 初始化箭头
      self.initArrow()

      // 开始轮播
      if (self.options.autoplay) {
        console.log('auto')
        self.playSwipe()
      }
    })
  }

  Swipe2.prototype = {
    constructor: Swipe2,
    _defaultOptions: {
      showArrow: true, // 左右箭头
      showSlider: true, // 底部原点
      interval: 3000, // 切换间隔
      speed: 1000, // 动画时长
      animateInterval: 16, // 每次动画移动的间隔时长
      _swipeWidth: 500,
      _swipeHeight: 300,
      autoplay: false,
      enableTouch: true,
    },
    initSwipe() {
      this.count = this.wrapper.children.length;
      this.current = 1;
      this.beforeIndex = 0;
      this.isAnimate = false;
      // 存储触摸事件信息
      this.touch = {
        startX: 0,
        start: 0,
        move: 0,
        end: 0,
        offset: 0.3,
      };
      // 获取播放框宽度
      this.swipeWidth = this.container.getBoundingClientRect().width || this._swipeWidth
      this.swipeHeight = this.container.getBoundingClientRect().height || this.options.height || this.options._swipeHeight
      if (this.count > 1) {
        this.continuous = true
      } else {
        this.continuous = false
      }

      this.playTimer = null

      this.setSwipe()
    },
    setSwipe() {
      this.originList = this.wrapper.children
      // 复制头尾节点
      if (this.continuous) {
        let first = this.originList[0].cloneNode(true)
        let last = this.originList[this.count - 1].cloneNode(true)
        this.wrapper.insertBefore(last, this.wrapper.children[0])
        this.wrapper.appendChild(first)
      }
      this.swipeList = this.wrapper.children
      // 设置轮播框宽高
      this.setHeight(this.container, this.swipeHeight)
      this.setHeight(this.wrapper, this.swipeHeight)
      for(let i = 0; i < this.swipeList.length; i++) {
        this.setWidth(this.swipeList[i], this.swipeWidth)
      }
      // 初始化各个slide的位置
      this.initPosition()

      // 监听transitionend事件
      this.transitionEnd = throttle(this._transitionEnd, 200, this)
      on(this.container, 'transitionend', this.transitionEnd.bind(this))
    },
    initPosition() {
      for (let i = 0; i < this.swipeList.length; i++) {
        let elem = this.swipeList[i]
        if (i < this.current) {
          this.setTransform(elem, -this.swipeWidth, 0)
        } else if (i > this.current) {
          this.setTransform(elem, this.swipeWidth, 0)
        } else {
          this.setTransform(elem, 0, 0)
        }
      }
    },
    initSlider() {
      if (this.options.showSlider) {
        this.currentSlide = 0
        let sliderWrapper = document.createElement('div')
        sliderWrapper.className = 'swipe-slide-wrapper'
        let sliderList = document.createElement('div')
        sliderList.className = 'swipe-slide-list'
        for(let i = 0; i < this.count; i++) {
          let slider = document.createElement('span')
          slider.className = 'swipe-slider'
          sliderList.appendChild(slider)
        }
        sliderWrapper.appendChild(sliderList)
        this.container.appendChild(sliderWrapper)
        this.slider = sliderList.children
      }
    },
    initArrow() {
      if (this.options.showArrow) {
        this.arrowLeft = document.createElement('div');
        this.arrowRight = document.createElement('div');
        this.arrowLeft.className = 'swipe-arrow swipe-prev'
        this.arrowRight.className = 'swipe-arrow swipe-next'
        this.arrowLeft.innerHTML = '&lt;'
        this.arrowRight.innerHTML = '&gt;'
        this.container.appendChild(this.arrowLeft)
        this.container.appendChild(this.arrowRight)
      }
    },
    setWidth(elem, value) {
      elem.style.width = value + 'px'
    },
    setHeight(elem, value) {
      elem.style.height = value + 'px'
    },
    setTransform(elem, value, duration) {
      elem.style.transitionDuration = duration + 'ms';
      elem.style.transform =
        "translate3d(" + value + "px, 0px, 0px)";
      elem.style["-webkit-transform"] =
        "translate3d(" + value + "px, 0px, 0px)";
      elem.style["-ms-transform"] =
        "translate3d(" + value + "px, 0px, 0px)";
    },
    playSwipe() {
      this.playTimer = setTimeout(() => {
        this.next()
      }, this.options.interval);
    },
    next() {
      if (this.isAnimate) return
      if (this.continuous) {
        this.slideTo(this.current + 1)
      }
    },
    prev() {
      if (this.isAnimate) return
      if (this.continuous) {
        this.slideTo(this.current - 1)
      }
    },
    slideTo(index) {
      if (this.isAnimate) return
      if (this.current == index) return

      this.isAnimate = true
      let flag = index > this.current ? 1 : -1
      let targetEle = this.swipeList[index]
      this.setTransform(targetEle, flag * this.swipeWidth, 0)


      window.requestAnimationFrame(() => {
        let currentEle = this.swipeList[this.current]
        this.setTransform(currentEle, -flag * this.swipeWidth, this.options.speed)
        this.setTransform(targetEle, 0, this.options.speed)
        this.current = index
      })
    },
    _transitionEnd() {
      let need = this.current == 0 || this.current == this.count + 1
      if (need) {
        this.refreshPos(this.current)
      }
      this.isAnimate = false
    },
    refreshPos(index) {
      this.current = index == 0 ? this.count : 1
      let count = this.swipeList.length
      while (count--) {
        let pos = count > this.current ? this.swipeWidth : (count < this.current ? -this.swipeWidth : 0)
        this.setTransform(this.swipeList[count], pos, 0)
      }
    }
  }

  window.Swipe2 = Swipe2
})(window, document)