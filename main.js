window.addEventListener('DOMContentLoaded', () => {
  const script = document.createElement('script');
  // ブラウザのコンソール画面で、sessionStorage.setItem('api_key', 'APIキー');とAPIキーをセットしておく。
  // sessionStorageもしくは、localStorageにAPIキーがあったら使用する。
  const apikey = sessionStorage.getItem('api_key') || localStorage.getItem('api_key');
  // api keyを可変で設置
  script.src = 'https://maps.google.com/maps/api/js?key=' + apikey + '&language=ja';  
  // scriptタグで読み込ませる
  document.body.appendChild(script);

  document.getElementById("nickname").value = sessionStorage.getItem('nickname') || '';
  const now = new Date();
  const year = now.getFullYear();
  const month = ('0' + (now.getMonth() + 1)).slice(-2);
  document.getElementById("ym").value = sessionStorage.getItem('ym') || (year + month);
  
});

document.getElementById("search").addEventListener('click', () => {
  const mapLatLng = new google.maps.LatLng(35.685175, 139.7528); //　皇居の緯度経度
    const map = new google.maps.Map(document.getElementById('map'), {
      center: mapLatLng, // 皇居の位置を中心に設定
      zoom: 12, // 東京２３区が収まるくらいにズーム値を指定
      mapTypeId: 'roadmap'   //地図の種類(hybrid/roadmap/satellite/terrain)
    });

    const nickname = document.getElementById("nickname").value;
    const ym = document.getElementById("ym").value;
    
    sessionStorage.setItem('nickname', nickname);
    sessionStorage.setItem(ym, ym);

    (async () => {
      // connpassからイベント情報を取得
      const data = await $.ajax({url: 'https://connpass.com/api/v1/event/?nickname=' + nickname + '&ym=' + ym + '&count=100', dataType: 'jsonp'}); 
      data.events.forEach((event,index) => {

        console.log(event.title);
        console.log(event.started_at);
        console.log(event.ended_at);
        console.log(event.event_url);
        console.log(event.place);
        console.log(event.address);
        console.log(event.lat);
        console.log(event.lon);
  　　　　
        // イベントの緯度経度の位置にmarkerを設定
        const markerLatLng = new google.maps.LatLng({lat: parseFloat(event.lat), lng: parseFloat(event.lon)});
        const marker = new google.maps.Marker({
         position: markerLatLng,
            map: map
        });

        // 情報ウィンドウを設定
        const content = '<div>' + event.started_at + '<br>' + event.title + '<br>' + event.event_url + '</div>';
        const infoWindow = new google.maps.InfoWindow({
          content: content
        });

        marker.addListener('click', () => {
          // markerをクリック時、情報ウィンドウを表示する。       
          infoWindow.open(map, marker);
        });

      });
    })();

})


