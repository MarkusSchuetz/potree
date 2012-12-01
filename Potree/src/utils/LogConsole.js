/**
 * LogConsole.js
 *
 * source: gebackene-ente.at
 *
 */

/**
 * @class
 */
function LogLevel(name, color){
	this.name = name;
	this.color = color;
}

/**
 * @constant
 */
LogLevel.TRACE = new LogLevel("TRACE", "#888888");

/**
 * @constant
 */
LogLevel.DEBUG = new LogLevel("DEBUG", "blue");

/**
 * @constant
 */
LogLevel.INFO = new LogLevel("INFO", "black");

/**
 * @constant
 */
LogLevel.SUCCESS = new LogLevel("SUCCESS", "green");

/**
 * @constant
 */
LogLevel.WARN = new LogLevel("WARN", "#AA4400");

/**
 * @constant
 */
LogLevel.ERROR = new LogLevel("ERROR", "red");

/**
 * @constant
 */
LogLevel.FATAL= new LogLevel("FATAL", "purple");

/**
 * @constant
 */
LogLevel.GREEN= new LogLevel("GREEN", "green");

/**
 * @constant
 */
LogLevel.RED= new LogLevel("RED", "red");

function LoggerWindowState(){}
LoggerWindowState.MINIMIZED = 0;
LoggerWindowState.VISIBLE = 1;
LoggerWindowState.HIDDEN = 2;

/**
 * Writes messages into a log window. 
 * 
 * @class
 */
function Logger(){
	
}

Logger.init = function(){
	if(Logger.initialized){
		return;
	}
	
	Logger.logs = 0;
	Logger.createGUI();
	
	Logger.initialized = true;
};

Logger.setWindowState = function(state){
	Logger.init();
	
	if(state == LoggerWindowState.VISIBLE){
		Logger.cRoot.style.top = "70%";
		Logger.cRoot.style.height = "";
		Logger.cRoot.style.width = "";
		Logger.cTableContainer.style.visibility = "visible";
		Logger.cHideAndShow.innerHTML = "<b>_</b>";
		Logger.windowState = LoggerWindowState.VISIBLE;
	}else if(state == LoggerWindowState.MINIMIZED){
		Logger.cRoot.style.top = "";
		Logger.cRoot.style.height = "26px";
		Logger.cRoot.style.width = "100px";
		Logger.cTableContainer.style.visibility = "hidden";
		Logger.cHideAndShow.innerHTML = "<b>&#9723;</b>";
		Logger.windowState = LoggerWindowState.MINIMIZED;
	}else if(state == LoggerWindowState.HIDDEN){
		Logger.cRoot.style.visibility = "hidden";
	}
};

Logger.createGUI = function(){
	
	// root pane
	Logger.cRoot = document.createElement("div");
	Logger.cRoot.id = "logger.rootPane";
	Logger.cRoot.style.position = "absolute";
	Logger.cRoot.style.top = "70%";
	Logger.cRoot.style.bottom = "5px";
	Logger.cRoot.style.left = "5px";
	Logger.cRoot.style.right = "5px";
	Logger.cRoot.style.border = "1px solid #445566";
	Logger.cRoot.style.backgroundColor = "#AABBCC";
	Logger.cRoot.style.borderRadius = "3px";
	Logger.cRoot.style.zIndex = "100000";
	
	// header
	Logger.cHeader = document.createElement("div");
	Logger.cHeader.id = "logger.header";
	Logger.cHeader.style.position = "absolute";
	Logger.cHeader.style.top = "2px";
	Logger.cHeader.style.height = "20px";
	Logger.cHeader.style.left = "2px";
	Logger.cHeader.style.right = "26px";
	Logger.cHeader.style.backgroundColor = "#CCDDEE";
	Logger.cHeader.style.padding = "0px 10px 0px 5px";
	Logger.cHeader.innerHTML = "<b>Logger</b>";
	Logger.cHeader.style.borderRadius = "3px 3px 0px 0px";
	Logger.cHeader.style.border = "1px solid #667788";
	
	Logger.cHideAndShow = document.createElement("div");
	Logger.cHideAndShow.id = "logger.hideAndShow";
	Logger.cHideAndShow.style.position = "absolute";
	Logger.cHideAndShow.style.top = "2px";
	Logger.cHideAndShow.style.right = "2px";
	Logger.cHideAndShow.style.height = "20px";
	Logger.cHideAndShow.style.width = "20px";
	Logger.cHideAndShow.innerHTML = "<b>_</b>";
	Logger.cHideAndShow.style.textAlign = "center";
	Logger.cHideAndShow.style.backgroundColor = "#CCDDEE";	
	Logger.cHideAndShow.style.borderRadius = "3px 3px 0px 0px";
	Logger.cHideAndShow.style.border = "1px solid #667788";
	
	var fOnClick = function(){
		if(Logger.windowState == LoggerWindowState.MINIMIZED){
			Logger.setWindowState(LoggerWindowState.VISIBLE);
		}else if(Logger.windowState == LoggerWindowState.VISIBLE){
			Logger.setWindowState(LoggerWindowState.MINIMIZED);
		}
	};
	
	Logger.cHideAndShow.onclick = fOnClick;
	
	// content table
	Logger.cTableContainer = document.createElement("div");
	Logger.cTableContainer.id = "logger.tableContainer";
	Logger.cTableContainer.style.position = "absolute";
	Logger.cTableContainer.style.top = "26px";
	Logger.cTableContainer.style.bottom = "2px";
	Logger.cTableContainer.style.left = "2px";
	Logger.cTableContainer.style.right = "2px";
	Logger.cTableContainer.style.backgroundColor = "#BBCCDD";
	Logger.cTableContainer.style.overflow = "auto";
	Logger.cTableContainer.style.borderRadius = "0px 0px 3px 3px";
	Logger.cTableContainer.style.border = "1px solid #667788";
	
	Logger.cContent = document.createElement("table");
	Logger.cContent.id = "logger.content";
	Logger.cContent.width = "100%";

	// update dom
	Logger.cTableContainer.appendChild(Logger.cContent);
	Logger.cRoot.appendChild(Logger.cHeader);
	Logger.cRoot.appendChild(Logger.cHideAndShow);
	Logger.cRoot.appendChild(Logger.cTableContainer);
	document.body.appendChild(Logger.cRoot);
	
	Logger.windowState = LoggerWindowState.VISIBLE;
};

Logger.trace = function(message){
	Logger.log(message, LogLevel.TRACE, arguments.callee.caller.name);
};

Logger.info = function(message){
	Logger.log(message, LogLevel.INFO, arguments.callee.caller.name);
};

Logger.debug = function(message){
	Logger.log(message, LogLevel.DEBUG, arguments.callee.caller.name);
};

Logger.success = function(message){
	Logger.log(message, LogLevel.SUCCESS, arguments.callee.caller.name);
};

Logger.warn = function(message){
	Logger.log(message, LogLevel.WARN, arguments.callee.caller.name);
};

Logger.error = function(message){
	Logger.log(message, LogLevel.ERROR, arguments.callee.caller.name);
};

Logger.log = function(message, level, caller){
	Logger.init();
	var elOutput = Logger.cContent;
	if(elOutput != null){
		if(message == null){
			message = "message is null";
		}
		if(message.length == 0){
			message = " ";
		}
		
		var logColor = "#E1ECF8";
		if(Logger.logs % 2 == 0){
			logColor = "#ECF6FF";
		}
		
		var elContainer = document.createElement("tr");
		elContainer.style.margin = "0";
		elContainer.style.backgroundColor = logColor;
		
		var elFunction = document.createElement("td");
		elFunction.style.padding = "1px 5px 1px 3px";
		elFunction.style.display = "inline-block";
		elFunction.style.fontFamily = "courier";
		elFunction.style.verticalAlign = "top";
		
		var funcName = caller;
		if(funcName != null && funcName.length == 0){
			funcName = "<div style='color: #AAAAAA'>no function name</div>";
		}
		elFunction.innerHTML = funcName;
		
		var col2 = document.createElement("td");
		col2.width = "100%";
		
		var elText = document.createElement("pre");
		elText.style.fontFamily = "courier";
		elText.style.color = level.color;
		elText.style.margin = "0";
		elText.style.display = "inline-block";
		elText.style.padding = "1px 10px 1px 3px";
		elText.innerHTML = message;
		
		col2.appendChild(elText);
		elContainer.appendChild(elFunction);
		elContainer.appendChild(col2);
		elOutput.appendChild(elContainer);
		
		elOutput.scrollTop = elOutput.scrollHeight;
		
		// if output is attached to a dijit content pane, the content pane has to scroll down instead of output
		elOutput.parentNode.scrollTop = elOutput.parentNode.scrollHeight;
		
		Logger.logs++;
	}
};