import moment from "moment-timezone";
import URI from "urijs";

export const daysBetweenDates = (startDate, endDate, timezone) => {
	let startDay = moment(startDate * 1000).tz(timezone)
	let endDay = moment(endDate * 1000).tz(timezone)

	// Add day one
	let dates = [startDay.clone().unix()]

	// Add all additional days
	while(startDay.add(1, 'days').diff(endDay) < 0) {
		dates.push(startDay.clone().unix())
	}
	return dates
}

export const getDayNumberFromDate = (days, date) => {
	let dayNumber
	days.find((d, index)=>{
		if(d == date){
			dayNumber = index + 1
		}})
	return dayNumber
}

export const getFormatedDate = (datetime, time_zone = false) => {
	
	if(time_zone){
		let formattedTime = moment.unix(datetime)
		return moment.tz(datetime * 1000, time_zone).format('MMMM DD, YYYY')
	}
	return moment.unix(datetime).format('MMMM DD, YYYY')
}

export const getFormatedTime = (datetime, time_zone = false) => {
	
	if(time_zone){
		// let formattedTime = moment.unix(datetime).format()
		return moment.tz(datetime * 1000, time_zone).format('HH:mm')
	}
	return moment.unix(datetime).format('HH:mm')
}

export const getBackURL = () => {
	let defaultLocation = '/a/member/orders';
	let url      = URI(window.location.href);
	let location = url.pathname();
	if (location === '/') location = defaultLocation;
	let query    = url.search(true);
	let fragment = url.fragment();
	let backUrl  = query.hasOwnProperty('BackUrl') ? query['BackUrl'] : location;
	if(fragment != null && fragment !== ''){
		backUrl += `#${fragment}`;
	}
	return backUrl;
}