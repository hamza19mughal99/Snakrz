import moment from "moment";

export function getHoursDifference(start, end) {
	const dt1 = moment(start)
	const dt2 = moment(end)
	const hour = moment.utc(moment(dt2,"DD/MM/YYYY HH:mm:ss").diff(moment(dt1,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
	return `${hour}`
}

export function getFormattedTime(n) {
	let num = n;
	let hours = (num / 60);
	let rhours = Math.floor(hours);
	let minutes = (hours - rhours) * 60;
	let rminutes = Math.round(minutes);
	return rhours + " hour(s) and " + rminutes + " minute(s).";
	}

export const getTotalPrice = (dupCart) => {
	return dupCart.reduce((acc, service) => {
		console.log(acc, service.price)
		return acc + parseInt(service.price)
	}, 0)
}
