const getDetails = function (content) {
	let comment = content.split('=')[1].replace(/\+/g, ' ');
	comment = decodeURIComponent(comment);
	let dateAndTime = new Date();
	return { dateAndTime, comment };
}

module.exports = { getDetails };