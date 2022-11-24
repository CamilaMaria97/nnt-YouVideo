/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var deviced;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    devicein:deviced,
    devicelog:function(data){
        this.devicein = data;
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        document.addEventListener("deviceready", onDeviceReady, false);
        this.devicelog(device);
        deviced=device.cordova;
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //console.log("plat");
        //console.log(device);
        this.devicelog(device);
        deviced=device.cordova;
        console.log('Received Event: ' + id);
        document.addEventListener("backbutton", backController, true);
         // Handle the back button
        var myApp = angular.module('nntv.controllers',[]);
        myApp.controller('backController', ['$state', function($state) {
            console.log('atras ');
            if(tipo == "nntv"){
                if(state == "vod"){
                    $state.go('app.listado');
                }else if(state == "menu"){
                         
                }else if(state == "vodcat"){
                    $state.go('app.vod');     
                }else if(state == "voditem"){
                    $state.go('app.vodcategory');     
                }else if(state == "listado"){
                        
                }else if(state == "ext"){
                    $state.go('app.listado');
                }
            }else if(tipo == "hotflix"){
                if(state == "vodhot"){
                    
                }else if(state == "menu"){
                         
                }else if(state == "vodconthot"){
                    $state.go('app.vod');     
                }else if(state == "vodithot"){
                    $state.go('app.vodcategoryhot');     
                }else if(state == "listado"){
                    $state.go('app.vod');     
                }      
            }   
        }]);        
    }
};

app.initialize();