angular.module('nntv.services',['httpPostFix'])
.service('userId', function () {
  var properties={usuario:"", contrasena:"", id:"", logo:"", nombre:"", tipo:"", root:'http://91.126.138.138'}; //91.126.141.198 //test@nn.tv  //nntv2017 https://suite.icareus.com
  var setTipo = function(n) {
    properties.tipo=n;
  }
  var setLogo = function(n) {
    properties.logo=n;
  }
  var setId = function(n) {
    properties.id=n;
  }
  var setNombre = function(n) {
    properties.nombre=n;
  }
  var setUsuario = function(n) {
    properties.usuario=n;
  }
  var setContrasena = function(n) {
    properties.contrasena=n;
  }
  var getRoot = function(){
    return properties.root;
  }
  var getTipo = function(){
    return properties.tipo;
  }
  var getNombre = function(){
    return properties.nombre;
  }
  var getLogo = function(){
    return properties.logo;
  }
  var getId = function(){
    return properties.id;
  }
  var getUsuario = function(){
    return properties.usuario;
  }
  var getContrasena = function(){
    return properties.contrasena;
  }
  return {
    setTipo: setTipo,
    setLogo: setLogo,
    setId: setId,
    setNombre: setNombre,
    setUsuario: setUsuario,
    setContrasena: setContrasena,
    getRoot: getRoot,
    getTipo: getTipo,
    getLogo: getLogo,
    getId: getId,
    getNombre: getNombre,
    getUsuario: getUsuario,
    getContrasena: getContrasena
  };
})
.factory('UsuariosREST',['$http','userId',
function ($http,userId) {
  return {
    login: function (datos) {
      // old: userId.getRoot()+'/api2/login?eMail='+datos.eMail+'&password='+datos.password
      // new: userId.getRoot() + "/api_limite/login?eMail=" + datos.eMail + "&password=" + datos.password + "&idDevice=" + datos.uniqueId
      var promise = $http.get(userId.getRoot() + "/api_limite/login?eMail=" + datos.eMail + "&password=" + datos.password + "&idDevice=" + datos.uniqueId).success(function(data, status) {
        return data;
      });
      return promise;
    },
    listado: function () {
      var promise = $http.get(userId.getRoot()+'/api/channels?organizationId=14925&action=getChannels&userId='+userId.getId()+'&orderBy=logicalChannelNumber&version=03') .then(function(response) {
        return response.data;
      }, function (error) {
        //error
      })
      return promise;
    },
    vod: function (datos) {
      var promise = $http.post(userId.getRoot()+'/api/archive?organizationId=14925', datos).success(function(data, status) {
        return data;
      });
      return promise;
    },
    vodcategory: function (id) {
      var promise = $http.get(userId.getRoot()+'/api/publishing?version=02&action=getAssets&organizationId=14925&language=en_US&groupItemId='+id) .then(function(response) {
        return response.data;
      }, function (error) {
        //error
      })
      return promise;
    },
    canal: function (id,from) {
      var promise = $http.get(userId.getRoot()+'/api/channels?action=getEvents&organizationId=14925&lcId='+id+'&language=en_US&from='+from) .then(function(response) {
        return response.data;
      }, function (error) {
        //error
      })
      return promise;
    },
    youtube: function (cad) {
      var promise = $http.get('http://91.126.141.4:8080/nntv/api/v1/playlist?id='+cad) .then(function(response) {
      return response.data;
    }, function (error) {
      //error
    })
    return promise;
  }
}
}
])
.service('passdata', function () {
  var object=[{}];
  
  var addObject = function(o,pos) {
    object[pos]=o;
  }
  var getObject = function(pos){
    return object[pos];
  }
  var reset = function(){
    object=[{}];
  }
  return {
    addObject: addObject,
    getObject: getObject,
    reset: reset
  };
})
.service('CordovaNetwork', ['$ionicPlatform', '$q', function($ionicPlatform, $q) {
  // Get Cordova's global Connection object or emulate a smilar one
  var Connection = window.Connection || {
    "CELL"     : "cellular",
    "CELL_2G"  : "2g",
    "CELL_3G"  : "3g",
    "CELL_4G"  : "4g",
    "ETHERNET" : "ethernet",
    "NONE"     : "none",
    "UNKNOWN"  : "unknown",
    "WIFI"     : "wifi"
  };
  
  var asyncGetConnection = function () {
    var q = $q.defer();
    $ionicPlatform.ready(function () {
      if(navigator.connection) {
        q.resolve(navigator.connection);
      } else {
        q.reject('navigator.connection is not defined');
      }
    });
    return q.promise;
  };
  
  return {
    isOnline: function (dialog) {
      return asyncGetConnection().then(function(networkConnection) {
        var isConnected = false;
        
        switch (networkConnection.type) {
          case Connection.ETHERNET:
          case Connection.WIFI:
          case Connection.CELL_2G:
          case Connection.CELL_3G:
          case Connection.CELL_4G:
          case Connection.CELL:
          isConnected = true;
          break;
        }
        console.log(isConnected+"----");
        if ((dialog==true) && (!isConnected)) navigator.notification.alert("No hay conexión a Internet, necesitas conexión para usar la app",null,"Atención");
        return isConnected;
      });
    }
  };
}]);
