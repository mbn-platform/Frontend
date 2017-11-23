import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from './HeaderStatus';

class Terminal extends React.Component {

  render() {
    return (
      <Container fluid className="terminal">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <HeaderStatus />
            <div className="terminal-main" dangerouslySetInnerHTML={{__html: html}} />
          </Col>
        </Row>
      </Container>
    );
}
}

export default Terminal;

const html = `
					<div class="row dropdowns">
						<div class="dropdown-link-wrap">
							<a href="#" class="dropdown-link">API KEY <span class="arrow_down"></span></a>
							<div class="dropdown">
								<div class="dropdown__name">
									<span>API KEY</span>
								  <span class="arrow_down"></span>
							 	</div>
								<div class="key">234hgerhg7y924rt318r1t2</div>
								<div class="key">rsogojrpej593yh3jh059hu</div>
								<div class="key">dfpjg934t0g9g3j3pvd;kg3</div>
							</div>
						</div>

						<div class="dropdown-link-wrap">
							<a href="#" class="dropdown-link">BITTREX <span class="arrow_down"></span></a>
							<div class="dropdown exchange">
								<div class="dropdown__name">
									<span>BITTREX</span>
								  <span class="arrow_down"></span>
							 	</div>
								<div class="exchange__switch">Poloniex</div>
								<div class="exchange__switch">Bitfinex</div>
								<div class="exchange__switch active">BITTREX</div>
							</div>
						</div>

						<div class="dropdown-link-wrap">
							<a href="#" class="dropdown-link js-dropdown-table-link">BTC/ETH <span class="arrow_down"></span></a>
							<div class="dropdown search">
								<div class="dropdown__name">
									<span>BTC/ETH</span>
								  <span class="arrow_down"></span>
							 	</div>
								<form action="" class="dropdown__form">
									<input type="text" name="" class="input-search" placeholder="Search...">
								</form>
								<div class="dropdown__btn-wrap">
									<button class="dropdown__btn active">BTC</button>
									<button class="dropdown__btn">ETH</button>
									<button class="dropdown__btn">USD</button>
								</div>

								<div class="dropdown-table-wrapper js-dropdown-table-wrapper">
									<table class="table">
										<thead>
											<tr>
												<th>Currency <span class="icon icon-dir icon-down-dir"></span></th>
												<th>Price <span class="icon icon-dir icon-down-dir"></span></th>
												<th>Volume <span class="icon icon-dir icon-down-dir"></span></th>
												<th>Change <span class="icon icon-dir icon-down-dir"></span></th>
											</tr>
										</thead>
										<tbody>
											<tr class="down">
												<td>ETH</td>
												<td>0.15</td>
												<td>100000.86</td>
												<td>-1.12</td>
											</tr>
											<tr class="down">
												<td>XPR</td>
												<td>6</td>
												<td>9843.86</td>
												<td>-1.12</td>
											</tr>
											<tr class="up">
												<td>BCH</td>
												<td>0.15</td>
												<td>100000.86</td>
												<td>+21</td>
											</tr>
											<tr class="down">
												<td>STR</td>
												<td>2</td>
												<td>100000.86</td>
												<td>-2</td>
											</tr>
											<tr class="down">
												<td>ETH</td>
												<td>0.14</td>
												<td>9843.86</td>
												<td>-1.12</td>
											</tr>
											<tr class="up">
												<td>BCH</td>
												<td>0.15</td>
												<td>100000.86</td>
												<td>+21</td>
											</tr>
											<tr class="up">
												<td>BCH</td>
												<td>0.25</td>
												<td>100000.86</td>
												<td>+21</td>
											</tr>
											<tr class="down">
												<td>ETH</td>
												<td>0.14</td>
												<td>9843.86</td>
												<td>-1.12</td>
											</tr>
											<tr class="down">
												<td>ETH</td>
												<td>0.14</td>
												<td>9843.86</td>
												<td>-1.12</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>

						<div class="dropdown-link-wrap">
							<a href="#" class="dropdown-link">1H <span class="arrow_down"></span></a>
							<div class="dropdown time">
								<div class="dropdown__name">
									<span>1h</span>
								  <span class="arrow_down"></span>
							 	</div>
								<div class="time__switch">1 min</div>
								<div class="time__switch">30 min</div>
								<div class="time__switch active">1 h</div>
								<div class="time__switch">4 h</div>
								<div class="time__switch">12 h</div>
								<div class="time__switch">1 d</div>
								<div class="time__switch">1 w</div>
							</div>
						</div>
					</div>
					<div class="row charts">
						<div class="charts__left col-12 col-sm-12 col-md-6 col-lg-8">
							<!-- <div class="container-fuild h-100">

							</div>
							 -->
							<div class="price-chart chart col-12">
								<div class="price-chart__top justify-content-between row col-12">
									<!-- <div class="price-chart__indicators row col-11 ">
										<div class="price-chart__name">(BTC/ETH)</div>
										<div class="indicator">
											<div class="indicator-name">O</div>
											<div class="indicator-val">150.58</div>
										</div>
										<div class="indicator">
											<div class="indicator-name">O</div>
											<div class="indicator-val">150.58</div>
										</div>
										<div class="indicator">
											<div class="indicator-name">H</div>
											<div class="indicator-val">152.58</div>
										</div>
										<div class="indicator">
											<div class="indicator-name">L</div>
											<div class="indicator-val">149.58</div>
										</div>
										<div class="indicator">
											<div class="indicator-name">C</div>
											<div class="indicator-val">152.58</div>
										</div>
										<div class="volume"> Volume (false,20)</div>
										<div class="total">21.123M n/a</div>
										<div class="price-chart__status"> <span class="round"> </span>Closed</div>
									</div> -->

										<div class="chart-controls align-items-center justify-content-between row">
											<div class="control-resize"></div>
											<div class="control-dash"></div>
										</div>
								</div>
								<div class="price-chart__graph row col-12">
								</div>
							</div>
							<div class="marketdepth-chart chart col-12">
								<div class="chart__top justify-content-between row">
									<!-- <div class="chart-name">Market Depth</div> -->
									<div class="chart-controls align-items-center justify-content-between row">
											<div class="control-resize"></div>
											<div class="control-dash"></div>
									</div>
								</div>
								<div class="marketdepth-chart__graph row col-12">
								</div>
							</div>
							<div class="row justify-content-between">
								<div class="buysell col-12 col-sm-6 col-md-12">
									<div class="buysell__top justify-content-between row col-12">
											<div class="buysell__switch-wrap ">
												<a href='#' class="buysell__switch switch-buy active">
													BUY
													<span class="val">0.210</span>
												</a>
												<a href='#' class="buysell__switch switch-sell">
													SELL
													<span class="val">0.222</span>
												</a>

											</div>
											<div class="chart-controls align-items-center justify-content-between row">
													<div class="control-resize"></div>
													<div class="control-dash"></div>
											</div>
									</div>
									<div class="buysell__main">
										<div class="buysell__main-tab buy active">
											<form action="#" class="buysell__form" id="buy">
												<div class="buysell__form-row">
													<div class="buysell__form-input-wrap">
														<label class="buysell__form-label">
															Order size (ETH)
														</label>
														<input type="number" name='ordersize' class="buysell__form-input">
													</div>
													<div class="buysell__form-input-wrap">
														<label class="buysell__form-label">
															Price
														</label>
														<input type="number" name='Price' class="buysell__form-input">
													</div>
												</div>
												<div class="buysell__form-row">
													<div class="buysell__form-input-wrap">
														<label class="buysell__form-label">
															Amount (BTC)
														</label>
														<input type="number" name='Amout' class="buysell__form-input">
													</div>
													<button class="buysell__form-submit"> Place order</button>
												</div>
											</form>
										</div>
										<div class="buysell__main-tab sell">
											<form action="#" class="buysell__form" id="sell">
												<div class="buysell__form-row">
													<div class="buysell__form-input-wrap">
														<label class="buysell__form-label">
															Order size (ETH)
														</label>
														<input type="number" name='ordersize' class="buysell__form-input">
													</div>
													<div class="buysell__form-input-wrap">
														<label class="buysell__form-label">
															Price
														</label>
														<input type="number" name='Price' class="buysell__form-input">
													</div>
												</div>
												<div class="buysell__form-row">
													<div class="buysell__form-input-wrap">
														<label class="buysell__form-label">
															Amount (BTC)
														</label>
														<input type="number" name='Amout' class="buysell__form-input">
													</div>
													<button class="buysell__form-submit"> Place order</button>
												</div>
											</form>
										</div>

									</div>
								</div>
								<div class="orders-table chart col-12 col-sm-6 col-md-12 col-lg-6">
									<div class="orders-table__top justify-content-between row col-12">
											<div class="orders-table__switch-wrap ">
												<a href='#' class="orders-table__switch orders-open active">
													Open Orders
												</a>
												<a href='#' class="orders-table__switch orders-completed ">
													Completed orders
												</a>
											</div>
											<div class="chart-controls align-items-center justify-content-between row">
													<div class="control-resize"></div>
													<div class="control-dash"></div>
											</div>
									</div>
									<div class="orders-table-tabs">
											<div class="orders-table-tab orders-open active">

												<div class="orders-table-wrapper js-table-wrapper">
													<table class="table">
														<thead>
															<tr>
																<th>
																	<div>Market <span class="icon-dir icon-down-dir"></span></div>
																</th>
																<th>
																	<div>Type <span class="icon-dir icon-down-dir"></span></div>
																</th>
																<th>
																	<div>Opened Date <span class="icon-dir icon-down-dir"></span></div>
																</th>
																<th>
																	<div>Price <span class="icon-dir icon-down-dir"></span></div>
																</th>
																<th>
																	<div>Units Filed <span class="icon-dir icon-down-dir"></span></div>
																</th>
																<th></th>
															</tr>
														</thead>
														<tbody>
															<tr class='buy'>
                                <td>ETH/BTC</td>
																<td>
																	<span class="round"></span>
																	Buy(LO)
																</td>
																<td>11.21.2017</td>
																<td>0.15646245</td>
																<td>0.00</td>
																<td class="action-cell"><span class="remove"></span></td>
															</tr>
															<tr class='sell'>
                                <td>ETH/BTC</td>
																<td>
																	<span class="round"></span>
																	Sell(LO)
																</td>
																<td>11.21.2017</td>
																<td>0.15646245</td>
																<td>0.00</td>
																<td class="action-cell"><span class="remove"></span></td>
															</tr>
															<tr class='buy'>
                                <td>ETH/BTC</td>
																<td>
																	<span class="round"></span>
																	Buy(LO)
																</td>
																<td>11.21.2017</td>
																<td>0.15646245</td>
																<td>0.00</td>
																<td class="action-cell"><span class="remove"></span></td>
															</tr>
															<tr class='sell'>
                                <td>ETH/BTC</td>
																<td>
																	<span class="round"></span>
																	Sell(LO)
																</td>
																<td>11.21.2017</td>
																<td>0.15646245</td>
																<td>0.00</td>
																<td class="action-cell"><span class="remove"></span></td>
															</tr>
															<tr class='buy'>
                                <td>ETH/BTC</td>
																<td>
																	<span class="round"></span>
																	Buy(LO)
																</td>
																<td>11.21.2017</td>
																<td>0.15646245</td>
																<td>0.00</td>
																<td class="action-cell"><span class="remove"></span></td>
															</tr>
															<tr class='sell'>
                                <td>ETH/BTC</td>
																<td>
																	<span class="round"></span>
																	Sell(LO)
																</td>
																<td>11.21.2017</td>
																<td>0.15646245</td>
																<td>0.00</td>
																<td class="action-cell"><span class="remove"></span></td>
															</tr>
															<tr class='sell'>
                                <td>ETH/BTC</td>
																<td>
																	<span class="round"></span>
																	Sell(LO)
																</td>
																<td>11.21.2017</td>
																<td>0.15646245</td>
																<td>0.00</td>
																<td class="action-cell"><span class="remove"></span></td>
															</tr>
															<tr class='sell'>
                                <td>ETH/BTC</td>
																<td>
																	<span class="round"></span>
																	Sell(LO)
																</td>
																<td>11.21.2017</td>
																<td>0.15646245</td>
																<td>0.00</td>
																<td class="action-cell"><span class="remove"></span></td>
															</tr>

														</tbody>
													</table>
												</div>

											</div>
										<div class="orders-table-tab orders-completed">

											<div class="orders-table-wrapper js-table-wrapper">
												<table class="table">
													<thead>
														<tr>
															<th>
																<div>Market <span class="icon-dir icon-down-dir"></span></div>
															</th>
															<th>
																<div>Type <span class="icon-dir icon-down-dir"></span></div>
															</th>
															<th>
																<div>Opened Date <span class="icon-dir icon-down-dir"></span></div>
															</th>
															<th>
																<div>Price <span class="icon-dir icon-down-dir"></span></div>
															</th>
															<th>
																<div>Units Total <span class="icon-dir icon-down-dir"></span></div>
															</th>
															<th>
																<div>Units Filed <span class="icon-dir icon-down-dir"></span></div>
															</th>
														</tr>
													</thead>
													<tbody>
														<tr class='buy'>
                              <td>ETH/BTC</td>
															<td>
																<span class="round"></span>
																Buy(LO)
															</td>
															<td>11.21.2017</td>
															<td>0.15646245</td>
															<td>12.432432</td>
															<td>0.00</td>
														</tr>
														<tr class='sell'>
                              <td>ETH/BTC</td>
															<td>
																<span class="round"></span>
																Sell(LO)
															</td>
															<td>11.21.2017</td>
															<td>0.15646245</td>
															<td>12.432432</td>
															<td>0.00</td>
														</tr>
														<tr class='buy'>
                              <td>ETH/BTC</td>
															<td>
																<span class="round"></span>
																Buy(LO)
															</td>
															<td>11.21.2017</td>
															<td>0.15646245</td>
															<td>12.432432</td>
															<td>0.00</td>
														</tr>
														<tr class='sell'>
                              <td>ETH/BTC</td>
															<td>
																<span class="round"></span>
																Sell(LO)
															</td>
															<td>11.21.2017</td>
															<td>0.15646245</td>
															<td>12.432432</td>
															<td>0.00</td>
														</tr>
														<tr class='buy'>
                              <td>ETH/BTC</td>
															<td>
																<span class="round"></span>
																Buy(LO)
															</td>
															<td>11.21.2017</td>
															<td>0.15646245</td>
															<td>12.432432</td>
															<td>0.00</td>
														</tr>
														<tr class='sell'>
                              <td>ETH/BTC</td>
															<td>
																<span class="round"></span>
																Sell(LO)
															</td>
															<td>11.21.2017</td>
															<td>0.15646245</td>
															<td>12.432432</td>
															<td>0.00</td>
														</tr>
														<tr class='sell'>
                              <td>ETH/BTC</td>
															<td>
																<span class="round"></span>
																Sell(LO)
															</td>
															<td>11.21.2017</td>
															<td>0.15646245</td>
															<td>12.432432</td>
															<td>0.00</td>
														</tr>
														<tr class='sell'>
                              <td>ETH/BTC</td>
															<td>
																<span class="round"></span>
																Sell(LO)
															</td>
															<td>11.21.2017</td>
															<td>0.15646245</td>
															<td>12.432432</td>
															<td>0.00</td>
														</tr>


													</tbody>
												</table>
											</div>

										</div>
									</div>

								</div>
							</div>
						</div>
						<div class="col-12 col-sm-12 col-md-6 col-lg-4">
							<div class="row">
								<div class="orderbook-table chart col-12 col-sm-6 col-md-12">
									<div class="chart__top justify-content-between row">
										<div class="chart-name">Order Book</div>
										<div class="chart-controls align-items-center justify-content-between row">
												<div class="control-resize"></div>
												<div class="control-dash"></div>
										</div>
									</div>
									<div class="orderbook-table-wrapper js-table-wrapper">
										<table class="table red">
											<thead>
												<tr>
													<th>
														<div>Price <span class="icon-dir icon-down-dir"></span></div>
																<div>
													</th>
													<th>
														<div>Size <span class="icon-dir icon-down-dir"></span></div>
																<div>
													</th>
													<th>
														<div>Total <span class="icon-dir icon-down-dir"></span></div>
																<div>
													</th>
													<th></th>
												</tr>
											</thead>
											<tbody class="tbody">
												<tr class="sz-100">
													<td>
														0.290
													</td>
													<td>
														<span class="white">4.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>
												<tr class="sz-75">
													<td>
														0.290
													</td>
													<td>
														<span class="white">3.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>
												<tr class="sz-50">
													<td>
														0.290
													</td>
													<td>
														<span class="white">2.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>
												<tr class="sz-25">
													<td>
														0.290
													</td>
													<td>
														<span class="white">1.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>
												<tr>
													<td>
														0.290
													</td>
													<td>
														<span class="white">4.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>
												<tr>
													<td>
														0.290
													</td>
													<td>
														<span class="white">4.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>
												<tr>
													<td>
														0.290
													</td>
													<td>
														<span class="white">4.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>
												<tr>
													<td>
														0.290
													</td>
													<td>
														<span class="white">4.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>

											</tbody>
										</table>
									</div>
									<div class="value row up">
										<span>0.216</span>
										<span class="icon icon-dir icon-up-dir"></span>
									</div>
									<div class="orderbook-table-wrapper js-table-wrapper">
										<table class="table green">
											<tbody>
												<tr class="sz-100">
													<td>
														0.290
													</td>
													<td>
														<span class="white">4.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>
												<tr class="sz-100">
													<td>
														0.290
													</td>
													<td>
														<span class="white">4.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>
												<tr class="sz-75">
													<td>
														0.290
													</td>
													<td>
														<span class="white">3.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>
												<tr class="sz-25">
													<td>
														0.290
													</td>
													<td>
														<span class="white">1.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>

												<tr class="sz-100">
													<td>
														0.290
													</td>
													<td>
														<span class="white">4.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>
												<tr class="sz-50">
													<td>
														0.290
													</td>
													<td>
														<span class="white">2.</span>
														<span>04994</span>
													</td>
													<td>
														32161
													</td>
														<td>
															<span class="dash"></span>
														</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
								<div class="trades-table chart col-12 col-sm-6 col-md-12">
									<div class="chart__top justify-content-between row">
										<div class="chart-name">Recent Trades</div>
										<div class="chart-controls align-items-center justify-content-between row">
												<div class="control-resize"></div>
												<div class="control-dash"></div>
										</div>
									</div>

									<div class="trades-table-wrapper js-table-wrapper">
										<table class="table">
											<thead>
												<tr>
													<th>

														<div>Price (ETH) <span class="icon-dir icon-down-dir"></span></div>
																<div>
													</th>
													<th>
														<div>Trade Size <span class="icon-dir icon-down-dir"></span></div>
																<div>
													</th>
													<th >
														<div>Time <span class="icon-dir icon-down-dir"></span></div>
																<div>
													</th>
													<th>

													</th>
												</tr>
											</thead>
											<tbody class="tbody">
												<tr class="up">
													<td>
														4086.4
														<span class="icon icon-dir icon-up-dir"></span>
													</td>
													<td>
														250
													</td>
													<td>
														8:46:41 PM
													</td>
														<td>
															B
														</td>
												</tr>
												<tr class="down">
													<td>
														4086.3
														<span class="icon icon-dir icon-down-dir"></span>
													</td>
													<td>
														40
													</td>
													<td>
														8:46:32 PM
													</td>
													<td>
														S
													</td>
												</tr>
												<tr class="up">
													<td>
														4086.4
														<span class="icon icon-dir icon-up-dir"></span>
													</td>
													<td>
														250
													</td>
													<td>
														8:46:41 PM
													</td>
														<td>
															B
														</td>
												</tr>
												<tr class="down">
													<td>
														4086.3
														<span class="icon icon-dir icon-down-dir"></span>
													</td>
													<td>
														40
													</td>
													<td>
														8:46:32 PM
													</td>
													<td>
														S
													</td>
												</tr>
												<tr class="up">
													<td>
														4086.4
													</td>
													<td>
														250
													</td>
													<td>
														8:46:41 PM
													</td>
														<td>
															B
														</td>
												</tr>
												<tr class="up">
													<td>
														4086.4
													</td>
													<td>
														250
													</td>
													<td>
														8:46:41 PM
													</td>
														<td>
															B
														</td>
												</tr>
												<tr class="up">
													<td>
														4086.4
													</td>
													<td>
														250
													</td>
													<td>
														8:46:41 PM
													</td>
														<td>
															B
														</td>
												</tr>
												<tr class="up">
													<td>
														4086.4
													</td>
													<td>
														250
													</td>
													<td>
														8:46:41 PM
													</td>
														<td>
															B
														</td>
												</tr>
												<tr class="up">
													<td>
														4086.4
													</td>
													<td>
														250
													</td>
													<td>
														8:46:41 PM
													</td>
														<td>
															B
														</td>
												</tr>

												<tr class="down">
													<td>
														4086.3
													</td>
													<td>
														1996
													</td>
													<td>
														8:46:32 PM
													</td>
													<td>
														S
													</td>
												</tr>
												<tr class="down">
													<td>
														4086.3
													</td>
													<td>
														40
													</td>
													<td>
														8:46:32 PM
													</td>
													<td>
														S
													</td>
												</tr>
												<tr class="down">
													<td>
														4086.3
													</td>
													<td>
														40
													</td>
													<td>
														8:46:32 PM
													</td>
													<td>
														S
													</td>
												</tr>
												<tr class="down">
													<td>
														4086.3
													</td>
													<td>
														40
													</td>
													<td>
														8:46:32 PM
													</td>
													<td>
														S
													</td>
												</tr>

												<tr class="up">
													<td>
														4086.4
														<span class="icon icon-dir icon-up-dir"></span>
													</td>
													<td>
														250
													</td>
													<td>
														8:46:41 PM
													</td>
														<td>
															B
														</td>
												</tr>
												<tr class="down">
													<td>
														4086.3
														<span class="icon icon-dir icon-down-dir"></span>
													</td>
													<td>
														40
													</td>
													<td>
														8:46:32 PM
													</td>
													<td>
														S
													</td>
												</tr>

											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
`;
