const express = require('express');
const app = express();
const port = 80;

app.use(express.static('dist'));
app.use(express.static('dist/assets'));
app.use(express.static('dist/assets/images'));

app.listen(port, () => {
	console.log(
		`Discord Embed Builder app listening at http://localhost:${port}`,
	);
});
