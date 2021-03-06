/**
 * Copyright 2019
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import OrdersListPage from '../pages/orders/orders-list-page';
import OrderDetailPage from '../pages/orders/order-detail-page'
import TicketsListPage from '../pages/tickets/tickets-list-page';

import '../styles/dashboard.less';

class DashboardLayout extends React.Component {

    render() {
        let { match } = this.props;
        return(
            <div className="dashboard-layout">
                <main id="page-wrap">
                    <Switch>
                        <Route exact path={`${match.url}/orders`} component={OrdersListPage}/>
                        <Route exact path={`${match.url}/orders/detail`} component={OrderDetailPage}/>                        
                        <Route exact path={`${match.url}/tickets`} component={TicketsListPage}/>
                        <Route render={props => (<Redirect to={`${match.url}/orders`} />)}/>
                    </Switch>
                </main>
            </div>
        );
    }
}

const mapStateToProps = ({ summitState  }) => ({
  summits: summitState.summits
})

export default connect(
  mapStateToProps
)(DashboardLayout);

