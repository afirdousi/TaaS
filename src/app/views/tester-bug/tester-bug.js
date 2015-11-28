/**
 * Created by Carlos on 11/27/15.
 */

$(document).ready(function() {

    /* Line Chart - Row 1, Col 1
     ======================================== */
    Morris.Bar({
        element: 'projectsPerSystem',
        data: [
            {y: 'iOS Apps', a: 1},
            {y: 'Android Apps', a: 1},
            {y: 'Web Apps', a: 2},
        ],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['iOS Apps', 'Android Apps', 'Web Apps'],
        barColors: ['#690'],
        resize: true
    });

});