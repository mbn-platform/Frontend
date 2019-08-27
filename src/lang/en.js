const en = {
  'yes' : 'Yes',
  'no' : 'No',
  'ok' : 'Ok',
  'message' : 'Message',
  'simpleValue' : '{value}',
  'secretIs' : 'Secret: {secret}',
  'noSuchProfile' : 'No such profile',
  'noDataAboutCurrentRound' : 'No data about current round',
  'theKeyIsInUse' : 'The key is in use',
  'enterConfirmationCode' : 'Enter confirmation code',
  'saveAndConfirmSecretCode' : 'Save and confirm secret code',
  'yourBotSecretTitle' : 'Your Bot Secret Code',
  'saveYourCode' : 'Store the code safely, you will no longer be able to get it.',
  'yourSecretKeyIs' : 'Your secret key is {br}{key}',
  'wrong2FACode' : 'Wrong 2FA code',
  'invalidKeySecretPair' : 'Invalid key/secret pair',
  'invalidEmail' : 'Invalid email',
  'emailVerificationSent' : 'Email verification was sent to your address. Please follow the instructions in the email',
  'tryAgainLater': 'Please try again later',
  'yourApiKeyBalanceIsLowerThatTraderMinimum' : 'Your api key balance is lower that trader\'s minimum contract amount',
  'traderHasChangedContractSettings' : 'Trader has changed contract settings, please reload page',
  'errorInsufficientFunds' : 'Error. Insufficient funds',
  'errorTraderNotAvailable' : 'Error. Trader not available',
  'thisOrderIsAlreadyClosed' : 'this order is already closed',
  'orderNotSupported' : 'This type of order is not supported on that exchange',
  'minTradeRequirementNotMet' : 'Min trade requirement not met',
  'youHaveMadeTooManyOrders' : 'You have made too many orders, please try later',
  'youAreNotAllowedToTradeOnThatMarket' : 'You are not allowed to trade on that market',
  'youCanPlaceOnlyOneOrderAtOnce' : 'You can place only one order at once',
  'serverIsBusyTryAgainLater' : 'Server is busy. Try again later',
  'failedToCancelOrder' : 'failed to cancel order: {order}',
  'failedToPlaceOrder' : 'failed to place order: {order}',
  'orderHasBeenPlaced' : 'Order has been placed',
  'thisKeyAlreadyInSystem' : 'This key already in system',
  'failedToAddApiKey:' : 'failed to add api key: {key}',
  'playImageAlt' : 'Play button',
  'toshiImageAlt' : 'Toshi',
  'ciperImageAlt' : 'Ciper',
  'invalidName' : 'Invalid name',
  'youCannotUseThatName' : 'You cannot use that name, please enter another one',
  'youCannotUseThatAddress' : 'You cannot use that address',
  'youWantEnableStaking': 'Are you sure you want to enable staking for address {address}?',
  'feedbacks' : 'FEEDBACKS',
  'apiKey' : 'API KEY',
  'userTrustToMe' : '{name} trusted to me',
  'userDontGetFeedbacks' : 'This user did not get any feedbacks yet.',
  'pleaseInstallBrowser' : 'Please, install one of these browsers to use',
  'membranaPlatform' : 'Membrana Platform',
  'installTrust' : 'Install Trust',
  'installToshi' : 'Install Toshi',
  'installChiper' : 'Install Chiper',
  'installMetamask' : 'Please, install Metamask',
  'toLoginYouNeedInstallMetamask' : 'To login you need to connect through Chrome or Firefox browsers and install Metamask extension:',
  'whatIsMetamask': 'What is Metamask?',
  'metamaskIs': 'MetaMask is a bridge that allows you to visit the distributed web of tomorrow in your browser today. It allows you to run Ethereum dApps right in your  browser without running a full Ethereum node. MetaMask includes a secure identity vault, providing a user interface to manage your identities on different sites and sign blockchain transactions.',
  'profileLeft': 'profit left to complete:',
  'search': 'Search',
  'rankInRating': 'Rank in traders rating:',
  'returnOnInvestment': 'return on investment (ROI):',
  'percentInUsd': '% in usd',
  'percentInBtc': '% in btc',
  'rankInInvestorsRating': 'Rank in investors rating:',
  'moneyInManagement': 'money in {br} management:',
  'status': 'Status',
  'all': 'All',
  'days': 'days',
  'orImportAccount': 'or import ETH account if you already installed',
  'min': 'min',
  'hours': 'hours',
  'timeLeftToComplete': 'time left to complete:',
  'roiCalculatedBy': 'ROI CALCULATED BY MEMBRANA ANALYSIS SYSTEM',
  'notification.warning': 'Warning',
  'notification.info': 'Attention',
  'notification.details': 'Details',
  'hashlog.blockNumber': 'Block Number',
  'hashlog.blockHash': 'Block Hash',
  'hashlog.prevBlockHash': 'Prev Block Hash',
  'hashlog.title': 'Hashlog',
  'hashlog.hash': 'Hash',
  'hashlog.asJson': 'As JSON',
  'hashlog.titleAction': 'Actions',
  'hashlog.index': 'Index',
  'hashlog.id': 'Id',
  'hashlog.record': 'Record',
  'hashlog.copy': 'Copy',
  'hashlog.actionCount': 'Actions Count',
  'hashlog.createdAt': 'Created At',
  'hashlog.titleBlock': 'Block #{number}',
  'hashlog.titleActions': 'Action',
  'hashlog.blockListNumberTitle': 'Block Number',
  'leaderboard.title': 'LEADERBOARD',
  'leaderboard.global': 'GLOBAL',
  'leaderboard.roundIsNotStartedYet': 'Round {round} is not started yet',
  'leaderboard.round': 'ROUND {count}',
  'leaderboard.selectRound' : 'Select round',
  'leaderboard.place': 'Place',
  'leaderboard.name': 'Name',
  'leaderboard.points': 'Points',
  'leaderboard.searchPlaceholder': 'Search',
  'leaderboard.profitUsd': 'Profit (USDT)',
  'leaderboard.pointCount': 'Point Count',
  'leaderboard.legend': 'Red row indicate that user exceeded max loss. Such users skip next round',
  'leaderboard.infoTitle': 'How many tokens I will earn from postions at the Leaderboard',
  'leaderboard.annotationInfo': 'After each round of the competition, every participant receives Tournament Points according the their weekly ratings. The exact amount of points is shown in the table below. After all rounds of competition those Points will be converted into MBN tokens in rate 1/1000.{br}For example, Alice took 1st position at weekly round. She will earn 100*1000 = 100 000 tokens. {dashedTokens}',
  'leaderboard.txAccepted': 'You will receive contract after verifying your transaction',
  'leaderboard.payContractConditions': 'You can get contract for Trust Management with following conditions:{br} 1) Traders reward: 50%{br}2) Amount: {amount}$ {br}3) Duration: until {expiresAt}{br}4) Max loss: 15%{br}5) Insurance deposit: {deposit}$ {br}{br}To start contract you have to send insurance deposit {deposit}$ in ETH equivalence.{br}Contract will be able to trading right after transaction will be confirmed.{br}{br}After contract finished you will receive back insurance deposit.{br}{attention} if you are not be successful, losses will be covered from insurance deposit.',
  'leaderboard.payContractHeader': 'Information',
  'leaderboard.payContract': 'Pay',
  'leaderboard.cancel': 'Cancel',
  'leaderboard.placeInRating': 'Place In Rating',
  'leaderboard.dashedTokens': '1000 tokens = $20',
  'leaderboard.ifHardcapWillReached': 'if hardcap will reached',
  'leaderboard.profitPercent': 'Profit, %',
  'leaderboard.average': 'Average, %',
  'leaderboard.intro': 'Description',
  'leaderboard.nextRound': 'Next round',
  'leaderboard.nextRoundMessage': 'Please confirm trading in the next round',
  'leaderboard.nextRoundHelp': 'If you don\'t confirm trading, you will skip next round',
  'leaderboard.nextRoundConfirm': 'Confirm',
  'dashboard.namePlaceholder': 'Name',
  'dashboard.secretPlaceholder': 'Secret',
  'dashboard.keyPlaceholder': 'Key',
  'dashboard.addAlert': 'enter keyname and key value, select exchange',
  'dashboard.total': 'Total',
  'dashboard.apiBotCurrencies': 'Api Bot Currencies',
  'dashboard.createdAt': 'Created At',
  'dashboard.activeAt': 'Active At',
  'dashboard.deletedAt': 'Deleted At',
  'dashboard.available': 'Available',
  'dashboard.exchangeKey': 'Exchange Key',
  'dashboard.apiBotKeys': 'Api Bot Keys',
  'dashboard.activeKeys': 'Active Keys',
  'dashboard.deletedKeys': 'Deleted Keys',
  'dashboard.currency': 'Currency',
  'dashboard.label': 'Label',
  'dashboard.addBotAlert': 'enter label and select key',
  'dashboard.name': 'Name',
  'dashboard.trusted': 'Trusted',
  'dashboard.apiKeyCurrencies': 'Api Key currencies',
  'dashboard.availableCurrencies': 'Available currencies',
  'dashboard.contractCurrencies': 'Contract currencies',
  'dashboard.exchangeAccounts': 'Exchange accounts',
  'dashboard.trustedTo': 'Trusted to {name}',
  'dashboard.trustedToMe': '{name} trusted to me',
  'dashboard.balance': 'Balance',
  'dashboard.exchange': 'Exchange',
  'dashboard.rateTheContract': 'Rate the contract',
  'dashboard.showAll': 'Show all',
  'dashboard.contracts': 'Contracts',
  'dashboard.finishedAt': 'Finished at',
  'dashboard.expireDate': 'Expire date',
  'dashboard.contractor': 'Contractor',
  'dashboard.currentProfitPercent': 'Current\nprofit, %',
  'dashboard.maxLossPercent': 'Max\nloss, %',
  'dashboard.startBalance': 'Start\nbalance',
  'dashboard.currentBalance': 'Current\nbalance',
  'dashboard.targetBalance': 'Target\nbalance',
  'dashboard.feePercent': 'Fee, %',
  'dashboard.status': 'Status',
  'dashboard.completed': 'completed',
  'dashboard.inProgress': 'in progress',
  'dashboard.deleteConfirm': 'Do you want to delete this key?',
  'dashboard.failed': 'failed',
  'dashboard.tx': 'TX',
  'dashboard.requestList': 'Request list',
  'dashboard.availableAssets': 'AVAILABLE ASSETS',
  'dashboard.acceptRequestQuestion': 'accept this request?',
  'dashboard.cancelRequestQuestion': 'Cancel this request?',
  'dashboard.from': 'From',
  'dashboard.rateFirst': 'Rate first',
  'dashboard.commentMustBeOver': 'Comment must me at least 10 characters long',
  'dashboard.to': 'To',
  'dashboard.time': 'Time',
  'dashboard.sum': 'Sum',
  'dashboard.awaitingPayment': 'awaiting payment',
  'dashboard.pay': 'pay',
  'dashboard.contractCurrenciesUpper': 'CONTRACT CURRENCIES',
  'dashboard.cannotDeleteKey': 'cannot delete key - key is in use',
  'dashboard.linkToEtherscanTooltip': 'This is a link on etherscan.io which contains all details of your contract',
  'orders.orders' : 'Orders',
  'orders.openOrders' : 'Open Orders',
  'orders.completedOrders' : 'Completed orders',
  'orders.openDate' : 'Opened Date',
  'orders.market' : ' Market',
  'orders.unitsFilled' : 'Units Filled',
  'orders.unitsTotal' : 'Units Total',
  'orders.estimated' : 'Estimated ',
  'orders.est' : 'Est.',
  'orders.total' : 'Total',
  'profile.contractDetails' : 'Contract Details',
  'profile.securitySettings' : 'Security settings',
  'profile.notificationSettings' : 'Notifications',
  'profile.about' : 'About',
  'profile.durationOfContract' : 'Duration of contract',
  'profile.enable2FA' : 'Enable 2FA',
  'profile.durationOfContractInDetails' : 'Duration of contract:',
  'profile.currencyOfContractInDetails' : 'CURRENCY OF CONTRACT:',
  'profile.currencyOfContract' : 'CURRENCY OF CONTRACT:',
  'profile.minContractAmount' : 'Min contract amount:',
  'profile.targetProfit' : 'TARGET PROFIT',
  'profile.targetProfitInDetails' : 'TARGET PROFIT:',
  'profile.maxLoss' : 'Max loss',
  'profile.maxLossInDetails' : 'Max loss:',
  'profile.fee' : 'Fee',
  'profile.feeInDetails' : 'Fee:',
  'profile.sendRequest' : 'INVEST NOW',
  'profile.yourRequestWillBe' : 'YOUR REQUEST WILL BE',
  'profile.or' : 'OR',
  'profile.contractCurrentProfit' : 'Profit per current contract:',
  'profile.accepted' : ' ACCEPTED ',
  'profile.declined' : ' DECLINED ',
  'profile.within24h' : 'WITHIN 24H',
  'profile.acceptOrDeclineRequest' : 'YOUR REQUEST WILL BE ACCEPTED OR DECLINED WITHIN 24H',
  'profile.requestHasBeenSent' : 'Your request has been sent!',
  'profile.willGetAnswer' : 'You will get an answer within 24h.',
  'profile.gotIt': 'GOT IT',
  'profile.acceptRequestQuestion' : 'ACCEPT REQUESTS?',
  'profile.contractSettings' : 'Contract settings',
  'profile.toChangeYouProfileMessage' : 'To change your profile please accept or decline all offers in your dashboard',
  'profile.cancel' : 'CANCEL',
  'profile.saveChanges' : 'SAVE CHANGES',
  'profile.edit' : 'EDIT',
  'profile.enterSetting' : 'Enter all contract settings',
  'profile.needEditFirst' : 'You need to edit your contract settings first',
  'profile.currencyPreferences' : 'CURRENCY PREFERENCES',
  'profile.chooseYourCurrenciesByClick' : 'Choose your preferred currencies by clicking on',
  'profile.chooseYourCurrenciesWithBr' : 'Currencies preferred {br} by trader',
  'profile.underConstruction' : 'Under construction',
  'profile.currency' : 'Currency',
  'profile.tradeVolume' : 'Trade volume',
  'profile.chooseYourCurrencies' : 'Choose your preferred currencies',
  'profile.currenciesPreferredByTrader' : 'Currencies preferred by trader',
  'profile.chart' : 'Chart',
  'profile.comments' : 'Comments',
  'profile.acceptingRequests' : 'accepting requests',
  'profile.notAcceptingRequests' : 'not Accepting requests',
  'profile.profitChart' : 'PROFITABILITY PER CONTRACT UNDER MANAGEMENT',
  'profile.balanceChart' : 'ASSETS UNDER MANAGEMENT',
  'profile.profitAsTrader' : 'PROFIT AS TRADER',
  'profile.chooseFunds' : 'choose funds',
  'profile.next' : 'NEXT',
  'profile.tradeHistory': 'TRADE HISTORY',
  'profile.fundName' : 'Fund name',
  'profile.balance' : 'Balance',
  'profile.exchange' : 'Exchange',
  'profile.selectKeyFirst' : 'select api key first',
  'profile.shouldByAlwaysAvailable' : 'BTC/ETH/USDT should be always available for trading',
  'profile.enterContractAmount' : 'ENTER CONTRACT AMOUNT',
  'profile.back' : 'BACK',
  'profile.selectTradingCurrencies' : 'SELECT TRADING CURRENCIES',
  'profile.send' : 'SEND',
  'profile.date' : 'Date',
  'profile.type' : 'Type',
  'profile.price' : 'Price',
  'profile.amount' : 'Amount',
  'profile.total' : 'Total',
  'profile.tx' : 'TX',
  'ratings.bestInvestor' : 'All the time best investor',
  'ratings.toBeDetermined' : 'to be determined',
  'ratings.roiPercent' : 'ROI, %',
  'ratings.bestInvestorOfYear' : 'Best investor of {year}',
  'ratings.minContractAmount' : 'Min contract{br}amount',
  'ratings.bestInvestorQuart' : 'Best investor of quart',
  'ratings.bestInvestorOfMonth' : 'Best investor of {month}',
  'ratings.allTheTimeBestTrader' : 'All the time best trader',
  'ratings.ratings' : 'RATINGS',
  'ratings.traders' : 'Traders',
  'ratings.investors' : 'Investors',
  'ratings.name' : 'Name',
  'ratings.rank' : 'Rank',
  'ratings.roi' : 'ROI, %',
  'ratings.startedSince' : 'Started {br}since',
  'ratings.dur' : 'Dur.,',
  'ratings.days' : 'days',
  'ratings.fee' : 'Fee, %',
  'ratings.moneyInManagement' : 'Money in management',
  'ratings.maxLoss' : 'Max loss, %',
  'ratings.search' : 'Search',
  'ratings.amountOfContracts' : 'The total amount of contracts',
  'ratings.amountOfFinishedContracts' : 'The amount of successfully finished contracts',
  'ratings.paidExcess' : 'Paid excess{br}profit',
  'ratings.amountOfPaid' : 'Amount of paid invoices',
  'terminal.placeOrder.limit': 'Limit',
  'terminal.placeOrder.stop-limit': 'Stop-limit',
  'terminal.placeOrder.price': 'Price:',
  'terminal.placeOrder.total': 'Total:',
  'terminal.placeOrder.stopPrice': 'Stop Price:',
  'terminal.placeOrder.amount': 'Amount:',
  'terminal.charts.tradingView': 'Trading View',
  'terminal.charts.marketDepth': 'Market Depth',
  'terminal.price': 'Price ',
  'terminal.priceForTable': 'Price ',
  'terminal.totalVolume' : 'Total volume: ',
  'terminal.amount' : 'Amount ',
  'terminal.marketDepth' : 'Market Depth',
  'terminal.hideZeros' : 'Hide zeros ',
  'terminal.search' : 'search...',
  'terminal.currency' : 'Currency ',
  'terminal.volumeCurrency': 'Volume({baseCurrency}) ',
  'terminal.change': 'Change',
  'terminal.balance': 'Balance ({baseCurrency}) ',
  'terminal.balance-mobile': 'Balance',
  'terminal.openOrders': 'Open Orders ',
  'terminal.completedOrders': 'Completed orders ',
  'terminal.type': 'Type ',
  'terminal.unitsFilled': 'Units Filled ',
  'terminal.unitsTotal': 'Units Total ',
  'terminal.total': 'Total ',
  'terminal.est': 'Est. ',
  'terminal.orderBook': 'Order Book',
  'terminal.resetSort': 'Reset sort',
  'terminal.ask': 'Ask ',
  'terminal.size': 'Size ',
  'terminal.bid': 'Bid ',
  'terminal.selectFund': 'select fund',
  'terminal.buy': 'Buy ',
  'terminal.sell': 'Sell ',
  'terminal.orderSize': 'Order size ({secondary}) ',
  'terminal.orderType': 'Order type ',
  'terminal.orderTypeLimit': 'Limit',
  'terminal.orderTypeTrigger': 'Trigger Limit',
  'terminal.triggerPrice': 'Trigger Price',
  'terminal.amountLabel': 'Amount ({amount}) ',
  'terminal.recentTrades': 'Recent Trades' ,
  'terminal.priceRecent': 'Price ({base}) ',
  'terminal.secondary': '({secondary}) ',
  'terminal.time': 'Time ',
  'terminal.orders.openOrders': 'Open Orders',
  'terminal.orders.closedOrders': 'Closed Orders',
  'terminal.orders.balances': 'Balances',
  'modal.error': 'Error',
  'modal.error.useYourAddress': 'You have to use your address associated with your Membrana account',
  'modal.error.deniedContractPay': 'You have rejected transaction, contract is not booked',
  'modal.error.contractNotAvailable': 'This contract is no more available',
  'modal.success': 'Success',
  'contactVerified': 'This contact is already added',
  'telegramConfirmCode': 'Your code is {code}. Go to {link} and enter',
  'help-stop-limit-order': 'Stop-limit orders are triggered when pair price reaches stop price. In that case a limit order is placed. Such orders don\'t block your available balance',
  'staking.title': 'Staking',

};

export default en;
