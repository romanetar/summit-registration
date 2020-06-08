/**
 * Copyright 2020
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
import { connect } from 'react-redux';
import {getCurrentTime, tickTime} from '../actions/timer-actions';

/**
 * Timer
 */
class Timer extends React.Component {

    constructor(props) {
        super(props);
    }

    tick() {
        this.props.tickTime();
    }

    componentDidMount() {
        this.props.getCurrentTime();
        this.interval = setInterval(() => this.tick(), 1000);
    }

    render() {
        return null
    }
}


const mapStateToProps = ({ timerState }) => ({
    ...timerState
})


export default connect (
    mapStateToProps,
    {
        getCurrentTime,
        tickTime
    }
)(Timer);