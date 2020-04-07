function print(page, total, show) {
  let str = '';
  if (page < show + 1) {
    for(let i = 1; i <= show * 2 + 1; i++) {
      str += i
      str += ' '
    }
    str = str + '...' + total
  } else if (page > total - show) {
    str = '1 ... '
    for(let i = total - show * 2; i <= total; i++) {
      str = str + i + ' '
    }
  } else {
    str = '1 ... '
    for (let i = page - show; i <= page + show; i++) {
      str = str + i + ' '
    }
    str = str + '... ' + total
  }
  str = str.trim()
  console.log(str)
}

print(28, 30, 2)