javascript:(function() {
	var amount, date, comment, party, $amount, $date, $comment, $party, dateFormat,
		currency, myAccount;
	function start() {
		if (!confirm("First, click on a payment amount."))
			return;
		$(document.body).one("click", selectAmount);
	}
	function selectAmount(event) {
		event.preventDefault();
		$amount = $(event.target);
		amount = $amount.text();
		if (!confirm("You selected " + amount)) {
			$(document.body).one("click", selectAmount);
		} else {
			if (!confirm("Cool. Now select this payment's date."))
				return;
			$(document.body).one("click", selectDate);
		}
	}
	function selectDate(event) {
		event.preventDefault();
		// $ after elements means sure
		var YY = "([0-9]{4}|[0-9]{2})", MM = "(0?[1-9]|1[012])", DD = "(0?[1-9]|[12][0-9]|3[01])", YY$ = "([0-9]{4}|3[2-9]|[4-9][0-9])", DD$ = "(1[3-9]|2[0-9]|3[01])",
		// delimiters (begin, separator, end)
		$_ = "^", __ = "[^0-9]+";
		_$ = "[^0-9]*$";
		var dateFormats = {
			'ymd' : function(date) {
				var m = new RegExp($_ + YY + __ + MM + __ + DD + _$).exec(date);
				if (!m)
					return "";
				return new Date(m[1] + "-" + m[2] + "-" + m[3]);
			},
			'mdy' : function(date) {
				var m = new RegExp($_ + MM + __ + DD + __ + YY + _$).exec(date);
				if (!m)
					return "";
				return new Date(m[3] + "-" + m[1] + "-" + m[2]);
			},
			'dmy' : function(date) {
				var m = new RegExp($_ + DD + __ + MM + __ + YY + _$).exec(date);
				if (!m)
					return "";
				return new Date(m[3] + "-" + m[2] + "-" + m[1]);
			}
		}
		function guessDateFormat(date) {
			if (new RegExp($_ + YY$ + __ + MM + __ + DD + _$).test(date))
				return dateFormats.ymd;
			if (new RegExp($_ + MM + __ + DD$ + __ + YY$ + _$).test(date))
				return dateFormats.mdy;
			if (new RegExp($_ + DD$ + __ + MM + __ + YY$ + _$).test(date))
				return dateFormats.dmy;
		}
		function parseDateFormat(dateFormatString) {
			return dateFormats[dateFormatString.trim().toLowerCase()];
		}
		$date = $(event.target);
		date = $date.text();
		if (!confirm("You selected " + date)) {
			$(document.body).one("click", selectAmount);
		} else {
			try {
				dateFormat = guessDateFormat(date);
				while (!dateFormat) {
					dateFormatString = prompt(
							"Well... I can't really interpret this date ("
									+ date
									+ "). Is it"
									+ " mdy, dmy or ymd (what combination of years, months and days)?",
							"dmy");
					if (!dateFormatString)
						return;
					dateFormat = parseDateFormat(dateFormatString);
				}
				alert("OK. This means that this date is "
						+ dateFormat(date).toDateString());
				if (!confirm("OK. Now select this payment's other party."))
					return;
				$(document.body).one("click", selectParty);
			} catch (e) {
				alert(e);
			}
		}
	}
	function selectParty(event) {
		event.preventDefault();
		$party = $(event.target);
		party = $party.text();
		if (!confirm("You selected " + party)) {
			$(document.body).one("click", selectAmount);
		} else {
			if (!confirm("OK. Now select this payment's description."))
				return;
			$(document.body).one("click", selectComment);
		}
	}
	function selectComment(event) {
		event.preventDefault();
		$comment = $(event.target);
		comment = $comment.text();
		if (!confirm("You selected " + comment)) {
			$(document.body).one("click", selectAmount);
		} else {
			findTransactions();
		}
	}
	function findTransactions() {
		try {
			if (!(currency = prompt(
					"OK, what is your currency? (Please enter 3-letter code like EUR, USD, etc.)",
					"HUF")))
				return;
			

			// find common ancestor
			// http://stackoverflow.com/questions/3960843/how-to-find-the-nearest-common-ancestors-of-two-or-more-nodes
			var $trans = $amount.parents().has($party).has($comment).has($date)
					.first();

			function createSelector($elem, until, matchChildIndex) {
				function childIndexSelector(e) {
					return ":nth-child("
							+ (1 + $(e).parent().children(e.nodeName).index(e))
							+ ")";
				}
				var sel = $elem.parentsUntil(until).map(function() {
					if (matchChildIndex) {
						return this.nodeName + childIndexSelector(this)
					} else {
						return this.nodeName;
					}
				}).get().reverse().join(">");
				if (sel) {
					sel = ">" + sel
				}
				sel = sel + ">" + $elem[0].nodeName;
				if (matchChildIndex) {
					sel = sel + childIndexSelector($elem[0]);
				}
				return sel;
			}

			// create selector for $trans
			transSelector = createSelector($trans, "body", false);

			// find selectors for data fields
			amountSelector = createSelector($amount, $trans, true);
			dateSelector = createSelector($date, $trans, true);
			partySelector = createSelector($party, $trans, true);
			commentSelector = createSelector($comment, $trans, true);
			
			if (!(myAccount = prompt(
					"What is the name of your account (to write in the From/To field) (e.g. 'me' or 'bank account')",
					"Me")))
				return;
			
			var sumFormat = function(sum) {
				// XXX dirty hacking
				if (sum.match(/,[0-9]{2}$/)) {
					sum = sum.replace(/\./, '');
					sum = sum.replace(/,/, '.');
				} else {
					sum = sum.replace(/,/, '');
				}
				return +sum;
			}
			

			var transactions = $(transSelector, document.body).map(
					function() {
						return {
							sum: sumFormat($(amountSelector, this).text().trim()),
							currency: currency,
							date: dateFormat($(dateSelector, this).text()
									.trim()),
							from: $(partySelector, this).text().trim(),
							to: myAccount,
							comment: $(commentSelector, this).text().trim()
						}
					}
			).get();

			var foundNegative = false;
			$.each(transactions, function(e){
				if (this.sum < 0) {
					foundNegative = true;
				}
			});
			function swap(e) {
				var t = e.from;
				e.from = e.to;
				e.to = t;
			}
			if (!foundNegative) {
				var mode;
				while (!(mode === 'e' || mode === 'i')) {
					mode = prompt(
							"All amounts are positive. Are these incomes (i) or expenses (e)?",
							"e");
					if (mode === null) return;
					mode = mode.toLowerCase().trim()
							
				}
				if (mode === 'e') {
					$.each(transactions, function() {
						swap(this);
					});
				} else if (mode === 'i') {
				} else {
					alert("Uhh?");
				}
			} else {
				$.each(transactions, function(e) {
					if (this.sum < 0) { 
						swap(this);
						this.sum = -this.sum;
					}
				})
			}
			var fields = "date,from,to,sum,currency,comment,categories".split(",")
			transactions = transactions.filter(function(tr){
				return tr.date && tr.sum;
			});
			alert("OK, we are done. Copy and paste this text back to MennyiaZannyi:\n\n" 
					+fields.join(",") + "\n"+
					transactions.map(function(tr) {
						return $.map([(tr.date ? tr.date.toISOString() : ""),
						        tr.from,
						        tr.to,
						        tr.sum,
						        tr.currency,
						        tr.comment,
						        ""], function(f) {
							return JSON.stringify(f);
						}).join(",");
					}).join("\n"));

		} catch (e) {
			alert(e);
		}
	}
	start();
})()