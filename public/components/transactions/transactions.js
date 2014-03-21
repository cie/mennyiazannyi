

MY_ACCOUNT = "Me";

/**
 * Tell if an account is owned by the user.
 */
app.factory("myAccount", function() {
	return function(acctName) {
                if (!acctName) return false;
		acctName = acctName.toLowerCase();
		if (acctName == MY_ACCOUNT.toLowerCase()) return true;
		for (lang in TRANSLATIONS) {
			var translation = TRANSLATIONS[lang][MY_ACCOUNT];
			if (translation && translation.toLowerCase() === acctName) return true;
		}
		return false;
	}
});


app.directive("transactions", function(){
	return {
		restrict: "E",
		templateUrl: tmpl("transactions"),
		link: function(scope, element, attrs) {
			element.children().first().unwrap();
			scope.element = element;
		},
		controller: function($scope, $firebase, $rootScope, myAccount, $timeout, updateIndex, compileExpression) {

			$rootScope.$watch("expression", function(expression) {
				$scope.transactions = _.filter($rootScope.user.transactions, compileExpression(expression));
			});


			$scope.selectTransaction = function(tr) {
				if ($scope.activeTransaction) {
					$scope.activeTransaction.active = false;
				}
				tr.active = true;
				$scope.activeTransaction = tr;
			};
		
			$scope.newTransaction = {
				date:  new Date().toISOString().substring(0,10),
				from: "",
				to: "",
				sum: "", 
				currency: $rootScope.currency,
				text: "",
				categories: ""
			};
			
			$rootScope.$watch("currency", function(currency) {
				// if no sum entered
				if (!+$scope.newTransaction.sum) {
					$scope.newTransaction.currency = currency;
				}
			});
			
			$scope.addTransaction = function() {
				var t = $scope.newTransaction;
				updateIndex(t);
				$scope.user.$child("transactions").$add({
					date:t.date,
					from:t.from,
					to:t.to,
					 // enable decimal comma, avoid NaNs
					sum: +(""+t.sum).replace(",", ".") || 0,
					currency: t.currency,
					text: t.text,
					categories: t.categories
				}).then(function(id){
					// select new transaction
					$timeout(function() {
						$scope.activeTransaction = id.name();
					},0);
				});
				// keep date as it is
				//this.set('newTransaction.date', new Date().toDateString());
				if (!myAccount(t.from)) $scope.newTransaction.from = "";
				if (!myAccount(t.to))   $scope.newTransaction.to = "";
				$scope.newTransaction.sum = "";
				$scope.newTransaction.currency = $rootScope.currency;
				$scope.newTransaction.text = "";
				$scope.newTransaction.categories = "";
				
				// focus first item in new row
				$("table>tfoot>tr input",$scope.element).first().focus()
				
			};
			 
			$scope.deleteTransaction = function(tr) {
				tr.deleted = true;
			}
			$scope.restoreTransaction = function(tr) {
				tr.deleted = false;
			}
		}
	}
});
	
			/*
			this.userObserver = page.observe("user", function(user, oldValue) {
				if (user && user.uid) {
					this.data.transactions = new Transactions([], {
						firebase: users$.child(user.uid).child("transactions")
					});
				} else {
					this.data.transactions = [];
				}
				this.update();
				
			});
			
			
			
			this.on({
				'moveDown': function(event, direction) {
					console.log(event);
				},
				'addTransaction': function() {
					
				},
				'teardown': function() {
					this.userObserver.cancel();
					this.currencyObserver.cancel();
					
					window.transactions = null;
				} 
			});*/
