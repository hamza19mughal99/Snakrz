import moment from "moment";

export function formattedTime(date) {
	return moment(date).format('LT')
}

export const  arrayBufferToBase64 = (buffer) => {
	let binary = '';
	let bytes = [].slice.call(new Uint8Array(buffer));
	bytes.forEach((b) => binary += String.fromCharCode(b));
	return window.btoa(binary);
};

export const formattingImage = (img) => {
	const base64Flag = `data:${img.contentType};base64,`
	const imgStr = arrayBufferToBase64(img.data.data);

	return [base64Flag, imgStr]
}