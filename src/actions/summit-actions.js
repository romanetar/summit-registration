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

import { authErrorHandler } from "openstack-uicore-foundation/lib/methods";
import T from "i18n-react/dist/i18n-react";
import history from '../history'
import {
    getRequest,
    createAction,
    stopLoading,
    startLoading,
    showMessage,
    showSuccessMessage,
} from 'openstack-uicore-foundation/lib/methods';


export const GET_SUMMITS               = 'GET_SUMMITS';
export const GET_SUMMIT_BY_SLUG        = 'GET_SUMMIT_BY_SLUG';
export const GET_SUMMIT_BY_ID          = 'GET_SUMMIT_BY_ID';

export const getSummits = () => (dispatch, getState) => {
  
  let params = {
      expand: ''
  };

  return getRequest(
      dispatch(startLoading()),
      createAction(GET_SUMMITS),
      `${window.API_BASE_URL}/api/public/v1/summits/`,
      authErrorHandler
  )(params)(dispatch).then(() => {
      dispatch(stopLoading());
    }
  );

}

export const getSummitBySlug = (slug) => (dispatch, getState) => {
    
    dispatch(startLoading());    
    
    return getRequest(
        dispatch(startLoading()),
        createAction(GET_SUMMIT_BY_SLUG),
        `${window.API_BASE_URL}/api/public/v1/summits/all/${slug}`,
        authErrorHandler
    )()(dispatch).then(() => {
          dispatch(stopLoading());
        }
    );    
}

export const getSummitById = (id) => (dispatch, getState) => {
    
  dispatch(startLoading());    
  
  return getRequest(
      dispatch(startLoading()),
      createAction(GET_SUMMIT_BY_ID),
      `${window.API_BASE_URL}/api/public/v1/summits/all/${id}`,
      authErrorHandler
  )()(dispatch).then(() => {
        dispatch(stopLoading());
      }
  );    
}



