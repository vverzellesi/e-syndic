$(document).ready(function() {
    // setup - add a text input to each footer cell
    $('#index-table tfoot th').each(function() {
        var title = $(this).text();
        $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });
    // dataTable
    var table = $('#index-table').DataTable();
    // apply the search
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

    // bootstrap datepicker
    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy'
    });

    // masks
    // 8 or 9 digit phones
    var maskBehavior = function(val) {
            return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
        },
        options = {
            onKeyPress: function(val, e, field, options) {
                field.mask(maskBehavior.apply({}, arguments), options);
            }
        };

    $('#cpf').mask('000.000.000-00');
    $('#rg').mask('AA-AAA-AAA-A');
    $('#date').mask('00/00/0000');
    $('#phone').mask(maskBehavior, options);
    $('#plate').mask('SSS-0000', {
        'translation': {
            S: { pattern: /[A-Za-z]/ },
            0: { pattern: /[0-9]/ }
        },
        onKeyPress: function(value, event) {
            event.currentTarget.value = value.toUpperCase();
        }
    });


});