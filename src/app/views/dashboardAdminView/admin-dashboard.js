/**
 * Created by Anas on 11/26/2015.
 */

$(document).ready(function() {

    /* Line Chart - Row 1, Col 1
     ======================================== */
    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'projectSummary',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [
            {month: '2015-01', value: 1210},
            {month: '2015-02', value: 1690},
            {month: '2015-03', value: 1080}
        ],
        // The name of the data record attribute that contains x-values.
        xkey: 'month',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Spent'],
        resize: true,
        xLabels: "month",
        preUnits: ''
    });

    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'androidSummary',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [
            {month: '2015-01', value: 980},
            {month: '2015-02', value: 450},
            {month: '2015-03', value: 700}
        ],
        // The name of the data record attribute that contains x-values.
        xkey: 'month',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Spent'],
        resize: true,
        xLabels: "month",
        preUnits: ''
    });

    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'windowsSummary',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [
            {month: '2015-01', value: 200},
            {month: '2015-02', value: 220},
            {month: '2015-03', value: 80}
        ],
        // The name of the data record attribute that contains x-values.
        xkey: 'month',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Spent'],
        resize: true,
        xLabels: "month",
        preUnits: ''
    });

    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'iPhoneSummary',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [
            {month: '2015-01', value: 30},
            {month: '2015-02', value: 540},
            {month: '2015-03', value: 300}
        ],
        // The name of the data record attribute that contains x-values.
        xkey: 'month',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Spent'],
        resize: true,
        xLabels: "month",
        preUnits: ''
    });

});