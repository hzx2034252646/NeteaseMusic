import Vue from 'vue'
import API from '@/api'

function getSongJSON(music){
   let arr=[]
	let title,singer,_singer,album,pic,picId,json
	for(let i=0;i<music.length;i++){
			title=music[i].transNames?music[i].name+'('+music[i].transNames[0]+')':music[i].name
		singer=music[i].artists[0].name
      _singer = '<span class="singer" id=' + music[i].artists[0].id+'>'+singer+'</span>'
		if(music[i].artists.length>1){
			for(let j=1;j<music[i].artists.length;j++){
				singer=singer+'、'+music[i].artists[j].name
            _singer = _singer + '、' + '<span class="singer" id=' + music[i].artists[j].id+'>'+music[i].artists[j].name+'</span>'
			}
		}
		album=music[i].album.transNames?music[i].album.name+'('+music[i].album.transNames[0]+')':music[i].album.alias[0]?music[i].album.name+'('+music[i].album.alias[0]+')':music[i].album.name
		pic=music[i].album.picUrl.replace(/http:\/\/(p3|p4)/,'http://p1')+'?param=50y50'
		picId=music[i].album.picId_str?music[i].album.picId_str:music[i].album.picId
		json={
			name:title,
			singer:singer,
			_singer:_singer,
			album:album,
			source:'netease',
			id:music[i].id,
			picId:picId,
			albumId:music[i].album.id,
			pic:pic
		}
		arr.push(json)
    }
    return arr
}

function getMVJSON(mv) {
   let arr=[]
   let singer, _singer, pic, json
   for (let i = 0; i < mv.length; i++) {
      if (!mv[i].artists[0]) {
         singer = mv[i].artistName
         _singer = '<span class="singer" id=' + mv[i].artistId+'>' + singer + '</span>'
      } else {
         singer = mv[i].artists[0].name
         _singer = '<span class="singer" id=' + mv[i].artists[0].id+'>' + singer + '</span>'
      }
      if (mv[i].artists.length > 1) {
         for (let j = 1; j < mv[i].artists.length; j++) {
            singer = singer + '、' + mv[i].artists[j].name
            _singer = _singer + '、' + '<span class="singer" id=' + mv[i].artists[j].id+'>' + mv[i].artists[j].name + '</span>'
         }
      }
      pic = mv[i].cover.replace(/http:\/\/(p3|p4)/,'http://p1') + '?param=300y160'
      json = {
         name: mv[i].name,
         singer: singer,
         _singer: _singer,
         id: mv[i].id,
         pic: pic
      }
      arr.push(json)
   }
   return arr
}
function getNewMVJSON(mv) {
   let arr = []
   let singer, _singer, pic, json
   for (let i = 0; i < mv.length; i++) {
      singer = mv[i].artists[0].name
      _singer = '<span class="singer" id=' + mv[i].artists[0].id +'>' + singer + '</span>'
      if (mv[i].artists.length > 1) {
         for (let j = 1; j < mv[i].artists.length; j++) {
            singer = singer + '、' + mv[i].artists[j].name
            _singer = _singer + '、' + '<span class="singer" id=' + mv[i].artists[j].id+'>' + mv[i].artists[j].name + '</span>'
         }
      }
      pic = mv[i].picUrl + '?param=300y160'
      json = {
         name: mv[i].name,
         singer: singer,
         _singer: _singer,
         id: mv[i].id,
         pic: pic
      }
      arr.push(json)
   }
   return arr
}
function getSingerMVJSON(mv) {
   let arr = []
   let singer, _singer, pic, json
   for (let i = 0; i < mv.length; i++) {
      singer = mv[i].artistName
      _singer = '<span class="singer" id=' + mv[i].artist.id+'>' + singer + '</span>'
      pic = mv[i].imgurl.replace(/http:\/\/(p3|p4)/,'http://p1') + '?param=300y160'
      json = {
         name: mv[i].name,
         singer: singer,
         _singer: _singer,
         id: mv[i].id,
         pic: pic
      }
      arr.push(json)
   }
   return arr
}
function getSingerJSON(singer) {
   let arr=[]
   let artist, pic, json
   for (let i = 0; i < singer.length; i++) {
      artist = singer[i].name
      artist = singer[i].transNames ? artist + '(' + singer[i].transNames[0] + ')' : artist
      pic = singer[i].img1v1Url + '?param=130y130'
      json = {
         name: artist,
         id: singer[i].id,
         pic: pic
      }
      arr.push(json)
   }
   return arr
}

function getPlayListJSON(playlist) {
   let arr=[]
   let json, pic, count
   for (let i = 0; i < playlist.length; i++) {
      pic = playlist[i].coverImgUrl + '?param=130y130'
      count = playlist[i].playCount
      if (count / 10000 >= 10) {
         count = parseInt(count / 10000) + '万'
      }
      json = {
         name: playlist[i].name,
         id: playlist[i].id,
         playCount: count,
         pic: pic,
         user: playlist[i].creator.nickname,
         userId: playlist[i].creator.userId
      }
      arr.push(json)
   }
   return arr
}
function getNewPlayListJSON(playlist) {
   let arr = []
   let json, pic, count
   for (let i = 0; i < playlist.length; i++) {
      pic = playlist[i].picUrl + '?param=130y130'
      count = playlist[i].playCount
      if (count / 10000 >= 10) {
         count = parseInt(count / 10000) + '万'
      }
      json = {
         name: playlist[i].name,
         id: playlist[i].id,
         playCount: count,
         pic: pic
      }
      arr.push(json)
   }
   return arr;
}
function getAlbumJSON(album) {
   let arr = []
   let title, singer, _singer, pic, json
   for (let i = 0; i < album.length; i++) {
      title = album[i].transNames ? album[i].name + '(' + album[i].transNames[0] + ')' : album[i].name
      singer = album[i].artists[0].name
      _singer = '<span class="singer" id=' + album[i].artists[0].id +'>' + singer + '</span>'
      if (album[i].artists.length > 1) {
         for (let j = 1; j < album[i].artists.length; j++) {
            singer = singer + '、' + album[i].artists[j].name
            _singer = _singer + '、' + '<span class="singer" id=' + album[i].artists[j].id+'>' + album[i].artists[j].name + '</span>'
         }
      }
      pic = album[i].picUrl.replace(/http:\/\/(p3|p4)/,'http://p1') + '?param=130y130'
      json = {
         name: title,
         singer: singer,
         _singer: _singer,
         id: album[i].id,
         pic: pic
      }
      arr.push(json)
   }
   return arr
}
function getMusicJSON(music) {
   let arr = []
   let title, singer, _singer, album, pic, picId, json
   for (let i = 0; i < music.length; i++) {
      title = music[i].tns ? music[i].name + '(' + music[i].tns[0] + ')' : music[i].name
      singer = music[i].ar[0].tns && music[i].ar[0].tns[0] ? music[i].ar[0].name + '(' + music[i].ar[0].tns[0] + ')' : music[i].ar[0].name
      _singer = '<span class="singer" id=' + music[i].ar[0].id +'>' + singer + '</span>'
      if (music[i].ar.length > 1) {
         for (let j = 1; j < music[i].ar.length; j++) {
            let artist = music[i].ar[j].tns && music[i].ar[j].tns[0] ? music[i].ar[j].name + '(' + music[i].ar[j].tns[0] + ')' : music[i].ar[j].name
            singer = singer + '、' + artist
            _singer = _singer + '、' + '<span class="singer" id=' + music[i].ar[j].id+'>' + artist + '</span>'
         }
      }
      album = music[i].al.tns&&music[i].al.tns[0]? music[i].al.name + '(' + music[i].al.tns[0] + ')' : music[i].al.name
      pic = music[i].al.picUrl.replace(/http:\/\/(p3|p4)/,'http://p1') + '?param=50y50'
      picId = music[i].al.pic_str ? music[i].al.pic_str : music[i].al.pic
      json = {
         name: title,
         singer: singer,
         _singer: _singer,
         album: album,
         source: 'netease',
         id: music[i].id,
         picId: picId,
         albumId: music[i].al.id,
         pic: pic
      }
      arr.push(json)
   }
   return arr
}

export {
   getSongJSON,
   getMusicJSON,
   getMVJSON,
   getNewMVJSON,
   getSingerMVJSON,
   getSingerJSON,
   getPlayListJSON,
   getNewPlayListJSON,
   getAlbumJSON
}
