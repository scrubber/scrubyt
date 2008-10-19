
//trims the leading and trailing blanks from a given string 
function Trim(strToTrim){
	while(strToTrim.charAt(0)==' '){	
		strToTrim = strToTrim.substring(1,strToTrim.length);
	}
	while(strToTrim.charAt(strToTrim.length-1)==' '){	
		strToTrim = strToTrim.substring(0,strToTrim.length-1);
	}
	return strToTrim;
}

/*
Validates the e-mail address from an input.
The parameter is the input object, in format: document.formName.inputName.
*/
function ValidateEmailAddress(objEmail) {
	var strEmail = Trim(objEmail.value);
	if (strEmail == ""){
		alert("Please fill in the E-mail field.");
		objEmail.focus();
		return false;
	} else {
		// checking "@" character:
		if (strEmail.indexOf("@")==-1) {
			alert("Error:\nE-mail field must contain @ character for an e-mail address.");
			objEmail.focus();
			return false;

		} else {
			// "@" cannot be the first character:
			if (strEmail.indexOf("@")==0) {
				alert("Error:\n@ cannot be the first character for an e-mail address.");
				objEmail.focus();
				return false;
			} else {
				// Caracterul "@" sa nu fie ultimul:
				if (strEmail.lastIndexOf("@") == strEmail.length-1) {
					alert("Error:\n@ cannot be the last character for an e-mail address.");
					objEmail.focus();
					return false;
				}
			}
			
			// "@" can appear only once:
			var emailSplited=strEmail.split("@");
			if (emailSplited.length>2) {
				alert("Error:\n@ can be appear only once for an e-mail address.");
				objEmail.focus();
				return false;
			}
			
			// "." must be present:
			if (strEmail.indexOf(".")==-1) {
				alert("Error:\nCharacter . must appear at least once for an e-mail address.");
				objEmail.focus();
				return false;
			} else {
				// "." cannot be the first character:
				if (strEmail.indexOf(".")==0) {
					alert("Error:\nCharacter . cannot be the first for an e-mail address.");
					objEmail.focus();
					return false;
				} else {
					// "." cannot be the last character:
					if (strEmail.lastIndexOf(".")==strEmail.length-1) {
						alert("Error:\nCharacter . cannot be the last for an e-mail address.");
						objEmail.focus();
						return false;
					}
				}
				
				// "." cannot appear one after another.
				if (strEmail.indexOf("..")>-1) {
					alert("Error:\nInvalid e-mail address.");
					objEmail.focus();
					return false;
				}
				
				// "@." or ".@" cannot appear:
				if ((strEmail.indexOf("@.")>-1) || (strEmail.indexOf(".@")>-1)) {
					alert("Error:\nInvalid e-mail address.");
					objEmail.focus();
					return false;
				}
				
				// Sa nu contina alte caractere decat litere (mari si mici), cifre, @ , . , - si _
				var carValide=new String("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.-_");
				var carEmail=new String("");
				for (var i=0; i<strEmail.length; i++) {
					carEmail = "" + strEmail.substring(i, i+1);
					if (carValide.indexOf(carEmail) == "-1") {
						alert("Error:\nInvalid e-mail address.\nPlease use only digits, letters,  _   .  -");
						objEmail.focus();
						return false;
					}
				}
			}
		}
	}
	return true;
}

var headerHeight = 168;
var footerHeight = 60;
var nsFix = 0;

function GetTDHeight(){
	if (ns6){
		contHeight = window.innerHeight - headerHeight - footerHeight - 8;
	} else if (ns){
		contHeight = window.innerHeight - headerHeight - footerHeight - 8 - nsFix;
	} else {
		contHeight = document.body.clientHeight - headerHeight - footerHeight - 8;
	}
	document.write("<TD height=" + contHeight + " valign=top>");
}

function GetTableHeight(){
	if (ns6){
		contHeight = window.innerHeight - headerHeight - footerHeight - 312;
	} else if (ns){
		contHeight = window.innerHeight - headerHeight - footerHeight - 93 - nsFix;
	} else {
		contHeight = document.body.clientHeight - headerHeight - footerHeight;
	}
	document.write("<TABLE width=650 cellspacing=0 cellpadding=0 border=0 height=" + contHeight + ">");
}



//-->