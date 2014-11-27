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
 /**** THIS IS UMD (Universal Module Definition) for all environments *****/
     var hOwn = ({}).hasOwnProperty, sessions = {};
     // CommonJS standard --- NodeJS
     if(typeof module != "undefined" && hOwn.call(module, "exports"))
          module.exports = defs( sessions );
     // AMD Standard ---- RequireJS     
     else if(typeof define == "function" && hOwn.call(define, "amd"))
          define(function(){ return def( sessions ); });
     // Normal JS
     else
       this[name] = defs( sessions );
       
}( "sessions", function(sessions) {
	        
		var _idle_flag = false,
		        d = document,
		        lastTime,
			_idle_counter = 0, 
			check_idle_time,
			IDLE_PERIOD,
			idle_elem,
			events,
			l,
			eventMap = ["click", "mousemove", "keypress"],
			rgX = new RegExp("^("+eventMap.join("|")+")$"),
			run,
			url,
			doc_event_register = d.addEventListener || d.attachEvent,
			events = function(e) { 
		         	if (e.type.match(rgX) != null){
			             lastTime = null;
			             _idle_counter = 0; // any time the user becomes active, extend the time for log out!
		        	}    
	         	};

                // when you go with the below, what if the user set handlers for these event direcly on the document object??
		/** document.onclick = document.onmousemove = document.onkeypress = events; **/
		
		for(l = 0; l < eventMap.length; l++)
		     doc_event_register.call(d, (d.all? "on"+eventMap[l] : eventMap[l]), events, false);

		check_idle_time = function(elem, tm) {
			var now = (new Date()).getTime();
			    diff = now - (lastTime || now);
			if (elem && typeof elem.nodeType == "number") {
				elem.style.display = 'block';
				elem.innerHTML = (IDLE_PERIOD - _idle_counter) + '';
		        }
		     if (_idle_counter >= IDLE_PERIOD) _idle_flag = true;
                     
		     if (_idle_flag) { // if time is up before the user gets a chance to become active, then log user out
		            if(run) clearTimeout(run);
			        document.location.href = url;
		     }else{ // else add how much time has passed since we started checkin --- sessions.init
		        lastTime = now;
		        _idle_counter += diff;
		     }
		       return _idle_flag;
	        };

	sessions.init = function(mUrl, opt) {
		var opt = opt || {};
		idle_elem = ( !! opt.element && typeof opt.element === 'string') ? document.getElementById(opt.element) : (document.body || document.getElementsByTagName("body")[0]);
		url = ( !! mUrl && typeof mUrl === 'string') ? mUrl : '';
		IDLE_PERIOD = ( !! opt.time && typeof opt.time === 'number') ? opt.time : 20 * 60;

		
		if(!check_idle_time(idle_elem, IDLE_PERIOD)){
		     run = setTimeout(arguments.callee.bind(null, mUrl, opt), 0); /* bind is not supported by old IE browsers anyway ! */
		     return; /* break flow of control here else we risk reseting "opt" members */
		}
		
		opt = idle_elem = url = IDLE_PERIOD = null; /** clear stack memory -- just in case **/
	};
	
	 

	return sessions;
});
