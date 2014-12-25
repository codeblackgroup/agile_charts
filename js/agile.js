(function(agile, $, undefined){

    Agile = {
        createGraph : function(object){
            var graphObject = Operations.convert[object.datatype](object.identifier);
            Graph.create_new_graph(graphObject)    
        },
        updateGraph: function(graphName,object){
            var index = Graph.graph_names.indexOf(graphName);
            var oldGraphObject = Graph.graph_list[index][graphName];
            var newGraphObject = $.extend(true, oldGraphObject, object);
            Graph.save_graph_settings(oldGraphObject,newGraphObject)
        },
        deleteGraph: function(graphName){
            var index = Graph.graph_names.indexOf(graphName);
            Graph.delete_graph(index);
        },
        exportGraph: function(object,export_to){
            
        },
        getEmbedCode: function(graph_name){

        }
    }
    Template = {
        graph_panels: [],
        render : function(){

            Template.setup.change_events();
            Template.setup.click_events();
            Template.setup.hover_events();
            Template.setup.custom_events();

            Template.createSettingsModal();
        },
        setup: {
            change_events : function(){
                $("#select_graph_dataset_name").change(function(e){
                    var selected_dataset = $("#select_graph_dataset_name :selected").val();
                    Data.selected_dataset_index = Object.keys(Data.datasets).indexOf(selected_dataset);
                    $("#select_graph_independent_variable").html('');
                    $("#select_graph_dependent_variable").html('');
                    var possible_variables = Object.keys(Data.datasets[selected_dataset][0]);
                    var dict = Data.graph_settings_dict;
                    dict.independent_variable = possible_variables;
                    dict.dependent_variable = possible_variables;
                    Data.load_settings_dict(selected_dataset);
                });
            },
            click_events : function(){
                //sort graphs onclick
                $(".graph-sort-button").unbind('click').click(function(e){
                    var $this = $(this);
                    var graph_name = $this.attr('data-sort-for');
                    var order = $this.attr('data-sort');
                    var this_graph = Graph.graph_objects[graph_name];
                    console.log(order);
                    Graph.save_graph_settings(
                        Graph.graph_list[Graph.graph_names
                             .indexOf(graph_name)]
                             [graph_name],{
                        dataset:this_graph.dataset,
                        dataset_name:this_graph.dataset_name,
                        name: this_graph.name,
                        independent_variable: this_graph.independent_variable,
                        dependent_variable: this_graph.dependent_variable,
                        size: this_graph.size,
                        order: order,
                        type: this_graph.type,
                        format:this_graph.format,
                        id: this_graph.name.replace(/ /g, '_'),
                        index: this_graph.index,
                    });
                });
            },
            hover_events : function(){
                //descriptions in bottom left on hover
                $(".descriptive").mouseover(function(e) {
                    $this = $(this);
                    if ($this.attr('data-description')) {
                        $("#description_box").html($this.attr('data-description'));
                    }
                }).mouseout(function(e) {
                    $("#description_box").html('');
                });
                $(".tooltip-element").tooltip();
            },
            custom_events : function(){

            },
        },
        a:false,
        createSettingsModal: function(){

            Template.settingsModal = $('<div/>',{
                class: 'modal fade',
                id: 'settingsModal',
            });

            var $mDialog = $('<div/>',{class:'modal-dialog'});
            var $mContent = $('<div/>',{class:'modal-content'});
            var $mHeader = $('<div/>',{class:'modal-header'});
            var $gTitle = $('<div/>',{id:'graph_title'});
            var $mBody = $('<div/>',{class:'modal-body'});
            var $gInterface = $('<div/>',{class:'graph-creation-interface'});

            var $gDataset = $('<div/>',{id:'graph_dataset_settings'});
            var $gDatasetTitle = $('<div/>',{
                class:'graph-dataset-settings-title',
                text: 'Dataset Name',
            });
            var $gDatasetSelect = $('<select/>',{
                class: 'form-control',
                id:'select_graph_dataset_name',
            });
            
            var $gName = $('<div/>',{id:'graph_name_settings'});
            var $gNameTitle = $('<div/>',{
                class:'graph-name-settings-title',
                text: 'Graph Name',
            });
            var $gNameSelect = $('<input/>',{
                type: 'text',
                class: 'form-control',
                id:'graph_name_input',
                placeholder:'Name this graph...',
            });

            var $gType = $('<div/>',{id:'graph_type_settings'});
            var $gTypeTitle = $('<div/>',{
                class:'graph-type-settings-title',
                text:'Graph Type',
            });
            var $gTypeSelect = $('<select/>',{
                class: 'form-control',
                id:'select_graph_type',
            });

            var $gIndependentVariable = $('<div/>',{id:'graph_independent_variable_settings'});
            var $gIndependentVariableTitle = $('<div/>',{
                class:'graph-independent-variable-settings-title',
                text:'Independent Variable',
            });
            var $gIndependentVariableSelect = $('<select/>',{
                class: 'form-control',
                id:'select_graph_independent_variable',
            });

            var $gDependentVariable = $('<div/>',{id:'graph_dependent_variable_settings'});
            var $gDependentVariableTitle = $('<div/>',{
                class:'graph-dependent-variable-settings-title',
                text:'Dependent Variable',
            });
            var $gDependentVariableSelect = $('<select/>',{
                class: 'form-control',
                id:'select_graph_dependent_variable',
            });

            var $gSize = $('<div/>',{id:'graph_size_settings'});
            var $gSizeTitle = $('<div/>',{
                class:'graph-size-settings-title',
                text:'Graph Dimensions',
            });
            var $gSizeSelect = $('<select/>',{
                class: 'form-control',
                id:'select_graph_size',
            });

            var $gOrder = $('<div/>',{id:'graph_order_settings'});
            var $gOrderTitle = $('<div/>',{
                class:'graph-order-settings-title',
                text:'Order',
            });
            var $gOrderSelect = $('<select/>',{
                class: 'form-control',
                id:'select_graph_order',
            });

            var $gFormat = $('<div/>',{id:'graph_format_settings'});
            var $gFormatTitle = $('<div/>',{
                class:'graph-format-settings-title',
                text:'Graph Format',
            });
            var $gFormatSelect = $('<select/>',{
                class: 'form-control',
                id:'select_graph_format',
            });

            var $mFooter = $('<div/>',{class:'modal-footer'}); 
            var $deleteGraph = $('<div/>',{id:'delete_graph'});
            var $createGraph = $('<div/>',{id:'create_graph'});
            var $closeButton = $('<button/>',{
                type:'button',
                class: 'btn btn-default',
                'data-dismiss':'modal',
                text:'close',
            }); 
            var $saveButton = $('<button/>',{
                type:'button',
                class:'btn btn-default',
                id:'save_graph_settings_button',
                text:'Save Graph',
            });
            
            Template.settingsModal.append(
                $mDialog.append(
                    $mContent.append(
                        [
                            $mHeader.append(
                                $gTitle
                            ),
                            $mBody.append(
                                $gInterface.append(
                                    [
                                        $gDataset.append(
                                            [
                                                $gDatasetTitle,
                                                $gDatasetSelect,
                                            ]
                                        ),
                                        $gType.append(
                                            [
                                                $gTypeTitle,
                                                $gTypeSelect,
                                            ]
                                        ),
                                        $gIndependentVariable.append(
                                            [
                                                $gIndependentVariableTitle,
                                                $gIndependentVariableSelect,
                                            ]
                                        ),
                                        $gDependentVariable.append(
                                            [
                                                $gDependentVariableTitle,
                                                $gDependentVariableSelect,
                                            ]
                                        ),
                                        $gSize.append(
                                            [
                                                $gSizeTitle,
                                                $gSizeSelect,
                                            ]
                                        ),
                                        $gOrder.append(
                                            [
                                                $gOrderTitle,
                                                $gOrderSelect,
                                            ]
                                        ),
                                        $gFormat.append(
                                            [
                                                $gFormatTitle,
                                                $gFormatSelect,
                                            ]
                                        ),
                                    ]
                                )
                            ),
                            $mFooter.append(
                                [
                                    $deleteGraph,
                                    $createGraph.append(
                                        [
                                            $closeButton,
                                            $saveButton,
                                        ]
                                    )
                                ]
                            )
                        ]
                    )
                )
            )

            $body = $('body');
            if(Template.a == false){
                $body.append(Template.settingsModal);
            }
            Template.a = true;
        },
        generateAllGraphs: function() {
            $(".graph-panel").remove();
            $(Graph.graph_list).each(function(i, item) {
                if (typeof item == "object") {
                    //get graph object of index i from Graph.graph_list
                    //generate graph panel html for that object
                    var graph_list_object = item[Object.keys(item).toString()];
                    var graph_dimensions = Operations.parse_graph_size(graph_list_object.size);

                    var $graph_panel = $("<li/>", {
                        class: 'panel-box col-md-' + graph_dimensions.width.col_md + ' no-padding graph-panel',
                    });
                    var $graph_panel_header = $('<div/>', {
                        class: 'col-md-12 panel-header',
                    });
                    var $graph_panel_header_sort_asc = $("<span/>", {
                        class:'floatright glyphicon glyphicon-chevron-up graph-sort-button descriptive',
                        'data-sort-asc-id': "graph_sort_asc_"+i,
                        'data-sort-for':graph_list_object.name,
                        'data-sort': "Ascending",
                        'data-description':'Sort ' + graph_list_object.name + ' items in ascending order.',
                    });
                    var $graph_panel_header_sort_desc = $('<span/>', {
                        class:'floatright glyphicon glyphicon-chevron-down graph-sort-button descriptive',
                        'data-sort-desc-id': 'graph_sort_desc_'+i,
                        'data-sort-for':graph_list_object.name,
                        'data-sort': 'Descending',
                        'data-description':'Sort ' + graph_list_object.name +' items in descending order.',
                    });
                    var $graph_panel_header_settings = $('<span/>', {
                        class: 'floatright glyphicon glyphicon-cog graph-settings-modal-icon descriptive',
                        'data-settings-id': 'graph_settings_' + i,
                        'data-settings-for': graph_list_object.name,
                        'data-description': 'Adjust graph settings for ' + graph_list_object.name + '.',
                    });
                    var $graph_panel_header_title = $('<div/>', {
                        class: 'floatleft descriptive',
                        'data-description': graph_list_object.independent_variable + ' vs. ' + graph_list_object.dependent_variable,
                        text: graph_list_object.name,
                        'data-title-id': 'graph_title_' + i,
                    });
                    var $graph_panel_body = $('<div/>', {
                        class: 'panel-body-custom no-padding',
                        'data-graph-name': graph_list_object.name,
                        'data-graph-id': graph_list_object.id,
                    });

                    $('#graph_panel_container').append(
                        $graph_panel.append(
                            [
                                $graph_panel_header.append(
                                [
                                    $graph_panel_header_title,
                                    $graph_panel_header_settings,
                                    $graph_panel_header_sort_asc,
                                    $graph_panel_header_sort_desc
                                ]), 
                                $graph_panel_body,
                            ]
                        )
                    );

                    $('[data-settings-id="graph_settings_'+i+'"]').click(function() {
                        Graph.load_graph_settings(i);
                    });

                    Template.graph_panels.push($graph_panel);
                }
            });
            Graph.update_all_graphs();
        },
    }
    Graph = {
        graph_list : [],
        graph_names: [],
        graph_objects: [],
        update_all_graphs: function() {

            $(".chartlist").html('');
            $(Graph.graph_list).each(function(i, item) {
                //update all graphs
                if (typeof item == "object") {
                    //update each graph
                    Graph.update_graph(item);
                    //Display charts in dashboard
                    var graph_name = item[Object.keys(item).toString()].name;
                    var output_element = $("<li/>", {
                        "data-value": graph_name,
                        text: graph_name,
                    });

                    $(".chartlist").append(output_element);
                }
            });
            if(Graph.graph_list.length == 0){
                $(".chartlist").append("<li>No charts to display.</li>")
            }
            Data.graph_settings_dict.dataset_name = Object.keys(Data.datasets);
            Template.render();
        },
        //update one particular graph
        update_graph: function(graph_object) {

            var graph_list_object = graph_object[Object.keys(graph_object).toString()];
            var index = graph_list_object.index;
            var graph_name = graph_list_object.name;
            
            $("*[data-id='graph_title_" + index +"']").text(graph_name);
            //copy graph_list_object to Graph.graphs[graph_name]
            Graph.graph_objects[graph_name] = $.extend({}, graph_list_object)
            var this_graph = Graph.graph_objects[graph_name];
            var hovered_graph = Graph.graph_objects[Data.hg_name];

            this_graph.dimensions = Operations.parse_graph_size(graph_list_object.size);
            this_graph.pixel_height = this_graph.dimensions.height.pixel_height;
            this_graph.dataset = [];
            Graph.output_items = [];
            
            var generate_dataset = function(){
                var raw_dataset = Data.datasets[this_graph.dataset_name];
                this_graph.dataset = raw_dataset.map(function(item){
                    var iv = item[this_graph.independent_variable];
                    var dv = parseFloat(item[this_graph.dependent_variable]);
                    if(isNaN(dv)){
                        console.log("Dependent Variable : "+dv);
                        console.log("Your dependent variable must be numeric.");
                    }else{
                        return [iv,dv];
                    }
                }); 
            }

            generate_dataset();
            
            //set sorted dataset
            this_graph.sorted_dataset_values = Operations.sorting.quicksort(
                this_graph.dataset.map(function(item){
                    return item[1];
            }),this_graph.order);
            this_graph.sorted_dataset = [];
            var dataset_values = this_graph.dataset.map(function(item){
                return item[1];
            });
            var sorted_dataset_value_indeces = [];
            $(this_graph.sorted_dataset_values).each(function(i,value){
                sorted_dataset_value_indeces.push(dataset_values.indexOf(value));
            });
            $(sorted_dataset_value_indeces).each(function(i,index){
                this_graph.sorted_dataset.push(this_graph.dataset[index]);
            });
            //set dataset sum
            this_graph.dataset_sum = 0;
            $(this_graph.dataset).each(function(i, item){
                var name = item[0];
                var value = item[1];
                this_graph.dataset_sum += value;
            });
            $("*[data-graph-id='"+this_graph.id+"']").highcharts({
                chart: {
                    type: this_graph.type,
                    height: this_graph.pixel_height,
                    backgroundColor: 'transparent',
                    plotBackgroundColor: 'transparent',
                    animation: {
                        duration: 1000,
                        easing: 'easeOutElastic',
                    },
                    style : {
                        overflow: 'visible',
                        whiteSpace: 'normal',
                    }
                },
                title: {
                    text: '',
                    verticalAlign: 'middle',
                    y: 30
                },
                subtitle: {
                    text: '',
                    verticalAlign: 'middle',
                    y: -20,
                },
                xAxis: {
                    type: 'category',
                    title: {
                        text: this_graph.independent_variable,
                    },
                    labels: {
                        rotation: -90,
                        style: {
                            fontSize: '0px',
                            fontFamily: 'Helvetica,Arial,Verdana, sans-serif'
                        }
                    },
                    tickColor: 'transparent',
                    lineColor: '#aaa',
                },
                yAxis: {
                    title: {
                        text: this_graph.dependent_variable
                    },
                },
                legend: {
                    enabled: true
                },
                series: [
                    {
                        name: this_graph.dependent_variable,
                        data: this_graph.sorted_dataset,
                        innerSize: "50%",
                        size: '55%',
                        cursor:'pointer',
                        events: {

                        },
                        dataLabels: {
                            formatter: function() {
                                //generate labels for top 5 products
                                //line break every 3 spaces for formatting
                                var split_name = this.point.name.split(' ');
                                $(split_name).each(function(i,item){
                                    if(i%3==0 && i !== 0){
                                        split_name.splice(i,0,"<br>")
                                    }
                                });
                                var formatted_name = split_name.join(' ');
                                return this.y > this_graph.sorted_dataset_values[2] ?
                                                formatted_name +
                                                ':<br> <b>' +
                                                Operations.format_value(this.y,this_graph.format) +
                                                '</b>':
                                                null;
                            }
                        }
                    }
                ],
                tooltip: {
                    useHTML: true,
                    formatter: function(){
                        //if independent variable is "All Brands" or "All Groups"
                        //do not display graph images
                        //only display product data
                        var hovered_graph = Graph.graph_objects[Data.hg_name];
                        var name = this.key;
                        return "<div>"+name +
                               ": " +
                               hovered_graph.dependent_variable +
                               "= <b>" +
                                Operations.format_value(this.y,hovered_graph.format) +
                                "</b></div>";                        
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        center: ['50%', '50%']
                    }
                },
            });

            $(".graph-panel").hover(function(e){
                Data.hg_name = $(this).find('[data-graph-name]').attr('data-graph-name');
            });
        },
        load_graph_settings: function(index) {

            var new_graph = index == null || undefined ? true : false;
            var this_graph = Graph.graph_list[index];    

            if (new_graph) {
                //creating new graph
                var graph_name = "";
                var modal_title = "New Graph";
            } else {
                //editing existing graph
                Data.sg_index = index;
                Data.selected_dataset_index = index;
                var graph_name = Object.keys(this_graph).toString();
                var graph_object = this_graph[graph_name];
                var modal_title = graph_name + " settings";
                //set iv and dv in settings dict, depending on the dataset selected
                var possible_variables = Object.keys(Data.datasets[graph_object.dataset_name][0]);
                var dict = Data.graph_settings_dict;
                dict.independent_variable = possible_variables;
                dict.dependent_variable = possible_variables;
            }

            //fill elements appropriately
            $("#graph_title").text(modal_title);
            $("#graph_name_input").val(graph_name);

            Data.load_settings_dict(graph_name,graph_object.dataset_name);
            //delete button
            $("#delete_graph").html('');
            if(!new_graph){
                $delete_graph_element = $("<a/>",{
                    id:"delete_graph_button",
                    text:"-Delete this graph",
                    href:"#"
                });
                $("#delete_graph").append($delete_graph_element);
                $("#delete_graph_button").click(function(e){
                    Output.graph.delete_graph(index);
                });
            }
            //save button
            //unbind present so click does not execute more than once
            $("#save_graph_settings_button").unbind("click").click(function() {
                if($("#graph_name_input").val().length < 3){
                    alert("Your graph must be at least 3 characters long.");
                }else{
                    //create new object from input values
                    var index = new_graph ? Graph.graph_list.length : index;
                    var new_graph_object = {
                        name: $("#graph_name_input").val(),
                        dataset_name: $("#select_graph_dataset_name :selected").text(),
                        independent_variable: $("#select_graph_independent_variable :selected").text(),
                        dependent_variable: $("#select_graph_dependent_variable :selected").text(),
                        type: $("#select_graph_type :selected").text(),
                        size: $("#select_graph_size :selected").text(),
                        order: $("#select_graph_order :selected").text(),
                        format: $("#select_graph_format :selected").text(),
                        index: index,
                        id: $("#graph_name_input").val(),
                    };
                    if (!new_graph) {
                        Graph.save_graph_settings(graph_object, new_graph_object);
                    } else {
                        Graph.graph.create_new_graph(new_graph_object);
                    }
                }
            });

            $("#settingsModal").modal();
        },
        save_graph_settings: function(old_graph_object, new_graph_object) {
            var name = new_graph_object.name;
            var graph_list = Graph.graph_list;
            graph_list[old_graph_object.index] = {};
            graph_list[old_graph_object.index][name] = new_graph_object;
            Template.generateAllGraphs();
        },
        create_new_graph: function(graph_object) {
            var g = graph_object;
            //if name is already taken, add index to name to distinguish from other graph(s)
            g.name = Graph.graph_names.indexOf(g.name) > -1 ? g.name + ' ('+g.index+')' : g.name;
            //add index to object id, save
            g.id = g.id.replace(/ /g, '_')+'_'+g.index;
            var graph_list = Graph.graph_list;
            Graph.graph_names.push(g.name);
            graph_list[g.index] = {};
            graph_list[g.index][g.name] = graph_object;
            Template.generateAllGraphs();
        },
        delete_graph: function(index) {
            Graph.graph_names.splice(index,1);
            Graph.graph_list.splice(index,1);
            Template.generateAllGraphs();
        },
    }
    Operations = {
        convert : {
            table: function(table_id){

                var id = table_id;
                var $table = $('#'+id);
                //var name = $table.attr('data-name');
                var table_graphs = [];

                Data.datasets[id] = [];
                //get keys from headers
                header_keys = [];
                $('#'+id+' tr>th').each(function(j,item){
                    header_text = $(this).text();
                    header_keys.push(header_text)
                });
                //map tds to keys
                Data.datasets[id] = $('#'+id+' tr:has(td)').map(function(j,v) {
                    var $td =  $('td', this);
                    var table_object = {};
                    $(header_keys).each(function(k,key){
                        table_object[key] = $td.eq(k).text();
                    })
                    return table_object;
                }).get();
                //create graph_list with data attributes stored in table
                var graph_object = {
                    name: $table.attr('data-name') || 'Default Graph ' + Graph.graph_list.length,
                    independent_variable: $table.attr('data-independent-variable') || header_keys[0],
                    dependent_variable: $table.attr('data-dependent-variable') || header_keys[1], //find first numeric
                    size: $table.attr('data-size') || '2x1',
                    type: $table.attr('data-type') || 'column',
                    order: $table.attr('data-order') || 'None',
                    id: $table.attr('id') || table_id,
                    dataset_name: $table.attr('data-dataset-id') || table_id,
                    format: $table.attr('data-format') || 'number',
                    index: Graph.graph_list.length,
                };
                Graph.create_new_graph(graph_object);
                //Agile.create_graph(graph_object);
            },
            json: function(json){

            },
            csv: function(csv){

            },
        },
        exporting: {
            csv: function(object){

            },
            json: function(object){

            },
        },
        sorting: {
            quicksort: function(a,order) {
                var sorted_array;
                var qsort = function(a){
                    if (a.length == 0) return [];
                    var left = [],
                    right = [],
                    pivot = a[0];
                    for (var i = 1; i < a.length; i++) {
                        if(order== 'Ascending'){
                            a[i] < pivot ?
                                   left.push(a[i]) :
                                   right.push(a[i]);
                        }else if(order == 'Descending'){
                            a[i] > pivot ?
                                   left.push(a[i]) :
                                   right.push(a[i]);
                        }else{
                            a[i] < pivot ?
                                   left.push(a[i]) :
                                   right.push(a[i]);
                        }
                    }
                    return qsort(left).concat(pivot, qsort(right));
                }
                if(order &&
                   order !== "None"){
                    sorted_array = qsort(a);
                }else{
                    sorted_array = a;
                }
                return sorted_array;
            },
        },
        format_value: function(value, format) {
            switch (format) {
                case "number":
                    return (Math.round(value)).toLocaleString();
                case "number_hundredth":
                    return (Math.round(value * 100) / 100).toLocaleString();
                case "percent":
                    return (Math.round(value * 100) / 100).toFixed(2) + "%";
                case "currency":
                    return "$" + (Math.round(value)).toLocaleString();
                case "currency_cents":
                    return "$" + (Math.round(value*100)/10000).toFixed(2).toLocaleString();
                case "":
                    return value;
                case undefined:
                    return value;
                default:
                    console.log("Error format: " + format);
                    return value;
            }
        },
        parse_graph_size : function(graph_dimensions){

            graph_size_array = graph_dimensions.split('x');
            gw_units  = graph_size_array[0];
            gh_units = graph_size_array[1];

            graph_size_object = {
                width : {
                    units : gw_units,
                    col_md: gw_units * 2,
                },
                height : {
                    units : gh_units,
                    //gh_units * 30vh converted to pixels
                    //+ (10px * graph_height_unts);
                    //this number will vary based on the client's screen size
                    pixel_height : (gh_units *
                                    $(".vh30").height()) +
                                    (10*gh_units) +
                                    (35* (gh_units-1)),
                }
            }
            return graph_size_object;
        },
    }

    Data = {
        datasets : {},
        load_settings_dict : function(dataset_name){
            var new_graph = dataset_name == null || undefined ? true : false;
            var graph_name = Object.keys(Graph.graph_list[Data.selected_dataset_index]).toString();
            var this_graph = Graph.graph_list[Data.selected_dataset_index][graph_name];
            //load each setting according to selected dataset and, if !new_graph, graph state 
            $(Data.graph_settings_dict["attributes"]).each(function(i, attribute) {
                $("#select_graph_" + attribute).html('');
                $(Data.graph_settings_dict[attribute]).each(function(j, item) {
                    if(!new_graph){

                    }
                    if(this_graph[attribute] == item){
                        var $option = $('<option/>',{
                            value: item,
                            text: item,
                            'selected':'selected',
                        });
                    }else{
                        var $option = $('<option/>',{
                            value: item,
                            text: item,
                        });
                    }
                    if(Object.keys(Data.datasets).indexOf($option.value) == -1){
                        $("#select_graph_" + attribute).append($option);
                    }                        
                });
            });
        },
        graph_settings_dict : {
            attributes: ["type", "independent_variable", "dependent_variable","size","order","dataset_name","format"],
            dataset_name: [],
            type: ['bar', 'pie', 'column', 'area', 'scatter', 'line'],
            independent_variable: [],
            dependent_variable: [],
            size: ["1x1","1x2","1x3","2x1","2x2","2x3","3x1","3x2","3x3","4x1","4x2","4x3","5x1","5x2","5x3","6x1","6x2","6x3"],
            order: ["None","Ascending","Descending"],
            format:["currency","currency_cents","percent","number","number_hundredth"]
        },
    }

    Template.render();

}(window.agile = window.agile || {}, jQuery));