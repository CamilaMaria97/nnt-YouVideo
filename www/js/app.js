angular.module('nntv', ['ionic','ui.router','ngAnimate','nntv.services', 'nntv.controllers'])
.config(function($compileProvider){
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
 })
.run(function($ionicPlatform,$state,userId,$rootScope) {
  document.addEventListener('deviceready', function() {

  });
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  /*  if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }*/
    var storage = window.localStorage;
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
   $ionicPlatform.registerBackButtonAction(function () { //disable phone back button
        }, 100);

    var token = storage.getItem("nombre");
    if ((token !== undefined) && (token !== null) && (token != "")) {
      var logo = storage.getItem("logo");
      var tipo = storage.getItem("tipo");
      var usrid = storage.getItem("userid");
      var urdn = storage.getItem("usuario");
      var pssw = storage.getItem("contrasena");
      userId.setNombre(token);
      userId.setTipo(tipo);
      userId.setLogo(logo);
      userId.setId(usrid);
      userId.setUsuario(urdn);
      userId.setContrasena(pssw);
     // $state.go('app.listado');
     $state.go('welcome');
    } else $state.go('welcome');
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('ext', {
    url: "/ext",
    templateUrl: "templates/ext.html"
  })
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html"
  })
  .state('app.listado', {
   // cache: false,
    url: "/listado",
    views: {
      'menuContent': {
        templateUrl: "templates/listado.html"
      }
    }
  })
  .state('app.vod', {
    url: "/vod",
   views: {
      'menuContent': {
        templateUrl: "templates/vod.html"
      }
    }
  })
  .state('app.vodcategory', {
    cache: false,
    url: "/vodcategory/:num",
   views: {
      'menuContent': {
        templateUrl: "templates/vodcategory.html"
      }
    }
  })
  .state('app.voditem', {
    cache: false,
    url: "/voditem",
   views: {
      'menuContent': {
        templateUrl: "templates/voditem.html"
      }
    }
  })
  .state('app.channelitem', {
    cache: false,
    url: "/channelitem",
   views: {
      'menuContent': {
        templateUrl: "templates/fichacanal.html"
      }
    }
  })
  .state('app.videoplayer', {
    cache: false,
    url: "/videoplayer",
   views: {
      'menuContent': {
        templateUrl: "templates/videoplayer.html"
      }
    }
  })
  .state('welcome', {
    cache: false,
    url: "/welcome",
    templateUrl: "templates/welcome.html"
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
})
.filter("timestamp", function () {
    return function (input) {
        var a = new Date(input);
        var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
     /*   var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();*/
        return date + ' ' + month + ' ' + year;
    }
})
.filter('duracion', function () {
        return function (duration) {
            if (!duration) return '';
           var hours = Math.floor(duration / 3600);
           var duration = duration % 3600;
           var minutes = Math.floor(duration / 60);
           var seconds = duration % 60;
        var cadena="";
        if (hours>0) cadena+=hours+"h ";
        if (minutes>0) cadena+=minutes+"min ";
        if (seconds>0) cadena+=seconds+"s";
        return cadena;
          };
})
.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
});
