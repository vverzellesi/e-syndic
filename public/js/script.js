$(document).ready(function() {
    // Setup - add a text input to each footer cell
    $('#index-table tfoot th').each(function() {
        var title = $(this).text();
        $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });

    // DataTable
    var table = $('#index-table').DataTable();

    // Apply the search
    table.columns().every(function() {
        var that = this;
        $('input', this.header()).on('keydown', function(ev) {
            if (ev.keyCode == 13) {
                that
                    .search(this.value)
                    .draw();
            }
        });
    });
});