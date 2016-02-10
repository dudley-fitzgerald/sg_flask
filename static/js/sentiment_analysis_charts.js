google.charts.load('current', {packages: ['corechart', 'line', 'table', 'gauge','controls']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	//Retrieve data from server in JSON format
	var jsonData = $.ajax({
		url: "/get_sentiment",
		contentType:"application/json; charset=utf-8",
		dataType: "json",
		async: false
		}).responseJSON;
	
	//Convert JSON data to useable arrays
	var db_data = [];
	for (var item in jsonData) {
		var value = jsonData[item];
		db_data.push(value);
	}
	
	var year = db_data[0][0]
	var month = db_data[0][1]
	var day = db_data[0][2]
	var open = db_data[0][3]
	var close = db_data[0][4]
	var high = db_data[0][5]
	var low = db_data[0][6]
	var sent = db_data[0][7]
	var sent_volume = db_data[0][8]
	
	//Create DataTable 
	var data = new google.visualization.DataTable();
	data.addColumn('date', 'Date');
    data.addColumn('number', 'Low');
	data.addColumn('number', 'Open');
	data.addColumn('number', 'Close');
	data.addColumn('number', 'High');
	data.addColumn('number', 'Sentiment');
	data.addColumn('number', 'Sentiment Volumn');
	
	for (var i = 0; i < year.length; ++i) {
		var date = new Date(year[i], month[i], day[i]);
		data.addRow([date, low[i], open[i], close[i], high[i], sent[i], sent_volume[i]]);
	};
	
	
	//Create Dashboard
	var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
	
	//Create ControlWrapper
	var control = new google.visualization.ControlWrapper({
		'controlType': 'ChartRangeFilter',
		'containerId': 'control_div',
		'options': {

			// Filter by the date axis.
			'filterColumnIndex': 0,
			'ui': {
				'chartType': 'LineChart',
				'chartOptions': {
					'chartArea': {
						'top': '0',
						//'width': '80%',
						//'height': '50%'
						},
					'hAxis': {
						'baselineColor': 'none'
						}
					},
				// Display a single series that shows the closing value of the stock.
				// Thus, this view has two columns: the date (axis) and the stock value (line series).
				'chartView': {
					'columns': [0, 3]
					},
				}
			},
		});
	
	
	// Create LineChart from Server Data
	var line_chart = new google.visualization.ChartWrapper({
		'chartType': 'LineChart',
		'containerId': 'line_div',
		'view': {'columns': [0, 5]},
		'options': {
			'width': '90%',
			'hAxis': { 
				textPosition: 'none' 
				},
			'chartArea': {
				'top': '0',
				'bottom': '0'
			}
		}
	});
	
	
	// Create CandlestickChart from Server Data
	var cs_chart = new google.visualization.ChartWrapper({
		'chartType': 'CandlestickChart',
		'containerId': 'cs_div',
		'view': {'columns': [0, 1, 2, 3, 4]},
		'options': {
			'width': '90%',
			'hAxis': { textPosition: 'none' },
			'chartArea': {
				'top': 0,
				'bottom': 0
			}
		}
	});
	
	
	// Create BarChart from Server Data
	var bar_chart = new google.visualization.ChartWrapper({
		'chartType': 'ColumnChart',
		'containerId': 'bar_div',
		'view': {'columns': [0, 6]},
		'options': {
			'width': '90%',
			'hAxis': { textPosition: 'none' },
			'chartArea': {
				'top': 0,
				'bottom': 0
			}
		}
	});
	
	dashboard.bind(control, [line_chart, cs_chart, bar_chart]);
	dashboard.draw(data);
}