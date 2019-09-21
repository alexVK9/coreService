class Avcs {
    constructor() {
        //Variables
        this.config = {
            version: '2.0',
            tms : [
                {tfg: true},
                {gtm: false},
                {tealium: false},
                {dtm: false},
                {launch: false},
                {ensighten: false}
            ],
            ecommerce: false,
            printEnable: 0,
            styles: [
                "color: white; font-style: italic; background-color: red;padding: 2px",
                "color: black; font-style: italic; background-color: yellow;padding: 2px",
                "color: white; font-style: italic; background-color: green;padding: 2px",
                "color: white; font-style: italic; background-color: blue;padding: 2px"
            ]
        },
        
        this.event = '',
    
        this.vars = {
            content: {
                pagetype: '',
                pagename: '',
                host: '',
                url: '',
                referrer: '',
                webmode: '',               
                language: '',              
                category: '',
                subcategory1: '',
                subcategory2: '',
                subcategory3: '',
                subcategory4: '',
                date: '',                   
                weekday: '',                  
                time: '',                       
                adblock: ''                   
            },
    
            user: {
                gaclient: '',
                useragent: '',
                newsletter: '',
                fingerprint: '',
                idcrm: '',
                cookie: ''
            },
    
            traffic: {
                campaign: '',
                source: '',
                medium: '',
                term: '',
                content: ''
            },
    
            search: {
                keyword: '',
                resultnumber: '',
                originpage: ''
            },
    
            dataquality: {
                gtmversion: '',
                tfgversion: '2.0'
            },
    
            products: [],
    
            ecommerce: {
                transactionid: '',
                step: '',
                amount: '',
                shipping: '',
                discountValue: '',
                discountCode: '',
                tax: ''
            },
    
            custom: {
                
            },
    
            events: [{
                event: '',
                eventAction: '',
                eventCategory: '',
                eventLabel: ''
            }]
        },

        //Funiones
        this.helpers = {
            // Completa la cadena con 0s hasta longitud n
            ceros: function (x, n) {
                while (x.toString().length < n) {
                    x = "0" + x;
                }
                return x;
            },
            // Devuelve la hora actual en formato hh:mm:ss
            getTime: function() {
                var d = new Date();
                var h = this.ceros(d.getHours(), 2);
                var m = this.ceros(d.getMinutes(), 2);
                var s = this.ceros(d.getSeconds(), 2);
                return h + ":" + m + ":" + s;
            },
            // Si la cadena v es undefined devuelve vacio, si no la propia cadena
            truevalue: function(v){
                if(typeof v != "undefined")
                    return v;
                return "";
            },
            // Devuelve la fecha actual en formato dd/mm/aa
            getCurrentDate: function(){
                
                try {
                    var fechacompleta = '';
                    var fecha = new Date();
                    
                    var d = this.ceros(fecha.getDate(), 2);
                    var m = this.ceros(fecha.getMonth() + 1, 2);
                    var y = fecha.getFullYear();

                    fechacompleta = d + '/' + m + '/' + y;

                } catch (e) {
                    
                    window.DigitalCatch(e);
                }
                
                return fechacompleta
            },
            // Devuelve el día de la semana
            getWeekDay: function(){
                var day = new Date();
                var dayweek="";
                switch(day.getDay()){
                    case 1:
                        dayweek="lunes";
                        break;
                    case 2:
                        dayweek="martes";
                        break;
                    case 3:
                        dayweek="miercoles";
                        break;
                    case 4:
                        dayweek="jueves";
                        break;
                    case 5:
                        dayweek="viernes";
                        break;
                    case 6:
                        dayweek="sabado";
                        break;
                    case 0:
                        dayweek="domingo";
                        break;
                    default:
                        dayweek="";
                }
                return dayweek;
            },
            // Devuelve el dispositivo en el que se está visualizando el navegador
            getTipoDispositivo: function() {
                var width = jQuery(window).width();
                if (width <= 768) {
                    return "mobile";
                }
                else if (width > 768 && width <= 1054) {
                    return "tablet";
                }
                else {
                    return "desktop";
                }
            },
            // Obtiene el parametro name de la url
            getParameterByName: function(name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);

                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            },
            // Detecta si está activado adblock o no devolviendo enabled o disabled 
            detectBlocker: function() {
                var test = document.createElement("div");
                test.innerHTML = "&nbsp;";
                test.className = "adsbox";
                document.body.appendChild(test);
                test.id = 'adsense';

                var eventValue = 'Enabled';
                var imgh = jQuery("#adsense")[0].clientHeight;
                if (typeof imgh != 'undefined') {
                    if (parseInt(imgh) > 0) {
                        eventValue = 'Disabled';
                    }
                };

                return eventValue;
            },
            // Si el usuario no tiene el local storage le asigna un número aletorio como local storage
            myCookie: function(){
                var c = localStorage.getItem("velCookie");
                if(c==null){
                    c = Math.random()*100000000000000000;
                    localStorage.setItem("velCookie", c);
                }
                return c;
            },

            charToASCII : function(string){
                var aux='';
                for (var i = 0; i < string.length; i ++){
                    aux=aux + (string[i].charCodeAt(0));
                }
                aux = aux % 100000000000000000;
                return aux.toString();
            }
        },

        this.print = function(msg, category){
            if(typeof category=='undefined')
                category='';
            // Nv. 0, todo
            if(this.config.printEnable==0){
                if(category.indexOf("error")>-1){
                    console.log("%cError: "+msg, this.config.styles[0]);
                }

                if(category.indexOf("warning")>-1){
                    console.log("%cWarning: "+msg, this.config.styles[1]);
                }

                if(category.indexOf("info")>-1){
                    console.log("%cInfo: "+msg, this.config.styles[2]);
                }

                if(category.indexOf("temp")>-1){
                    console.log("%cTemp: "+msg, this.config.styles[3]);
                }
            }
            // Nv. 1, errores
            if(this.config.printEnable==1){
                if(category.indexOf("error")>-1){
                    if(category.indexOf("error")>-1){
                        console.log("%cError: "+msg, this.config.styles[0]);
                    }
                }
            }

            // Nv. 2, errores y warning
            if(this.config.printEnable==2){
                if(category.indexOf("error")>-1){
                    console.log("%cError: "+msg, this.config.styles[0]);
                }

                if(category.indexOf("warning")>-1){
                    console.log("%cWarning: "+msg, this.config.styles[1]);
                }
            }

            // Nv. 3. informativo
            if(this.config.printEnable==3){
                if(category.indexOf("info")>-1){
                    console.log("%cInfo: "+msg, this.config.styles[2]);
                }
            }

            // Nv. 4. temporales
            if(this.config.printEnable==4){
                if(category.indexOf("temp")>-1){
                    console.log("%cTemp: "+msg, this.config.styles[3]);
                }
            }
        },

        this.setCustomVars = function(){
            this.print("SET CUSTOM VARIABLES OK", "info");
        },

        // event : pageview, generic, ecommerce
        this.push = function(fields){
            this.print("PUSH OK", "info");
            var tms=this.config.tms;
            for(let i=0;i<tms.length;i++){
                var aux=JSON.stringify(tms[i]).replace(/{|}|\"/gi, "");
                var key=aux.split(":")[0];
                var value=aux.split(":")[1];

                if(value=="true"){
                    if(key=="tfg"){
                        
                    }
                    this.print(key, "info");
                }                
            }
            this.event = "";
        },

        this.sendTfg = function(){
            this.print("SEND OK", "info");
        },

        this.ecommerce = function(){
            this.print("ECOMMERCE OK", "info");
        },

        this.init = function(){
            this.print("INIT OK", "info");
            this.setCustomVars();
            this.event = "pageview";
            this.push();
        }
    }
}

var aux = new Avcs();
aux.init();