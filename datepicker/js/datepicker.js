(function(window, doc) {
  function DatePicker(element, options) {
    this.inputDom = element
    this.init()
    
    this.bindEvent()

    const { year, month } = options;
    this.renderDatePicker(year, month)
  }

  DatePicker.prototype = {
    constructor: DatePicker,
    init() {
      let parent = this.inputDom.parentElement;
      this.container = document.createElement('div')
      this.container.classList.add('datepicker-wrapper-hide')
      parent.insertBefore(this.container, this.inputDom.nextSibling)

      let self = this
      this.isOpen = false
      this.inputDom.addEventListener('click', function(e) {
        if (!self.isOpen) {
          self.isOpen = true;
          self.container.className = 'datepicker-wrapper';

          let top = self.inputDom.offsetTop + self.inputDom.offsetHeight;
          let left = self.inputDom.offsetLeft;
          self.container.style.position = 'fixed';
          self.container.style.top = top + 5 + 'px';
          self.container.style.left = left + 'px';
        } else {
          self.isOpen = false
          self.container.className = 'datepicker-wrapper-hide'
        }
      })
    },

    bindEvent() {
      this.container.addEventListener('click', (event) => {
        let $target = event.target
        // 上下一个月的按钮
        if ($target.classList.contains('datepicker-prev-btn')) {
          return this.changeMonth('prev')
        } else if ($target.classList.contains('datepicker-next-btn')) {
          return this.changeMonth('next')
        }
        // 日期点击
        if ($target.tagName.toLowerCase() == 'td') {
          let date = new Date(this.currYear, this.currMonth, $target.dataset.date)
          this.inputDom.value = this.formatDate(date)
        }
      }, false)
    },
    changeMonth(type) {
      if (type == 'prev') {
        this.currMonth--
      } else if (type = 'next') {
        this.currMonth++
      }
      this.renderDatePicker(this.currYear, this.currMonth)
    },
    /**
     * 获取月历数据
     * @param {传入年份} year 
     * @param {传入月份} month 
     */
    getMonthData(year, month) {
      let res = []; // 返回结果，每一项为每一天，

      if (year === undefined || month === undefined) {
        // 默认获取当前时间
        let today = new Date();
        year = year || today.getFullYear();
        month = month || today.getMonth() + 1;
      }
      let tempMonth = new Date(year, month - 1);
      this.currMonth = tempMonth.getMonth() + 1;
      this.currYear = tempMonth.getFullYear();

      let firstDay = new Date(year, month - 1, 1); // 当月第一天
      let firstDayWeekDay = firstDay.getDay();

      let lastDayOfLastMonth = new Date(year, month - 1, 0); // 上月最后一天
      let lastDateOfLastMonth = lastDayOfLastMonth.getDate();

      let preMonthDayCount = firstDayWeekDay == 0 ? 7 : firstDayWeekDay; // 该月内显示上个月多少天

      let lastDay = new Date(year, month, 0); // 当月最后一天
      let lastDate = lastDay.getDate();

      // 循环获取一个月数据
      for (let i = 0; i < 7 * 6; i++) {
        let date = i - preMonthDayCount + 1;
        let showDate = date; // 实际显示的日期
        let thisMonth = month;

        // 修正
        if (date <= 0) {
          // 上一月
          thisMonth = month - 1;
          showDate = lastDateOfLastMonth + date;
        } else if (date > lastDate) {
          // 下一月
          thisMonth = month + 1;
          showDate = date - lastDate;
        }
        // 去年或来年的修正
        if (thisMonth == 0) thisMonth = 12;
        if (thisMonth == 13) thisMonth = 1;

        res.push({
          month: thisMonth,
          date,
          showDate,
        })
      }
      return res
    },

    /**
     * 渲染日历
     */
    renderDatePicker(year, month) {
      this.monthData = this.getMonthData(year, month);
      this.renderHeader()
      this.renderTableHead()
      this.renderBody()
    },
    renderHeader() {
      let headerHtml = `
        <div class="datepicker-header">
          <a href="javascript:;" class="datepicker-btn datepicker-prev-btn">&lt;&lt;</a>
          <span class="datepicker-curr-year">${this.currYear}年</span>
          <span class="datepicker-curr-month">${this.currMonth}月</span>
          <a href="javascript:;" class="datepicker-btn datepicker-next-btn">&gt;&gt;</a>
        </div>
      `
      this.container.innerHTML = headerHtml
    },
    renderTableHead() {
        this.tableContianer = document.createElement('table');
        this.tableContianer.innerHTML = `
          <thead>
            <tr>
              <th class="datepicker-week-header">日</th>
              <th class="datepicker-week-header">一</th>
              <th class="datepicker-week-header">二</th>
              <th class="datepicker-week-header">三</th>
              <th class="datepicker-week-header">四</th>
              <th class="datepicker-week-header">五</th>
              <th class="datepicker-week-header">六</th>
            </tr>
          </thead>
        `
      let body = document.createElement('div');
      body.classList.add('datepicker-body');
      body.appendChild(this.tableContianer);
      this.container.appendChild(body);
    },
    renderBody() {
      let fragment = document.createDocumentFragment(), week;
      let dateNode = document.createElement('td');
      dateNode.classList.add('datepicker-date-item');
      for (let i = 0; i < this.monthData.length; i++) {
        let date = this.monthData[i]
        if (i % 7 == 0) {
          week = document.createElement('tr')
        }
        let node = dateNode.cloneNode(true);
        node.innerText = date.showDate;
        node.setAttribute('data-date', date.date)
        week.appendChild(node);
        if (i % 7 == 6) {
          fragment.appendChild(week)
        }
      }
      this.tableContianer.appendChild(fragment)
    },
    formatDate(date) {
      return '' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    }
  },

  window.DatePicker = DatePicker

})(window, document)