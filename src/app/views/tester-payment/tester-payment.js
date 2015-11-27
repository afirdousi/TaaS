/**
 * Created by Carlos on 11/26/15.
 */
$(document).ready(function() {

    /**** Provider ****/
    /* Line Chart - Row 1, Col 1
    ======================================== */
    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'spentSummary',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [
            { month: '2015-01', value: 200 },
            { month: '2015-02', value: 650 },
            { month: '2015-03', value: 900 },
            { month: '2015-04', value: 1500 },
            { month: '2015-05', value: 2900 }
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
        preUnits: '$'
    });

    /* Line Chart - Row 1, Col 2
     ======================================== */
    Morris.Donut({
        element: 'spendByService',
        data: [
            {label: "iOS Apps", value: 1400},
            {label: "Android Apps", value: 1050},
            {label: "Rails Apps", value: 750}
        ],
        formatter: function (y, data) { return '$' + y },
        resize: true
    });

    /* Line Chart - Row 2, Col 1
     ======================================== */
    Morris.Bar({
        element: 'topServicesUsage',
        data: [
            { y: 'Group', a: 8500 },
            { y: 'Individual', a: 5780 },
            { y: 'Mobile', a: 7400 },
            { y: 'Cloud', a: 3009 }
        ],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Series A', 'Series B'],
        barColors:['#690'],
        resize: true
    });

    /* Line Chart - Row 2, Col 2
     ======================================== */
    Morris.Area({
        element: 'monthToDate',
        data: [
            { y: '2015-01', a: 100, b: 90, c: 80},
            { y: '2015-02', a: 300,  b: 20, c: 400 },
            { y: '2015-03', a: 200,  b: 90, c: 200 },
            { y: '2015-04', a: 300,  b: 150, c: 300 }
        ],
        xkey: 'y',
        ykeys: ['a', 'b', 'c'],
        labels: ['Group', 'Mobile', 'Cloud']
    });


    /**** Tester ****/
    /* Line Chart - Row 1, Col 1
     ======================================== */
    Morris.Donut({
        element: 'bugsFoundProject',
        data: [
            {label: "iOS Apps: Shoe Shine", value: 34},
            {label: "Android Apps: Star Wars Comeback", value: 49},
            {label: "Web Apps: AllStar Ecommerce", value: 25},
            {label: "Web Apps: Messaging 4 All", value: 41}
        ],
        resize: true
    });

    /* Line Chart - Row 1, Col 2
     ======================================== */
    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'hoursPerProject',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [
            { week: '2015-01', value: 26 },
            { week: '2015-02', value: 31 },
            { week: '2015-03', value: 65 },
            { week: '2015-04', value: 40 }
        ],
        // The name of the data record attribute that contains x-values.
        xkey: 'week',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Shoe Shine','Star Wars Comeback','AllStar Ecommerce','Messaging 4 All'],
        resize: true,
        xLabels: "week",
        postUnits: 'hrs'
    });

    /* Line Chart - Row 2, Col 1
     ======================================== */
    Morris.Bar({
        element: 'projectsPerSystem',
        data: [
            { y: 'iOS Apps', a: 1 },
            { y: 'Android Apps', a: 1 },
            { y: 'Web Apps', a: 2 },
        ],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['iOS Apps', 'Android Apps', 'Web Apps'],
        barColors:['#690'],
        resize: true
    });

    /* Line Chart - Row 2, Col 2
     ======================================== */
    Morris.Area({
        element: 'groupProjectContribution',
        data: [
            { y: '2015-01', a: 3,  b: 4, c: 2},
            { y: '2015-02', a: 4,  b: 2, c: 4 },
            { y: '2015-03', a: 7,  b: 1, c: 3 },
            { y: '2015-04', a: 5,  b: 3, c: 5 }
        ],
        xkey: 'y',
        ykeys: ['a', 'b', 'c'],
        labels: ['Star Wars Comeback', 'AllStar Ecommerce', 'Messaging 4 All']
    });
});