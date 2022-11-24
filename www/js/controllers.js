var state = "sin";
var tipo = "nntv";
var itemsel;
var contador=0;
var ultimocanalusado = null;
var canalselect="ñam";
var videoUrl;
angular.module('nntv.controllers', [])
.controller('MenuCtrl', ['$scope','userId','$state', '$ionicSideMenuDelegate', function($scope,userId, $state, $ionicSideMenuDelegate) {
  //$ionicSideMenuDelegate.canDragContent(false);
  state="menu";
  $scope.isios=ionic.Platform.isIOS();
  $scope.salir = function() {
    navigator.app.exitApp();
  }
  $scope.desconectar = function() {
    userId.setLogo("");
    userId.setTipo("");
    userId.setId("");
    userId.setNombre("");
    userId.setUsuario("");
    userId.setContrasena("");
    var storage = window.localStorage;
    storage.setItem("logo","");
    storage.setItem("tipo","");
    storage.setItem("nombre","");
    storage.setItem("userid","");
    storage.setItem("usuario","");
    storage.setItem("contrasena","");
    $state.go('welcome');
  }
  $scope.vodc = function() {
    $state.go('app.vod');
  }
  $scope.list = function() {
    $state.go('app.listado');
  }
}])
.controller('LoginCtrl', ['$scope', '$state', 'UsuariosREST', 'userId', '$ionicLoading', '$ionicPopup', function($scope, $state, UsuariosREST, userId, $ionicLoading, $ionicPopup) {
  $scope.values = { email: "", contrasena: "" };
  state = "login";
  var storage = window.localStorage;
  var favitems=storage.getItem("nombre");
  if ((favitems === undefined) || (favitems === null) || (favitems == "")) $scope.values = { email: "", contrasena: "" }; // email: "test@nn.tv", contrasena: "nntv2017"  email: "suitesub@icareus.com", contrasena: "nndemo"
  else $scope.values = { email: storage.getItem("usuario"), contrasena: storage.getItem("contrasena") };
  $scope.hacerlogin = function() {
    if (($scope.values.email.length>0) && ($scope.values.contrasena.length>0)) {
      $ionicLoading.show({duration:10000, template: '<i class="icon ion-loading-c"></i> Comprobando...' });
      var udatos =   {
        action: "authenticate",
        eMail:$scope.values.email,
        password:$scope.values.contrasena
      };
      UsuariosREST.login(udatos).then(function(data)
      {
        // console.log(JSON.stringify(data.data));
        //status:"ok”,user_id:635181,user_name:"Suite”,user_organization_id:296893,user_organization_logo:"https://suite.icareus.com:443/image/company_logo?img_id=0"
        $ionicLoading.hide();
        if (data.data.status=="ok") {
          userId.setLogo(data.data.user_organization_logo);
          userId.setNombre(data.data.user_name);
          userId.setTipo(data.data.user_organization_id);
          userId.setId(data.data.user_id);
          userId.setUsuario($scope.values.email);
          userId.setContrasena($scope.values.contrasena);
          var storage = window.localStorage;
          storage.setItem("logo",data.data.user_organization_logo);
          storage.setItem("tipo",data.data.user_organization_id);
          storage.setItem("userid",data.data.user_id);
          storage.setItem("nombre",data.data.user_name);
          storage.setItem("usuario",$scope.values.email);
          storage.setItem("contrasena",$scope.values.contrasena);
          $state.go('app.listado');
          
        } else {
          var alertPopup = $ionicPopup.alert({
            title: 'Datos incorrectos',
            template: 'Los datos de entrada son incorrectos',
            buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
          });
        }
      });
    };
  }
}])
.controller('ListadoCtrl', ['$scope', '$location', 'UsuariosREST', '$ionicLoading', '$ionicPopup', 'passdata', function($scope, $location, UsuariosREST, $ionicLoading, $ionicPopup, passdata) {
  $scope.items=null;
  state = "listado";
  var cargar=function() {
    $ionicLoading.show({duration:10000, template: '<i class="icon ion-loading-c"></i> Cargando...' });
    UsuariosREST.listado().then(function(data)
    {
      $ionicLoading.hide();
      // console.log(JSON.stringify(data));
      //{"logicalChannel":1,"imageLarge":"https://suite.icareus.com/image/image_gallery?img_id=4461951","expirationDate":0,"packages":[],"imageMedium":"https://suite.icareus.com/image/image_gallery?img_id=4461950","urls":[{"id":1655685,"name":"1280x720 (3436kbps)","url":"http://91.126.138.140:1935/live/launo-Stream/playlist.m3u8"}],"networkId":0,"aspectRatio":"16:9","onId":0,"timeshift":false,"imageSmall":"https://suite.icareus.com/image/image_gallery?img_id=4461949","primaryLanguage":"eng","title":"TVE 1","serviceId":430035,"tsId":0,"description":"TVE 1","quality":0,"startOver":0,"audioOnly":0,"bsId":0}
      if (data.status=="ok") {
        /*  var plt=true; //ionic.Platform.isIOS();
        if (plt) {
          $scope.items=[];
          for (i=0;i<data.channels.length;i++) {
            if (data.channels[i].logicalChannel==42)  $scope.items.push(data.channels[i]);
          }
        }
        else */
        $scope.items=data.channels;
        if(ultimocanalusado == null){
          ultimocanalusado=data.channels[35];
        }
      }  else {
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'Ha habido un error obteniendo la lista de canales',
          buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
        });
      }
    });
  }
  
  $scope.reload = function () {
    cargar();
  };
  cargar();
  $scope.search = function (items) {
    $scope.data = {};
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="number" ng-model="data.wifi">',
      title: 'Introduzca numero del canal',
      subTitle: ' Ultimo canal '+ ultimocanalusado.title +' numero: '+ ultimocanalusado.logicalChannel + ' ',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Go</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.wifi) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              console.log($scope.data.wifi);
              playpornumero($scope.data.wifi,items);
              return $scope.data.wifi;
            }
          }
        }
      ]
    });
  };
  var playpornumero = function (numero,items) {
    var channel;
    //console.log(items);
    for (var i = 0; i <= (items.length-1); i++) {
      if(items[i].logicalChannel == numero ){
        channel = items[i];
        abrirstreamP(channel, items);
        break
      } else if (i == (items.length-1)) {
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'Numero de canal no existente',
          buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
        });
      }
    }
  };
  var abrirstreamP = function (channel, items) {
    ultimocanalusado=channel;
    passdata.reset();
    /*  passdata.addObject(channel,0);
    $location.path('/app/channelitem');*/
    var ulr = channel.urls[0].url;
    if(ulr.slice(-2)=="&&"){
      //video de youtube
      reproduciryoutube(channel, items);
    }else{
      reproducircanal(channel, items);
    }
  }
  $scope.abrirstream = function (channel, items) {
    ultimocanalusado=channel;
    passdata.reset();
    /*  passdata.addObject(channel,0);
    $location.path('/app/channelitem');*/
    var ulr = channel.urls[0].url;
    if(ulr.slice(-2)=="&&"){
      //video de youtube
      reproduciryoutube(channel, items);
    }else{
      reproducircanal(channel, items);
    }
  }
  /* BORRAR */
  var reproducircanal = function(data, items) {
    var nowTime = new Date().getTime();
    if(data.expirationDate>0 && data.expirationDate<nowTime) {
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'El stream no está disponible o no tienes autorización para ver este canal',
        buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
      });
    } else {
      var videoUrl=data.urls[0].url;
      if (videoUrl) {
        const w = [20 /* Taurino */,
          21 /* FDF */,
          27 /* TU INGLES */,
          36 /* ÑAM */,
          37 /* baco */,
          38 /* Galeria canal */,
          99 /* hit tv */,
          126 /* cantabria tv */,
          127 /* popular cantabria */,
          154 /* CGTN */];
        if (w.indexOf(data.logicalChannel) != -1) {
          var myPopup = $ionicPopup.show({
            template: '<center><img class="header-image" src="' + data.imageSmall + '"></center>',
            title: 'Dirigiendo a un reproductor externo',
            subTitle: 'Intentando mejorar su experiencia de usuario este canal será redirigido a un reproductor externo',
            scope: $scope,
            buttons: [
              { 
                text: '<b>|<</b>',
                onTap: function(e) {
                  if (data.logicalChannel != items[0].logicalChannel) {
                    for (var i = 0; i <= (items.length-1); i++) {
                      if(items[i].logicalChannel == data.logicalChannel ){
                        channel = items[i - 1];
                        abrirstreamP(channel, items);
                        break
                      } else if (i == (items.length-1)) {
                        var alertPopup = $ionicPopup.alert({
                          title: 'Error',
                          template: 'Numero de canal no existente',
                          buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
                        });
                      }
                    }
                  }
                  return 0;
                }
              },
              {
                text: '<b>Go</b>',
                type: 'button-balanced',
                onTap: function(e) {
                  var options3={
                    vlc: true,
                    successCallback: function() {
                      abrirstreamP(data, items);
                    },
                    errorCallback: function(errMsg) {
                      var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'No tienes los codecs necesarios para el canal',
                        buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
                      });
                      abrirstreamP(data, items);
                    }
                  };
                  window.plugins.streamingMedia.playVideo(videoUrl,options3);
                  return 0;
                }
              },
              {
                text: '<b>>|</b>',
                onTap: function(e) {
                  if (data.logicalChannel != items[items.length - 1].logicalChannel) {
                    for (var i = 0; i <= (items.length-1); i++) {
                      if(items[i].logicalChannel == data.logicalChannel ){
                        channel = items[i + 1];
                        abrirstreamP(channel, items);
                        break
                      } else if (i == (items.length-1)) {
                        var alertPopup = $ionicPopup.alert({
                          title: 'Error',
                          template: 'Numero de canal no existente',
                          buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
                        });
                      }
                    }
                  }
                  return 0;
                }
              },
              { 
                text: '<b>X</b>',
                type: 'button-positive',
              }
            ]
          });
        }
        else {
          var options={ errorCallback: function(errMsg) {
            if (errMsg == "previous") {
              if (data.logicalChannel != items[0].logicalChannel) {
                for (var i = 0; i <= (items.length-1); i++) {
                  if(items[i].logicalChannel == data.logicalChannel ){
                    channel = items[i - 1];
                    abrirstreamP(channel, items);
                    break
                  } else if (i == (items.length-1)) {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Error',
                      template: 'Numero de canal no existente',
                      buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
                    });
                  }
                }
              }
            }
            else if (errMsg == "next") {
              if (data.logicalChannel != items[items.length - 1].logicalChannel) {
                for (var i = 0; i <= (items.length-1); i++) {
                  if(items[i].logicalChannel == data.logicalChannel ){
                    channel = items[i + 1];
                    abrirstreamP(channel, items);
                    break
                  } else if (i == (items.length-1)) {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Error',
                      template: 'Numero de canal no existente',
                      buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
                    });
                  }
                }
              }
            }
            else {
              var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'No se puede reproducir este canal en estos momentos',
                buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
              });
            }
          } /* ,orientation: 'landscape' */ , controls: false};
          //window.plugins.streamingMedia.playVideo(videoUrl,options);
          window.plugins.streamingMedia.playVideo(videoUrl, options);
        }
      }
    }
  };
  var reproduciryoutube = function(data, items) {
    console.log(data);
    var rurl=data.urls[0].url;
    console.log("Item url"+rurl);
    if (rurl.indexOf("PLAYLISTNAME")>=0) {
      var params=rurl.split("&&");
      var tk=params[1].split("=");
      console.log("Item url name "+tk[1]);
      UsuariosREST.youtube(tk[1]).then(function(data)
      {
        $ionicLoading.hide();
        //console.log(data);
        //   console.log(JSON.stringify(data));
        if (data.status=="ok") {
          youtuberep(data);
        }
      });
    }
    var youtuberep = function(data){
      var videoId= data.assets[contador].pageUrl;
      console.log(videoId);
      //console.log(videoId.split('=')[1]);
      YoutubeVideoPlayer.openVideo(videoId.split('=')[1], function(result) {
        console.log('YoutubeVideoPlayer result = ' + result);
        var myPopup = $ionicPopup.show({
          title: 'Ver Siguiente Video ?',
          buttons: [
            { text: 'Cancel',
              onTap: function(e) {
                contador=0;
              }
            },
            {
              text: '<b>Si</b>',
              type: 'button-positive',
              onTap: function(e) {
                contador++;
                youtuberep(data);
              }
            }
          ]
        });
      });
    };
  };
var reproducirAlt = function (data){
  var nowTime = new Date().getTime();
  if(data.expirationDate>0 && data.expirationDate<nowTime) {
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: 'El stream no está disponible o no tienes autorización para ver este canal',
      buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
    });
  } else {
    var videoUrl=data.urls[0].url;
    if (videoUrl) {
      //videojs player
      var player = videojs('my-video');
      player.src({
        src: videoUrl,
        type: 'application/x-mpegURL',
        withCredentials: false
      });
      player.on('error', function(e){
        player.log("Streaming Error");
        $('.vjs-error').style('display: block');
      });
      //
      player.play();
    }
  }
};
/* FIN BORRAR */

/* $scope.ponerfavorito = function (id,pos) {
  favoritos.push(id);
  storage.setItem("favoritos",JSON.stringify(favoritos));
  $scope.items[pos].favorito=1;
  $scope.listado=$scope.items;
  $scope.$apply();
}
$scope.quitarfavorito = function (id,pos) {
  var index = favoritos.indexOf(id);
  if (index > -1) {
    favoritos.splice(index, 1);
  }
  storage.setItem("favoritos",JSON.stringify(favoritos));
  $scope.items[pos].favorito=0;
  $scope.listado=$scope.items;
  $scope.$apply();
}
$scope.irchat = function (id) {
  $location.path('/app/chat/'+id);
}*/
}])
.controller('videoplayer', ['$scope','$state','$location', 'UsuariosREST', 'userId', '$ionicLoading', '$ionicPopup','$sce', function($scope,$state, $location, UsuariosREST, userId, $ionicLoading, $ionicPopup,$sce) {

}])
.controller('videoplayer', ['$scope','$state','$location', 'UsuariosREST', 'userId', '$ionicLoading', '$ionicPopup','$sce', function($scope,$state, $location, UsuariosREST, userId, $ionicLoading, $ionicPopup,$sce) {
  //Control VOD
  
  $scope.itemV= $sce.trustAsResourceUrl(videoUrl);
  console.log($scope.itemV);
  var video = document.getElementById('Video1');
  video.play();
}])
.controller('VodCtrl', ['$scope','$location', 'UsuariosREST', 'userId', '$ionicLoading', '$ionicPopup', function($scope, $location, UsuariosREST, userId, $ionicLoading, $ionicPopup) {
  $scope.items=null;
  var cargarvod=function() {
    $ionicLoading.show({duration:10000, template: '<i class="icon ion-loading-c"></i> Cargando...' });
    var udatos =   {
      action:"getGroups",
      organizationId:userId.getTipo(),
      groupTypeName:"Folders",
      language:"en_US"
    };
    UsuariosREST.vod(udatos).then(function(data)
    {
      $ionicLoading.hide();
      if (data.data.status=="ok") {
        $scope.items=data.data.groupItems[0].groupItems;
        
      }  else {
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'Ha habido un error obteniendo la lista de categorías',
          buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
        });
      }
    });
  }
  $scope.reload = function () {
    cargarvod();
  };
  cargarvod();
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
  $scope.ircategoria = function(id) {
    $location.path('/app/vodcategory/'+id);
  };
  $scope.isArray = angular.isArray;
}])
.controller('VodCategoryCtrl', ['$scope', 'UsuariosREST', '$location', '$stateParams', '$ionicLoading', '$ionicPopup', 'passdata', function($scope,  UsuariosREST, $location, $stateParams, $ionicLoading, $ionicPopup, passdata) {
  state = "vodcat";
  $scope.items=null;
  $scope.data={groups:""}
  var from=$stateParams.num;
  $ionicLoading.show({duration:10000, template: '<i class="icon ion-loading-c"></i> Cargando...' });
  UsuariosREST.vodcategory(from).then(function(data)
  {
    $ionicLoading.hide();
    if (data.status=="ok") {
      // {"tags":"","coverImageSmall":"","presets":[{"id":406362,"name":"1280x720 (3436kbps)","url":"https://itv-suite-2-icareus.s3.amazonaws.com/10154/426203/40316.mp4/1.0.mp4?organizationId=296893"}],"coverImageLarge":"","embedUrl":"https://suite.icareus.com/web/nn/player/embed/vod?assetId=1707040","publishEnd":2524651200000,"date":1451589867000,"coverImageMedium":"","id":1707040,"duration":0,"thumbnailSmall":"http://wpc.109FA.edgecastcdn.net/80109FA/icareus_suite/image/image_gallery?img_id=1707048","views":0,"thumbnailMedium":"http://wpc.109FA.edgecastcdn.net/80109FA/icareus_suite/image/image_gallery?img_id=1707047","description":"","name":"Enculada en la azotea","quality":1,"thumbnailLarge":"http://wpc.109FA.edgecastcdn.net/80109FA/icareus_suite/image/image_gallery?img_id=1707046","rating":0,"groups":"100% Español"}
      $scope.items=data.assets;
      // $scope.data.groups=$scope.items[0].groups;
      $scope.data.groups="Categorias";
    }  else {
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'Ha habido un error obteniendo la lista de videos',
        buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
      });
    }
  });
  $scope.irvod = function(vod) {
    passdata.reset();
    passdata.addObject(vod,0);
    $location.path('/app/voditem');
  };
}])
.controller('VodItemCtrl', ['$scope', '$ionicPopup', 'passdata', function($scope, $ionicPopup, passdata) {
  $scope.data=passdata.getObject(0);
  state = "voditem";
  $scope.reproducirvod = function(videoUrl) {
    if (videoUrl) {
      var options={errorCallback: function(errMsg) {
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'No se puede reproducir este video en estos momentos',
          buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
        });
      },orientation: 'landscape', controls: false};
      if(videoUrl.slice(-3)=="mp4"){
        window.plugins.streamingMedia.playVideo(videoUrl,options);
      } else{
        window.open(encodeURI(videoUrl), '_self', 'location=no');
      }
    }
  };
}])
.controller('CanalItemCtrl', ['$scope', '$ionicPopup', 'passdata','UsuariosREST','$ionicLoading','userId',  function($scope, $ionicPopup, passdata, UsuariosREST, $ionicLoading, userId) {
  $scope.data=passdata.getObject(0);
  $scope.items=null;
  $scope.youtube=null;
  $ionicLoading.show({duration:10000, template: '<i class="icon ion-loading-c"></i> Cargando...' });
  UsuariosREST.canal($scope.data.serviceId,new Date().getTime()).then(function(data)
  { //OJO ESTO ES PARA LA INFO EXTENDIDA
    $ionicLoading.hide();
    console.log(JSON.stringify(data));
    //{"videoUrls":[],"productionCountries":"","genres":"","persons":{},"primaryLanguage":"eng","info":{"startTime":"2017-02-01T12:10:00Z","imageLarge":"https://suite.icareus.com4787101","duration":660,"imageMedium":"https://suite.icareus.com4787100","freeCaMode":0,"contentType":80,"imageSmall":"https://suite.icareus.com4787099"},"trailerUrls":[],"eventId":4787098,"serviceId":3649309,"assetId":0,"description":{"fin":{"episodeTitle":"","shortDescription":"Short description 1","name":"Name 1","longDescription":"Long description 1"},"eng":{"episodeTitle":"","shortDescription":"Short description 1","name":"Name 1","longDescription":"Long description 1"}},"ratings":[{"rating":0,"country":902}],"avMood":""}
    if (data.status=="ok") {
      $scope.items=data.events;
      //console.log($scope.items);
    }
  });
  var rurl=$scope.data.urls[0].url;
  if (rurl.indexOf("PLAYLISTNAME")>=0) {
    var params=rurl.split("&&");
    var tk=params[1].split("=");
    UsuariosREST.youtube(tk[1]).then(function(data)
    {
      $ionicLoading.hide();
      //   console.log(JSON.stringify(data));
      if (data.status=="ok") {
        $scope.youtube=data.assets;
      }
    });
  }
  var contador=0;
  var youtubeplayer = function() {
    if (contador < $scope.youtube.length) {
      var videoUrl=$scope.youtube[contador].pageUrl;
      if (videoUrl) {
        var yparams=videoUrl.split("=");
        var ytk=yparams[1].split("&&");
        var videoId = ytk[0];
        YoutubeVideoPlayer.openVideo(videoId, (result) => { console.log('Video Finished'); /*contador++; youtubeplayer();*/ });
      } }
    }
    $scope.reproducircanal = function() {
      var nowTime = new Date().getTime();
      if($scope.data.expirationDate>0 && $scope.data.expirationDate<nowTime) {
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'El stream no está disponible o no tienes autorización para ver este canal',
          buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
        });
      } else {
        if ($scope.youtube!=null) {
          youtubeplayer();
        } else {
          var videoUrl=$scope.data.urls[0].url;
          if (videoUrl) {
            var options={ errorCallback: function(errMsg) {
              var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'No se puede reproducir este canal en estos momentos',
                buttons: [ { text: 'Aceptar', type: 'button-balanced' }]
              });
            },orientation: 'landscape', controls: false};
            reproducircanal(videoUrl);
          } }
        }
      };
    }]);
    