;(function(window, doc) {
  /**
   * 为元素添加事件监听
   * @param {html元素} element 
   * @param {事件类型} type 
   * @param {处理函数} handler 
   */
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

  function Swipe(container, options) {
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
        self.playSwipe()
      }
    })
  }

  const supportTransition = (function (temp) {
    var props = ["transitionProperty", "WebkitTransition", "MozTransition", "OTransition", "msTransition"];
    for (var i in props) {
      if (temp.style[props[i]] !== undefined) {
        return true
      }
    }
    return false
  })(doc.createElement('test'))

  // console.log(supportTransition)

  Swipe.prototype = {
    constructor: Swipe,
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
      // 设置轮播项(宽高样式)
      this.setSwipe();

    },
    setSwipe() {
      // 复制头尾节点
      this.originList = this.wrapper.children
      if (this.continuous) {
        let first = this.wrapper.children[0].cloneNode(true)
        let last = this.wrapper.children[this.count - 1].cloneNode(true)
        this.wrapper.insertBefore(last, this.wrapper.children[0])
        this.wrapper.appendChild(first)
      }
      this.swipeList = this.wrapper.children
      // 设置轮播宽度
      this.setHeight(this.container, this.swipeHeight)
      let listWidth = this.wrapper.children.length * this.swipeWidth
      this.setWidth(this.wrapper, listWidth)
      if (this.continuous) {
        if (supportTransition) {
          this.setTransition(this.wrapper, 0)
          this.setTransform(this.wrapper, -this.swipeWidth)
        } else {
          this.setLeft(this.wrapper, -this.swipeWidth)
        }
      } else {
        this.setTransition(this.wrapper, 0)
        this.setTransform(this.wrapper, 0)
      }
      for(let i = 0; i < this.swipeList.length; i++) {
        this.setWidth(this.swipeList[i], this.swipeWidth)
      }
      // 绑定事件
      on(this.container, 'mouseover', () => {
        this.options.autoplay = false
        this.playTimer && clearTimeout(this.playTimer)
      })
      on(this.container, 'mouseleave', () => {
        this.options.autoplay = this.options.autoplay
        // this.playSwipe()
      })
      // 绑定触摸事件
      if (this.options.enableTouch) {
        this.bindTouch()
      }
    },
    setWidth(elem, value) {
      elem.style.width = value + 'px'
    },
    setHeight(elem, value) {
      elem.style.height = value + 'px'
    },
    setLeft(element, offset) {
      element.style.left = offset + 'px'
    },
    initSlider() {
      if (this.options.showSlider) {
        this.currentSlide = 0
        let sliderWrapper = doc.createElement('div')
        sliderWrapper.className = 'swipe-slide-wrapper'
        let sliderList = doc.createElement('div')
        sliderList.className = 'swipe-slide-list'
        for(let i = 0; i < this.count; i++) {
          let slider = doc.createElement('span')
          slider.className = 'swipe-slider'
          sliderList.appendChild(slider)
        }
        sliderWrapper.appendChild(sliderList)
        this.container.appendChild(sliderWrapper)
        this.slider = sliderList.children

        this.bindSlider()
        this.changeSlide(this.currentSlide)
      }
    },
    bindTouch() {
      on(this.container, 'touchstart', (e) => {
        if (this.isAnimate) return
        this.playTimer && clearTimeout(this.playTimer)
        this.touch.startX = this.getTransform()
        this.touch.start = e.changedTouches[e.changedTouches.length - 1].clientX
      })
      on(this.container, 'touchmove', (e) => {
        if (!this.isAnimate && this.touch.start != -1) {
          this.playTimer && clearTimeout(this.playTimer)
          this.touch.move = e.changedTouches[e.changedTouches.length - 1].clientX - this.touch.start
          this.setTransform(this.wrapper, this.touch.move + this.touch.startX)
        }
      })
      on(this.container, 'touchend', (e) => {
        if (!this.isAnimate && this.touch.start != -1) {
          this.playTimer && clearTimeout(this.playTimer)
          this.setTransform(this.wrapper, this.touch.move + this.touch.startX)
          let direction = Math.abs(this.touch.move) / this.touch.move
          let offsetPer = (parseInt(Math.abs(this.touch.move)) / this.swipeWidth).toFixed(2)
          if ((offsetPer > this.touch.offset) && this.continuous) {
            direction > 0 ? this.current-- : this.current++
            this.transform(-this.swipeWidth * this.current)
            if (this.current > this.count) {
              this.currentSlide = 0
            } else if (this.current < 1) {
              this.currentSlide = this.count - 1
            } else {
              this.currentSlide++
            }
            this.changeSlide(this.currentSlide)
          } else {
            if (this.continuous) {
              this.transform(-this.swipeWidth * this.current)
            } else {
              this.transform(0)
            }
          }
        }
      })
    },
    bindSlider() {
      for(let i = 0; i < this.slider.length; i++) {
        on(this.slider[i], 'click', () => {
          this.sliderClick(i)
        })
      }
    },
    sliderClick(index) {
      if (this.isAnimate) return
      if (Math.abs(index - this.currentSlide) > 1) {
        this.beforeIndex = this.current
        this.dotClick = true
      }
      if (this.current == index + 1) return
      this.currentSlide = index
      this.changeSwipe(index + 1)
      this.current = index + 1
      if (this.options.showSlider) {
        this.changeSlide(this.currentSlide)
      }
    },
    changeSlide(index) {
      for(let i = 0; i < this.slider.length; i++) {
        this.slider[i].className = 'swipe-slider'
      }
      this.slider[index].classList.add('on')
    },
    initArrow() {
      if (this.options.showArrow) {
        this.arrowLeft = doc.createElement('div');
        this.arrowRight = doc.createElement('div');
        this.arrowLeft.className = 'swipe-arrow swipe-prev'
        this.arrowRight.className = 'swipe-arrow swipe-next'
        this.arrowLeft.innerHTML = '&lt;'
        this.arrowRight.innerHTML = '&gt;'
        this.container.appendChild(this.arrowLeft)
        this.container.appendChild(this.arrowRight)

        // 绑定事件
        this.bindArrow()
      }
    },
    bindArrow() {
      on(this.arrowLeft, 'click', () => {
        this.prevSwipe()
      })
      on(this.arrowRight, 'click', () => {
        this.nextSwipe()
      })
    },
    playSwipe() {
      this.playTimer = setTimeout(() => {
        this.nextSwipe()
      }, this.options.interval);
    },
    prevSwipe() {
      if (this.isAnimate) return
      if (this.continuous) {
        this.beforeIndex = this.current
        this.current--
        this.changeSwipe(this.current)
        if (this.current <= 0) {
          this.currentSlide = this.count - 1
        } else {
          this.currentSlide--
        }
        if (this.options.showSlider) {
          this.changeSlide(this.currentSlide)
        }
      }
    },
    nextSwipe() {
      if (this.isAnimate) return
      if (this.continuous) {
        this.beforeIndex = this.current
        this.current++
        this.changeSwipe(this.current)
        if (this.current > this.count) {
          this.currentSlide = 0
        } else {
          this.currentSlide++
        }
        if (this.options.showSlider) {
          this.changeSlide(this.currentSlide)
        }
      }
    },
    changeSwipe(index) {
      if (this.isAnimate) return
      let flag = -1
      if (this.dotClick) {
        let currentNode = this.currentNode = this.swipeList[this.current];
        let targetNode = this.swipeList[index].cloneNode(true);
        targetNode.setAttribute('data-clone', true)
        let left = supportTransition ? this.getTransform() : this.getLeft(this.wrapper)
        this.targetIndex = index
        if (this.current < index) {
          // 目标节点在后
          let nextNode = currentNode.nextElementSibling;
          this.wrapper.insertBefore(targetNode, nextNode)
          if (supportTransition) {
            this.transform(left + flag * this.swipeWidth)
          } else {
            this.move(left + flag * this.swipeWidth)
          }
        }
        if (this.current > index) {
          // 目标节点在前
          this.wrapper.insertBefore(targetNode, currentNode)
          if (supportTransition) {
            this.setTransition(this.wrapper, 0)
            this.setTransform(this.wrapper, flag * (this.current + 1) * this.swipeWidth)
          } else {
            this.setLeft(this.wrapper, flag * (this.current + 1) * this.swipeWidth)
          }
          if (supportTransition) {
            setTimeout(() => {
              this.transform(this.getTransform() - flag * this.swipeWidth)
            }, this.options.animateInterval);
          } else {
            this.move(this.getLeft(this.wrapper) - flag * this.swipeWidth)
          }
        }

      } else {
        let offset = flag * this.swipeWidth * index
        if (supportTransition) {
          this.transform(offset)
        } else {
          this.move(offset)
        }
      }
    },
    // 移动函数
    move(target) {
      this.isAnimate = true
      let nowLeft = parseInt(window.getComputedStyle(this.wrapper).left)
      let speed = (target - nowLeft) / (this.options.speed / this.options.animateInterval)
      this.animateTimer = window.requestAnimationFrame(() => {
        this.animate(target, speed)
      })
    },
    // 动画函数
    animate(target, speed) {
      let nowLeft = this.getLeft(this.wrapper)
      if ((speed > 0 && nowLeft < target) || 
          (speed < 0 && nowLeft > target)
      ) {
        this.setLeft(this.wrapper, nowLeft + speed)
        // 传统方法：setTimeout 模拟动画
        // this.animateTimer = window.setTimeout(() => {
        //   this.animate(target, speed)
        // }, this.options.animateInterval)

        // 优化：采用 requestAnimationFrame 代替 setTimeout
        this.animateTimer = window.requestAnimationFrame(() => {
          this.animate(target, speed)
        })
      } else {
        // window.clearTimeout(this.animateTimer)
        window.cancelAnimationFrame(this.animateTimer)
        this.reset(target)
      }
    },
    reset(target) {
      this.setLeft(this.wrapper, target)
      this.isAnimate = false
      if (this.dotClick) {
        this.resetMoveDot()
      } else {
        let need = false // 标识是否为首末位的图片
        if (this.current > this.count) {
          this.current = 1
          need = true
        } else if (this.current <= 0) {
          this.current = this.count
          need = true
        }
        if (need) {
          this.setLeft(this.wrapper, -this.swipeWidth * this.current)
        }
      }
      this.setActive()
      if (this.options.autoplay) {
        this.playSwipe()
      }
    },
    setActive() {
      if (this.continuous) {
        for (let i = 0; i < this.swipeList.length; i++) {
          this.swipeList[i].classList.remove('active')
        }
        this.swipeList[this.current].classList.add('active')
      }
    },
    resetMoveDot() {
      this.dotClick = false
      this.setLeft(this.wrapper, -this.swipeWidth * (this.currentSlide + 1))
      if (this.targetIndex > this.beforeIndex) {
        this.wrapper.removeChild(this.currentNode.nextElementSibling)
      } else {
        this.wrapper.removeChild(this.currentNode.previousElementSibling)
      }
    },
    getLeft(elem) {
      return parseInt(window.getComputedStyle(elem).left)
    },

    // 利用css3过渡效果
    setTransform(elem, value) {
      elem.style.transform =
        "translate3d(" + value + "px, 0px, 0px)";
      elem.style["-webkit-transform"] =
        "translate3d(" + value + "px, 0px, 0px)";
      elem.style["-ms-transform"] =
        "translate3d(" + value + "px, 0px, 0px)";
    },
    getTransform: function() {
      var x =
        this.wrapper.style.transform ||
        this.wrapper.style["-webkit-transform"] ||
        this.wrapper.style["-ms-transform"];
      x = x.substring(12);
      x = x.match(/(\S*)px/)[1];
      return Number(x);
    },
    setTransition(elem, value) {
      elem.style.transitionDuration = value + 'ms';
    },
    transform(target) {
      this.isAnimate = true
      this.resetTransition(target)
      this.setTransition(this.wrapper, this.options.speed)
      this.setTransform(this.wrapper, target)
    },
    resetTransition(target) {
      function transitionEnd() {
        this.isAnimate = false
        this.setTransition(this.wrapper, 0)
        this.setTransform(this.wrapper, target)
        off(this.wrapper, 'transitionend', this.transitionEnd)
        if (this.dotClick) {
          this.resetTransitionDot()
        } else {
          let need = false // 标识是否为首末位的图片
          if (this.current > this.count) {
            this.current = 1
            need = true
          } else if (this.current <= 0) {
            this.current = this.count
            need = true
          }
          if (need) {
            this.setTransform(this.wrapper, -this.swipeWidth * this.current)
          }
        }
        this.setActive()
        if (this.options.autoplay) {
          this.playSwipe()
        }
      }
      this.transitionEnd = transitionEnd.bind(this)
      on(this.wrapper, 'transitionend', this.transitionEnd)
    },
    resetTransitionDot() {
      this.dotClick = false
      this.setTransform(this.wrapper, -this.swipeWidth * (this.currentSlide + 1))
      if (this.targetIndex > this.beforeIndex) {
        this.wrapper.removeChild(this.currentNode.nextElementSibling)
      } else {
        this.wrapper.removeChild(this.currentNode.previousElementSibling)
      }
    }
  }

  window.Swipe = Swipe
})(window, document)