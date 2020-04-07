(function(window, doc) {
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
  function getAttribute(element, prop) {
    let value = element.getAttribute(prop)
    if (value) {
      return value
    } else {
      return getAttribute(element.parentElement, prop)
    }
  }
  /**
   * 浅拷贝
   * @param {原对象} origin 
   * @param {混入对象} src 
   */
  function extend(origin, src) {
    for (let p in src) {
      if (!(origin.hasOwnProperty(p)) || origin[p] !== src[p]) {
        origin[p] = src[p]
      }
    }
  }

  function Pagination(element, options) {
    this.container = element
    this.mergeOptions(options)

    this.currPage = this.options.page
    this.dataCount = this.options.total

    // 根据数据总数和每页限制数求得总页数
    this.total = Math.ceil(this.dataCount / this.options.limit)

    // 渲染
    this.renderPagination()

    // 绑定事件
    this.bindEvent()

  }

  Pagination.prototype = {
    constructor: Pagination,

    options: {
      page: 1,
      show: 2,
      limit: 10,
      ellipsis: true,
      preText: 'prev',
      nextText: 'next'
    },

    /**
     * 合并设置项
     * @param {用户设定选项} options 
     */
    mergeOptions(options) {
      extend(this.options, options)
    },
    /**
     * 绑定事件
     */
    bindEvent() {
      let self = this
      on(this.container, 'click', function(e) {
        let target = e.target
        let toPage = null
        let page = getAttribute(target, 'data-page')
        if (page == 'prev') {
          toPage = self.currPage - 1
        } else if (page == 'next') {
          toPage = self.currPage + 1
        } else if (!isNaN(Number(page))) {
          toPage = Number(getAttribute(target, 'data-page'))
        } else {
          return
        }
        if (toPage) {
          self.currPage = toPage
          self.renderPagination()
          self.goToPage(toPage)
        }
      })
    },
    /**
     * 渲染函数
     */
    renderPagination() {
      let fragment = document.createDocumentFragment()
      let ulEle = document.createElement('ul')
      ulEle.classList.add('pagination-list')
      fragment.appendChild(ulEle)
      let originList
      this._originPagination = originList = this.calculatePage()
      for (let i = 0; i < originList.length; i++) {
        ulEle.appendChild(this.createPage(originList[i]))
      }
      this.container.innerHTML = ''
      this.container.insertBefore(fragment, null)
    },
    createPage(pageOption) {
      let liEle = document.createElement('li')
      let spanEle = document.createElement('span')
      liEle.classList.add('pagination-item')
      if (pageOption.id) {
        liEle.classList.add('pagination-' + pageOption.id)
        liEle.setAttribute('data-page', pageOption.id)
        spanEle.id = 'pagination-' + pageOption.id
      } else {
        spanEle.classList.add('pagination-page')
        liEle.setAttribute('data-page', pageOption.content)
      }
      if (pageOption.active) {
        liEle.classList.add('current')
      }
      spanEle.innerText = pageOption.content
      liEle.appendChild(spanEle)
      return liEle
    },
    calculatePage() {
      let page = this.currPage
      let show = this.options.show
      let total = this.total
      let res = []
      res.push({
        type: 'page',
        content: page,
        active: true
      })
      for (let i = 1; i <= show; i++) {
        if (page - i > 1) {
          res.unshift({
            type: 'page',
            content: page - i
          })
        }
        if (page + i < total) {
          res.push({
            type: 'page',
            content: page + i
          })
        }
      }
      if (page - (show + 1) > 1) {
        res.unshift({
          type: 'ellipsis',
          content: '...',
        })
      }
      if (page > 1) {
        res = [
          {
            type: 'prev',
            content: this.options.preText,
            id: 'prev'
          },
          {
            type: 'page',
            content: 1
          }, ...res]
      }
      if (page + (show + 1) < total) {
        res.push({
          type: 'ellipsis',
          content: '...',
        })
      }
      if (page < total) {
        res = [
          ...res,
          {
            type: 'page',
            content: total
          },
          {
            type: 'next',
            content: this.options.nextText,
            id: 'next'
          }
        ]
      }
      return res
    },
    goToPage(page) {
      // 留作触发钩子函数
    }
  }

  window.Pagination = Pagination
})(window, document)