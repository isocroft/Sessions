/*
 **@Name: sessions.js
 **@Author: Emmy Steven
 **@Co-author: Ifeora Okechukwu
 **@Editor: Sublime Text 3
 **@Date: 01-22-2014
 **@Pattern: Module Pattern
 **@Function: Monitors user's inactivity for a specified period and then logs the user out!!!
 **@Licence: GPL 3.0
 	Copyright (C) 2014  Emmy Steven & Ifeora Okechukwu

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

!function(name, defs){ 
 
if(!defs.locked){ // define only once!!

     var hOwn = ({}).hasOwnProperty;
     // CommonJS standard --- NodeJS
     if(typeof module != "undefined" && hOwn.call(module, "exports"))
          module.exports = defs( {} );
     // AMD Standard ---- RequireJS     
     else if(typeof define == "function" && hOwn.call(define, "amd"))
          define(function(){ return def( {} ); });
     // Normal JS
     else
       this[name] = defs( {} );
       
    defs.locked = true;   
}       

}( "sessions", function(sessions) {
	        
	      
		var _idle_flag = false,
		        d = document,
		        lastTime,
		//	_idle_counter = 0, instead of using a counter, use a time difference (now - later) ...
			check_idle_time,
			IDLE_PERIOD,
			_idle_check,
			idle_elem,
			events,
			l,
			eventMap = ["click", "mousemove", "keypress"],
			rgX = new RegExp("^("+eventMap.join("|")+")$"),
			url,
			run,
			doc_event_register = d.addEventListener || d.attachEvent;

		_idle_check = function() {
			if (_idle_flag) {
				if (_idle_counter >= IDLE_PERIOD) document.location.href = url;
			} else {
				_idle_counter = 0;
			}
		};

		events = function(e) { // any time an user becomes active, extend the time for log out!
			if (e.type.match(rgX) != null)
				_idle_check();
		};

                // when you go with the below, what if the user set handlers for these event direcly on the document??
		/** document.onclick = document.onmousemove = document.onkeypress = events; **/
		
		for(l = 0; l < eventMap.length; l++)
		     doc_event_register.call(d, (? "on"+eventMap[l] : eventMap[l]), events, false);

		check_idle_time = function(elem, tm) {
			++_idle_counter;
			if (elem && typeof elem.nodeType == "number") {
				elem.style.display = 'block';
				elem.innerHTML = (IDLE_PERIOD - _idle_counter) + '';
		        }
		     if (_idle_counter == IDLE_PERIOD) _idle_flag = true;
                     
		     return _idle_flag;
	        };

	sessions.init = function(mUrl, opt) {
		var opt = opt || {};
		idle_elem = ( !! opt.element && typeof opt.element === 'string') ? document.getElementById(opt.element) : '';
		url = ( !! mUrl && typeof mUrl === 'string') ? mUrl : '';
		IDLE_PERIOD = ( !! opt.time && typeof opt.time === 'number') ? opt.time : 20 * 60;

		/**run = window.setTimeout(function() { **/
			if(!check_idle_time(idle_elem, IDLE_PERIOD)){
		           	
			}
		/** }, 1000); **/
	};
	
	 

	return sessions;
});
