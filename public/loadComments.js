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


const getComments = function (comments) {
	let commentsDiv = document.createElement('div');
	commentsDiv.id = "commentDiv";
	commentsDiv.innerHTML = createTable(comments);
	let body = document.getElementsByTagName("body")[0];
	body.appendChild(commentsDiv);
}

const fetchData = function () {
	fetch('/comments').then(function (res) {
		return res.json();
	}).then(comments => {
		getComments(comments);
	})
}

window.onload = fetchData;