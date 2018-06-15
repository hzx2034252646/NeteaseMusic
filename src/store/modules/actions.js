const actions={
   //批量操作
   batch() {
      if ($.trim($('#batch').text()) == '批量操作') {
         $('#batch').text('取消批量操作');
         $('.check').css({ 'display': 'inline-block' });
         $('.check:visible').addClass('layui-form-checked');
         $('.song-name').css({ 'max-width': '200px' });
         $('.check:visible').each(function () {
            this.checked = true;
         })
      } else {
         $('#batch').text('批量操作');
         $('.check:visible').each(function () {
            this.checked = false;
         });
         $('.check:visible').removeClass('layui-form-checked');
         $('.check').css({ 'display': 'none' });
         $('.song-name').css({ 'max-width': '250px' });
      }
   },
   //checkbox
   check({ commit }, ev) {
      var flag = 1;
      var obj = $(ev.target).closest('.check')
      if (obj.hasClass('layui-form-checked')) {
         $('.check:not(#checkAll):visible').each(function () {
            if (this.checked == false) {
               flag = 0;
            }
         })
         if (flag) {
            $('#checkAll').removeClass('layui-form-checked');
         }
         obj.removeClass('layui-form-checked');
         obj.get(0).checked = false;
      } else {
         obj.addClass('layui-form-checked');
         obj.get(0).checked = true;
         $('.check:not(#checkAll):visible').each(function () {
            if (this.checked == false) {
               flag = 0;
            }
         })
         if (flag) {
            $('#checkAll').addClass('layui-form-checked');
         }
      }
   },
   //全选
   checkAll() {
      if ($('#checkAll').hasClass('layui-form-checked')) {
         $('.check:visible').removeClass('layui-form-checked');
         $('.check:visible').each(function () {
            this.checked = false;
         })
      } else {
         $('.check:visible').addClass('layui-form-checked');
         $('.check:visible').each(function () {
            this.checked = true;
         })
      }
   },
   checkAllPlaylist(){
      if ($('#checkAll').text()=='取消全选') {
         $('#checkAll').text('全选')
         $('.check:visible').removeClass('layui-form-checked');
         $('.check:visible').each(function () {
            this.checked = false;
         })
      } else {
         $('#checkAll').text('取消全选')
         $('.check:visible').addClass('layui-form-checked');
         $('.check:visible').each(function () {
            this.checked = true;
         })
      }
   }
}

export default {
   actions
}
