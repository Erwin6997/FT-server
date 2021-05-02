const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist/FrontEnd')))

const bodySend = {
	queryString: '',
	resultContext: {
		aspects: [ 'title', 'lifecycle', 'location', 'summary', 'editorial' ]
	}
};

// show all the news for first part:
app.get('/api', fetchAPI(), (req, res) => {
	const page = parseInt(req.query.page);
	const limit = parseInt(req.query.limit);
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const results = res.OriginalData.slice(startIndex, endIndex);
	res.json({
		page: page,
		length: res.OriginalData.length,
		article: results
	});
});
// end

// search the word and pagination :
app.get('/search/', fetchAPI('key'), (req, res) => {
	const key = req.query.key;
	const page = parseInt(req.query.page);
	const limit = parseInt(req.query.limit);
	bodySend.queryString = key; //key for search on FT API
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	if (key.length > 0) {
		const fetchResult = res.OriginalSearchData;
		const results = fetchResult.slice(startIndex, endIndex);
		res.json({
			page: page,
			length: fetchResult.length,
			article: results
		});
	} else {
		const results = res.OriginalSearchData.slice(startIndex, endIndex);
		res.json({
			page: page,
			length: res.OriginalSearchData.length,
			article: results
		});
	}
});
// end

// fetch function
function fetchAPI(props) {
	return (req, res, next) => {
		fetch(`https://api.ft.com/content/search/v1`, {
			method: 'POST',
			body: JSON.stringify(bodySend),
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': '59cbaf20e3e06d3565778e7b9758f7892e89468293a48663b98bd1d9'
			}
		})
			.then((res) => res.json())
			.then((data) => {
				const dataAPI = data.results[0].results;
				if (!props) {
					res.OriginalData = dataAPI;
					next();
				} else {
					res.OriginalSearchData = dataAPI;
					next();
				}
			});
	};
}
// end fetch

//Port
app.listen(PORT, () => {
	console.log(`Running at \`http://localhost:${PORT}\`...`);
});
