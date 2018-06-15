// 获取url参数
export const GetParam = function (name) {
   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
   var r = window.location.search.substr(1).match(reg)
   if (r != null){
      return decodeURI(r[2])
   }else{
      return null
   }
}
//获取样式
export const GetStyle = function (sname) {
   for (var i = 0; i < document.styleSheets.length; i++) {
      var rules
      if (document.styleSheets[i].cssRules) {
         rules = document.styleSheets[i].cssRules
      } else {
         rules = document.styleSheets[i].rules
      }
      for (var j = 0; j < rules.length; j++) {
         if (rules[j].selectorText == sname) {
            return rules[j].style
         }
      }
   }
}
//获取随机颜色
export const GetRandomColor = function () {
   var color=''
   for(var i=0;i<6;i++){
      color += '0123456789abcdef'[Math.floor(Math.random() * 16)]
   }
   return '#' + color
}

//时间格式化
export const Format = function (t) {
   var min = Math.floor(parseFloat(t) / 60)
   var s = Math.floor(parseFloat(t)) - min * 60
   var min_str, s_str
   min_str = min < 10 ? '0' + min : '' + min
   s_str = s < 10 ? '0' + s : '' + s
   return min_str + ':' + s_str
}

//歌词解析
const parseLyric = function (song, json, time) {
   var lyric = [], m, s, ms, time_str, lyric_arr1
   //以换行符将歌词字符串分割成数组
   lyric_arr1 = song.replace(/\[([a-z]*):.*]/g, '').replace(/\/\//g, '').split(/\n/g)
   //过滤掉数组中的空字符串
   var lyric_arr2 = [], i
   for (i = 0; i < lyric_arr1.length; i++) {
      if (lyric_arr1[i] != '') {
         lyric_arr2.push(lyric_arr1[i])
      }
   }
   //创建json对象存储时间和歌词
   for (i = 0; i < lyric_arr2.length; i++) {
      time_str = lyric_arr2[i].match(/\d*:\d*\.\d*/g)
      if (!time_str) {
         continue
      }
      lyric[i] = lyric_arr2[i].split(']').slice(-1)
      for (var j = 0; j < time_str.length; j++) {
         m = parseInt(time_str[j].split(/[:\.]/g)[0])
         s = parseInt(time_str[j].split(/[:\.]/g)[1])
         ms = parseInt(time_str[j].split(/[:\.]/g)[2])
         time[j] = Number((m * 60 + s + ms / 1000).toFixed(1))
      }
      for (var k = 0; k < time_str.length; k++) {
         if (lyric[i] != '') {
            json[time[k]] = { "time": time[k], "lyric": lyric[i] }
         }
      }
   }
   //将json对象中的时间存入数组
   i = 0
   for (var key in json) {
      time[i++] = json[key].time
   }
   //时间排序
   function sortNumber(a, b) {
      return a - b;
   }
   time.sort(sortNumber)
}
//歌词加载
export const loadLyric = function (lyric, tlyric) {
   var json1 = {}, json2 = {}, time = [], time1 = [], time2 = []
   var i, $lyric = $('.lyric'), $content = $('.content')
   var audio=$('audio').get(0)
   $lyric.html('')
   if (!lyric) {
      $lyric.html('<p style="margin-top:25%">暂无歌词</p>')
      return
   }
   parseLyric(lyric, json1, time1)
   time = time1
   if (tlyric) {
      parseLyric(tlyric, json2, time2)
      time = time1.length > time2.length ? time1 : time2
      for (i = 0; i < time.length; i++) {
         if (!json2[time[i]]) {
            $lyric.append('<p data-time=' + time[i] + '>' + json1[time[i]].lyric + '</p>')
         } else {
            try {
               $lyric.append('<p data-time=' + time[i] + '>' + json1[time[i]].lyric + '<br><span class="trans">' + json2[time[i]].lyric + '</span></p>')
            } catch (err) { }
         }
      }
   } else {
      for (i = 0; i < time.length; i++) {
         $lyric.append('<p data-time=' + time[i] + '>' + json1[time[i]].lyric + '</p>')
      }
   }
   //歌词滚动
   function moveLyric() {
      var t, $p
      var h = $content.height();
      t = Number(audio.currentTime.toFixed(1))
      for (var i = 0; i < time.length; i++) {
         if ((time[i] <= t && t < time[i + 1] && i < time.length - 1) || (i == time.length - 1 && t >= time[i])) {
            $p = $lyric.find('p[data-time="' + time[i] + '"]')
            $p.addClass('active').siblings().removeClass('active')
            try {
               var top = $content.find('.active').position().top
            } catch (err) { }
            var dis
            dis = tlyric ? (1 / 3) * h : (2 / 5) * h
            if (top >= dis) {
               $content.stop().animate({ scrollTop: top - dis }, 200)
            } else {
               $content.stop().animate({ scrollTop: 0 }, 200)
            }
            return
         }
         if (t < time[0]) {
            $content.stop().animate({ scrollTop: 0 }, 200)
         }
      }
   }
   audio.addEventListener('timeupdate', moveLyric)
   //滚动歌词时停止自动滚动定位
   var timeout = null
   var autoScroll = true
   $content.scroll(function () {
      if (timeout != null) {
         clearTimeout(timeout)
      }
      autoScroll = false
      audio.removeEventListener('timeupdate', moveLyric)
      timeout = setTimeout(function () {
         autoScroll = true
         audio.addEventListener('timeupdate', moveLyric)
      }, 500)
   })
}

//更新歌曲进度
export const updateProgress = function () {
   var $progress1 = $('#progress1')
   var audio = $('audio').get(0)
   var dis = audio.currentTime / audio.duration * $progress1.width()
   var timeRanges = audio.buffered
   try {
      var timeBuffered = timeRanges.end(timeRanges.length - 1)
   } catch (err) { }
   var dis1 = timeBuffered / audio.duration * $progress1.width()
   var t = Format(audio.currentTime)
   $('#current-time').text(t)
   $('#ball1').get(0).style.left = dis + 'px'
   $('#progressbar1').get(0).style.width = dis + 'px'
   $('#progressbar3').get(0).style.width = dis1 + 'px'
}
