window.onload = function(){ 

    var select = getElement('city');

    select.onchange = function(event){
        var val = event.target.value;
        console.log(val)
        if(val == 0){
            getLocation();
        } else {
            localStorage.setItem('city',val);
            var url = 'http://api.openweathermap.org/data/2.5/forecast?q='+val+',ua&appid=0af240dafbe5c4aae44810aa98092743&units=metric';
            weather(url);
        }
    }
    if(localStorage.getItem('city')){
        var userCity = localStorage.getItem('city');
        var url = 'http://api.openweathermap.org/data/2.5/forecast?q='+userCity+',ua&appid=0af240dafbe5c4aae44810aa98092743&units=metric';
        weather(url);
        console.log('Tut i tak vse est');
    } else {
        getLocation();
        console.log('Shcha dobavim');
    }
}

function getElement(id){
    return document.getElementById(id);
}
function setText(value, el){
    el.innerText = value;
}
function setIcon(src, el){
    el.setAttribute('src', 'http://openweathermap.org/img/w/' +src+ '.png');
}

function renew(currentWeather,weatherValue,weatherIcon,data,weatherTime,weatherCity){
    setText(currentWeather.main.temp+'C', weatherValue);
    setIcon(currentWeather.weather[0].icon, weatherIcon);
    setText(data.city.name.replace('Misto ',''), weatherCity);
    setText(currentWeather.dt_txt.split(' ')[1].substr(0,currentWeather.dt_txt.split(' ')[1].length-3), weatherTime);
}

function getLocation(){
    var xhr = new XMLHttpRequest();
    var location;
    xhr.onreadystatechange = function(){
        if(this.readyState == 4){
            location = JSON.parse(this.response);
            localStorage.setItem('city',location.city);
           
            var url = 'https://api.openweathermap.org/data/2.5/forecast?lat='+location.loc.split(',')[0]+'&lon='+location.loc.split(',')[1]+'&units=metric&APPID=0af240dafbe5c4aae44810aa98092743'
        }
        console.log(url);
        weather(url);
    }
    xhr.open('GET','https://ipinfo.io/geo', true);
    xhr.send();
}
function weather(url){
    if (!url) return false;
    var weatherIcon = getElement('weather__icon');
    var weatherValue = getElement('weather__value');
    var weatherCity = getElement('weather__city');
    var weatherTime = getElement('weather__time');
    var weatherList = getElement('weather__list');
    var timeOnClick = getElement('timeOnClick');

    var XHR = new XMLHttpRequest();

    XHR.onreadystatechange = function() {
        if ( this.readyState == 4 ) { 
            var data = JSON.parse(this.response);
            
            var currentWeather = data.list[0];
            renew(currentWeather,weatherValue,weatherIcon,data,weatherTime,weatherCity);

            weatherList.innerHTML ='';
            data.list.forEach(function(item){
                var time = item.dt_txt.split(' ')[1];
                var el = document.createElement('div');
                    el.innerText = time.substr(0,time.length-3);
                    el.setAttribute('data-time', item.dt_txt);
                    el.setAttribute('newicon', item.weather[0].icon);
                    el.setAttribute('newtemp', item.main.temp);
                    el.setAttribute('newcity', data.city.name.replace('Misto ',''));
                    el.onclick = function(event){
                        var elem = event.target;
                        var elemTime = elem.getAttribute('data-time').split(' ')[1].substr(0,time.length-3);
                        var newicon = elem.getAttribute('newicon');
                        var newtemp = elem.getAttribute('newtemp')+'C';
                        var newcity = elem.getAttribute('newcity');
                        setText(elemTime,weatherTime);
                        setIcon(newicon, weatherIcon);
                        setText(newtemp,weatherValue);
                        setText(newcity, weatherCity);
                    }
                    weatherList.appendChild(el);
            });
        }
    }


    XHR.open('GET', url, true);
    XHR.send();
}