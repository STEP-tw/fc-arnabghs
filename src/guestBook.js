const getDetails = function (content) {
	let details = content.split('&');
	let comment = details[1].split('=')[1].replace(/\+/g, ' ');
	let name = details[0].split('=')[1].replace(/\+/g, ' ');
	name = decodeURIComponent(name);
	comment = decodeURIComponent(comment);
	let dateAndTime = new Date().toLocaleString();
	return { dateAndTime, name, comment };
}

const createRow = function (commentDetail) {
	return `<tr>
	<td> ${commentDetail.dateAndTime}</td>
	<td>${commentDetail.name}</td>
	<td>${commentDetail.comment}</td>
</tr>`
}

const createTableBody = function (commentDetails) {
	return `<table>
		<thead><tr>
			<td style = "width:400px">DATE AND TIME</td>
			<td style = "width:400px">NAME</td>
			<td>COMMENT LIST</td>
		</tr></thead>
		<tbody>		
		${commentDetails.map(detail => createRow(detail)).join('')}
		</tbody>
	</table>`
}

const createTable = function (details) {
	let commentDetails = details;
	return createTableBody(commentDetails);
}

module.exports = { getDetails, createTable };