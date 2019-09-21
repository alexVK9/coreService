console.log("CORESERVICE_TEST_SERVER.JS")

window.velEvents = [];

window.vel = {
    config: {
        version: '1.0',
        tms : {
            tfg: true,
            gtm: false,
            tealium: false,
            dtm: false,
            launch: false,
            ensighten: false
        }
    },

    vars: {
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
            tfgversion: ''
        },

        product: [],

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

    helpers: {
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

        charToASCII: function(string){
            var aux='';
            for (var i = 0; i < string.length; i ++){
                aux=aux + (string[i].charCodeAt(0));
            }
            aux = aux % 100000000000000000;
            return aux.toString();
        }

    },
    
    /*
     * Envía el evento a los tgm correspondientes.
     * También hace el encío inicial de pagina vista y añade un evento
     * vacio tras cada evento excepto con el de página vista
     * @param1 init -> true: evento página vista; false: cualquier otro evento
     * @param2 detail -> indica los datos del evento generico
     */
    push: function(detail){

        var dd = window.vel;
        detail = detail || -1;

        // Si es pageview
        if(detail==-1){
            dd.vars.events[0].event="pageview";
            dd.vars.events[0].eventAction="";
            dd.vars.events[0].eventCategory="";
            dd.vars.events[0].eventLabel="";
        }else{
            //dd.vars.events.push({event:detail.event, eventAction:detail.eventAction, eventCategory:detail.eventCategory, eventLabel:detail.eventLabel});
            dd.vars.events[0].event=detail.event;
            dd.vars.events[0].eventAction=detail.eventAction;
            dd.vars.events[0].eventCategory=detail.eventCategory;
            dd.vars.events[0].eventLabel=detail.eventLabel;
        }

        /*window.velEvents[0].event=dd.vars.events[0].event;
        window.velEvents[0].eventAction=dd.vars.events[0].eventAction;
        window.velEvents[0].eventCategory=dd.vars.events[0].eventCategory;
        window.velEvents[0].eventLabel=dd.vars.events[0].eventLabel;*/

        window.velEvents.push({event:dd.vars.events[0].event, eventAction:dd.vars.events[0].eventAction, 
            eventCategory:dd.vars.events[0].eventCategory, eventLabel:dd.vars.events[0].eventLabel});
    },

    /*
     * Envía evento a tgm de TFG
     */
    send: function(client){
        console.log("Sending to TFG...");  
        var dd = window.vel;

        if(dd.config.tms.tfg){            
            console.log('Activado tfg');
            Keen.ready(function(){
                var client = new Keen({
                  projectId: '5c25eabdc9e77c0001218155',
                  writeKey: '7A03C23EBFFD3E67BA3C224173A72C483362CB5FFC46FD77A230578D3622780831770F8221FAF65376000911E836F0D358757B158D2117632AAF65EF70F739D11F21E4841F640AD5156F775F1CBE54E3D4E9233F375FF39E9F5CF9CE6D7A29EE'
                });
                //client.initAutoTracking();
                client.recordEvent(dd.vars.events[0]['event'], window.vel.vars); 
            });
        }
        if(dd.config.tms.gtm){
            console.log('Activado gtm');
        }
        if(dd.config.tms.tealium){
            console.log('tealium');
        }
        if(dd.config.tms.dtm){
            console.log('Activado dtm');
        }
        if(dd.config.tms.launch){
            console.log('Activado launch');
        }
        if(dd.config.tms.ensighten){
            console.log('Activado ensighten');
        }       
    },

    /*
     * Inicializa los valores del objeto recolector
     */
    init: function(){
        var dd = window.vel;

        dd.vars.content.pagetype= 'detail',
        dd.vars.content.pagename= jQuery(jQuery("h1")[0]).text(),
        dd.vars.content.host= window.location.hostname,
        dd.vars.content.url= window.location.href,
        dd.vars.content.referrer= document.referrer,
        dd.vars.content.webmode= dd.helpers.getTipoDispositivo(),
        dd.vars.content.language= navigator.language || navigator.userLanguage,              
        dd.vars.content.category= jQuery(jQuery("h3")[0]).text().split("/")[0],
        dd.vars.content.subcategory1= jQuery(jQuery("h3")[0]).text().split("/")[1],
        dd.vars.content.subcategory2= jQuery(jQuery("h3")[0]).text().split("/")[2],
        dd.vars.content.subcategory3= '',
        dd.vars.content.subcategory4= '',
        dd.vars.content.date= dd.helpers.getCurrentDate(),//dd.helpers.getCurrentDate(),                   
        dd.vars.content.weekday= dd.helpers.getWeekDay(),                  
        dd.vars.content.time= dd.helpers.getTime(),                       
        dd.vars.content.adblock= dd.helpers.detectBlocker(),  

        dd.vars.user.gaclient=  '',
        dd.vars.user.useragent= navigator.userAgent,
        dd.vars.user.newsletter= '',
        dd.vars.user.fingerprint= '',
        dd.vars.user.idcrm= '',
        dd.vars.user.cookie= dd.helpers.myCookie().toString(),

        dd.vars.traffic.campaign= dd.helpers.getParameterByName('utm_campaign'),
        dd.vars.traffic.source= dd.helpers.getParameterByName('utm_source'),
        dd.vars.traffic.medium= dd.helpers.getParameterByName('utm_medium'),
        dd.vars.traffic.term= dd.helpers.getParameterByName('utm_term'),
        dd.vars.traffic.content= dd.helpers.getParameterByName('utm_content')

        dd.vars.search.keyword= '',
        dd.vars.search.resultnumber= '',
        dd.vars.search.originpage= '',

        dd.vars.dataquality.gtmversion= '',
        dd.vars.dataquality.tfgversion= '0.0';

        for(var i=1;i<=jQuery(".product").length;i++){
            var producto = {};
            producto.sku= dd.helpers.charToASCII(jQuery(jQuery(".ref")[0]).text().trim().split("Ref. ")[1]),
            producto.name= jQuery(jQuery("h3")[0]).text().split("/")[3],
            producto.price= jQuery(jQuery(".price")[0]).text().trim().split("Precio: ")[1].split("€")[0],
            producto.category= jQuery(jQuery("h3")[0]).text().split("/")[0],
            producto.subcategory1= jQuery(jQuery("h3")[0]).text().split("/")[1],
            producto.subcategory2= jQuery(jQuery("h3")[0]).text().split("/")[2],
            producto.subcategory3= '',
            producto.brand= jQuery(jQuery("h3")[0]).text().split("/")[0],
            producto.quantity= jQuery("select")[1]['value'],
            producto.size= jQuery("select")[0]['value'],
            producto.color= jQuery(jQuery("h3")[0]).text().split("/")[3],
            producto.positionlist= i.toString(),
            producto.description= jQuery(jQuery("h2")[0]).text();

            dd.vars.product.push(producto);
        }
        
    },

    ecommerce: function(){
        var dd = window.vel.vars.ecommerce;

        window.vel.vars.product[0]['quantity']=jQuery("select")[1]['value'];
        window.vel.vars.product[0]['size']= jQuery("select")[0]['value'];

        dd.discountCode='',
        dd.discountValue='',
        dd.shipping=(jQuery(jQuery("#delivery")[0]).text().trim().split("(")[1].split("€")[0]).toString(),
        dd.step='1',
        dd.tax= (window.vel.vars.product[0]['price']*21/100).toString(),
        dd.transactionid=(Math.random()*100000000000000000).toString(),
        dd.amount=(parseFloat(dd.tax)+parseFloat(dd.shipping)+
            (parseFloat(window.vel.vars.product[0]['price']))*parseInt(window.vel.vars.product[0]['quantity'])).toString();
    },

    listeners: {

    }

}