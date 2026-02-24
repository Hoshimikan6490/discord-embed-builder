const express = require('express');
const app = express();
const port = 80;

app.use(express.static('public'));
app.use(express.static('public/images'));

app.listen(port, () => {
	console.log(
		`Discord Embed Builder app listening at http://localhost:${port}`,
	);
});
