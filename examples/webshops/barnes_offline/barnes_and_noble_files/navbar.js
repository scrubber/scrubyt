var vc_total_qty = 0;
var vc_total_price = 0;

function visualcart_formatMoney(value) {
	value -= 0;
	value = (Math.round(value * 100)) / 100;
	return((value == Math.floor(value)) ? ("$" + value + '.00') : ((value * 10 == Math.floor(value * 10)) ? ("$" + value + '0') : ("$" + value)));
	}

function visualcart_WriteVCartTotal () {
	document.write((vc_total_qty > 0) ? vc_total_qty : "0");
	document.write((vc_total_qty == 1) ? " Item" : " Items");
	if ((vc_total_qty > 0) && (vc_total_price.length > 0)) {
		document.write(" : " + vc_total_price + "");
		}
	}

for (i = 0; i < document.cookie.split("; ").length; ++i) {
	if (document.cookie.split("; ")[i].split("=", 1) == "visualcart") {
		vcCookie = unescape(document.cookie.split("; ")[i].substr(11));
		for (j = 0; j < vcCookie.split("&").length; ++j) {
			switch (vcCookie.split("&")[j].split("=")[0]) {
				case "subtotal" :
					if (vcCookie.split("&")[j].split("=")[1] > 0) {
						vc_total_price = visualcart_formatMoney(vcCookie.split("&")[j].split("=")[1]);
						}
					break;
				case "qtytotal" :
					vc_total_qty = vcCookie.split("&")[j].split("=")[1];
					break;
				}
			}
		}
	}
