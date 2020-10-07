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

import React from 'react'
import { Switch, Route, Router, Redirect } from 'react-router-dom'
import PrimaryLayout from "./layouts/primary-layout"
import DashboardLayout from "./layouts/dashboard-layout"
import InviteesLayout from "./layouts/invitees-layout";
import GuestsLayout from "./layouts/guests-layout"
import AuthorizedRoute from './routes/authorized-route'
import AuthorizationCallbackRoute from "./routes/authorization-callback-route"
import LogOutCallbackRoute from './routes/logout-callback-route'
import AuthButton from './components/auth-button'
import HeaderTitle from './components/header-title'
import NavBar from './components/nav-bar'
import { connect } from 'react-redux'
import { AjaxLoader } from "openstack-uicore-foundation/lib/components";
import { onUserAuth, doLogin, doLogout, initLogOut, getUserInfo } from "openstack-uicore-foundation/lib/methods";
import { handleResetReducers } from './actions/summit-actions'
import T from 'i18n-react';
import history from './history'
import URI from "urijs";
import SelectSummitPage from './pages/select-summit-page'
import Timer from './components/timer';
import IdTokenVerifier from 'idtoken-verifier';
import {getBackURL} from './utils/helpers';

// here is set by default user lang as en
let language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;

// language would be something like es-ES or es_ES
// However we store our files with format es.json or en.json
// therefore retrieve only the first 2 digits

if (language.length > 2) {
    language = language.split("-")[0];
    language = language.split("_")[0];
}

//console.log(`user language is ${language}`);

if (language === 'en' || language === 'es') {
  T.setTexts(require(`./i18n/${language}.json`));
} else {
  T.setTexts(require(`./i18n/en.json`));
}

window.IDP_BASE_URL             = process.env['IDP_BASE_URL'];
window.API_BASE_URL             = process.env['API_BASE_URL'];
window.MARKETING_API_BASE_URL   = process.env['MARKETING_API_BASE_URL'];
window.OAUTH2_CLIENT_ID         = process.env['OAUTH2_CLIENT_ID'];
window.SCOPES                   = process.env['SCOPES'];
window.ALLOWED_USER_GROUPS      = process.env['ALLOWED_USER_GROUPS'];
window.SUPPORT_EMAIL            = process.env['SUPPORT_EMAIL'];
window.MAX_TICKET_QTY_TO_EDIT   = process.env['MAX_TICKET_QTY_TO_EDIT'];

class App extends React.PureComponent {

    constructor(props){
        super(props);
        this.onClickLogin = this.onClickLogin.bind(this);
    }

    onClickLogin() {
        doLogin(getBackURL());
    }    

    render() {
      let {isLoggedUser, onUserAuth, doLogout, getUserInfo, member, backUrl, summit, idToken} = this.props;

      let url = URI(window.location.href);
      let location = url.pathname();
      let memberLocation = '/a/member/';

        // get user pic from idtoken claims (IDP)
        let profile_pic = member ? member.pic : '';
        if(idToken){
            let verifier = new IdTokenVerifier({
                issuer:   window.IDP_BASE_URL,
                audience: window.OAUTH2_CLIENT_ID
            });
            let jwt = verifier.decode(idToken);
            profile_pic = jwt.payload.picture;
        }

      return (
          <Router history={history}>
              <div className="container">
                  <Timer/>
                  <AjaxLoader show={ this.props.loading } size={ 120 }/>
                  <div className="header row">
                      <div className="header-top">                          
                          <HeaderTitle summit={summit}/>
                          <div className="header-user">
                              <AuthButton isLoggedUser={isLoggedUser} member={member}
                                          picture={profile_pic}
                                          doLogin={this.onClickLogin.bind(this)} initLogOut={initLogOut}
                                          location={location} clearState={this.props.handleResetReducers}/>
                          </div>
                      </div>
                      <div className="header-bottom">
                          <div className="header-menu">                        
                            {isLoggedUser && location.match(memberLocation) && <NavBar />}
                          </div>
                      </div>
                  </div>
                  <Switch>
                      <AuthorizedRoute isLoggedUser={isLoggedUser} doLogin={this.onClickLogin.bind(this)} backUrl={backUrl} path="/a/member" component={DashboardLayout} />
                      <AuthorizedRoute isLoggedUser={isLoggedUser} doLogin={this.onClickLogin.bind(this)} backUrl={backUrl} path="/a/invitations/:invitation_hash" component={InviteesLayout}/>
                      <AuthorizationCallbackRoute onUserAuth={onUserAuth} path='/auth/callback' getUserInfo={getUserInfo} />
                      <LogOutCallbackRoute doLogout={doLogout}  path='/auth/logout'/>
                      <Route path="/a/guests/:ticket_hash" component={GuestsLayout}/>
                      <Route path="/a/:summit_slug" component={PrimaryLayout}/>
                      <Route path="/a/" component={SelectSummitPage} />
                      <Route render={props => (<Redirect to={`/a/`} />)}/>
                  </Switch>
              </div>
          </Router>
      );
  }
}

const mapStateToProps = ({ loggedUserState, baseState, summitState }) => ({
  isLoggedUser: loggedUserState.isLoggedUser,
  backUrl: loggedUserState.backUrl,
  member: loggedUserState.member,
  summit: summitState.purchaseSummit,
  loading : baseState.loading,
  idToken:  loggedUserState.idToken,
})

export default connect(mapStateToProps, {
  onUserAuth,
  doLogout,
  getUserInfo,
  handleResetReducers
})(App)
