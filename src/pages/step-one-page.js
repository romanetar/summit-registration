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
import T from "i18n-react/dist/i18n-react";
import moment from "moment";
import TicketInput from "../components/ticket-input";
import StepRow from '../components/step-row';
import SubmitButtons from "../components/submit-buttons";
import { handleOrderChange, handleResetOrder } from '../actions/order-actions'
import {getNow} from '../actions/timer-actions';
import { Link } from 'react-router-dom';

import history from '../history';

import '../styles/step-one-page.less';


class StepOnePage extends React.Component {

    constructor(props){
        super(props);

        this.state = {
        };

        this.step = 1;

        this.handleAddTicket = this.handleAddTicket.bind(this);
        this.handleSubstractTicket = this.handleSubstractTicket.bind(this);
    }

    componentWillMount() {
        this.props.handleResetOrder();
        
        let {order, member} = this.props;
                
        order = {
            ...order,
            tickets: [],
            currentStep: this.step
        };
        
        this.props.handleOrderChange(order)
    }

    handleAddTicket(ticketTypeId) {
        let order = {...this.props.order};        

        let randomNumber = moment().valueOf();
        order.tickets.push({ type_id: ticketTypeId, tempId: randomNumber });
        
        this.props.handleOrderChange(order)
    }

    handleSubstractTicket(ticketTypeId) {
        let order = {...this.props.order};
        let idx = order.tickets.findIndex(t => t.type_id == ticketTypeId);

        if (idx !== -1) {
            order.tickets.splice(idx,1);
            this.props.handleOrderChange(order)
        }
    }

    render(){

        let {summit, order, member} = this.props;
        let now = this.props.getNow();
        // filter tickets types
        let ticketsTypesToSell = (Object.entries(summit).length === 0 && summit.constructor === Object) ? [] : summit.ticket_types.filter( tt =>
            // if ticket does not has sales start/end date set could be sell all the registration period
            (tt.sales_start_date == null && tt.sales_end_date == null) ||
            (now >= tt.sales_start_date && now <= tt.sales_end_date)
        );

        return (
            <div className="step-one">
                {(now >= summit.registration_begin_date &&
                    now <= summit.registration_end_date &&
                    now < summit.end_date) && ticketsTypesToSell.length > 0 ?
                  <React.Fragment>
                    <StepRow step={this.step} />
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-12">
                                    <h3>{T.translate("step_one.choose_tickets")}</h3>                                
                                </div>
                                <div className="col-md-12">

                                    <TicketInput
                                        ticketTypes={ticketsTypesToSell}
                                        summit={summit}
                                        selection={order.tickets}
                                        add={this.handleAddTicket}
                                        substract={this.handleSubstractTicket}
                                    />                                                                      
                                  {now >= summit.end_date &&
                                  now <= summit.registration_begin_date &&
                                    history.push('/a/member/orders')
                                  }
                        {!member &&
                        <React.Fragment> 
                                  <br/><br/><br/>
                                  <h4>Want to checkout faster?  </h4> 
                                  <a href={`${window.IDP_BASE_URL}/auth/register`}>
                                    <button className="btn btn-primary manage-btn">
                                        {T.translate("step_one.getfnid")}
                                    </button>
                                    </a>
       
                         &nbsp;OR&nbsp;

                         <Link to="/a/member/orders">
                                    <button className="btn btn-primary manage-btn">
                                        {T.translate("step_one.signin")}
                                    </button>
                                  </Link>
                        </React.Fragment>
                         }
                        
                                </div>
                            </div>

                        </div>
                        <div className="col-md-4">             
                        </div>
                    </div>
                    <SubmitButtons step={this.step} canContinue={order.tickets.length > 0} />
                    </React.Fragment>
                  :
                  <div className="no-tickets-text">
                    <h3>{T.translate("step_one.no_tickets")}</h3>
                  </div>
                }
            </div>
        );
    }
}

const mapStateToProps = ({ loggedUserState, summitState, orderState }) => ({
    member: loggedUserState.member,
    summit: summitState.purchaseSummit,
    order:  orderState.purchaseOrder,
    errors:  orderState.errors
})

export default connect (
    mapStateToProps,
    {
        handleOrderChange,
        handleResetOrder,
        getNow
    }
)(StepOnePage);

