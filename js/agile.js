/*
 * Agile.js 
 * https://github.com/audioburn/agile
 *
 * Copyright 2014, Mike Johnson, Jr.
 * https://mikejohnsonjr.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

(function(agile, $, undefined){

    Agile = {
        createGraph : function(object){
            Operations.convert[object.dataType](object.identifier);
        },
        updateGraph: function(graphName,object){
            var index = Graph.graphNames.indexOf(graphName);
            var oldGraphObject = Graph.graphList[index][graphName];
            var newGraphObject = $.extend(true, oldGraphObject, object);
            Graph.saveGraphSettings(oldGraphObject,newGraphObject)
        },
        deleteGraph: function(graphName){
            var index = Graph.graphNames.indexOf(graphName);
            Graph.deleteGraph(index);
        },
        exportGraph: function(object,exportTo){
            
        },
        getEmbedCode: function(graphName){

        },
        tableOps : {
            addColumn : function(tableId,object){
                var newColName = object.name;
                var col1Name = object.col1;
                var col2Name = object.col2;
                var operation = object.operation;

                //get keys from headers
                headerKeys = [];
                $(tableId+' tr>th').each(function(j,item){
                    headerText = $(this).text();
                    headerKeys.push(headerText)
                });
                $(tableId + ' tr').each(function(i,row){ 
                    var $this = $(this);  
                    if(i==0){
                        //create header row
                        $cell = $('<th/>',{
                            text: newColName,
                        });

                    }else{

                        var rowText = function(){
                            var col1Index = headerKeys.indexOf(col1Name);
                            var col2Index = headerKeys.indexOf(col2Name);

                            var col1CellValue = parseFloat($this.find('td').eq(col1Index).text());
                            var col2CellValue = parseFloat($this.find('td').eq(col2Index).text());

                            var parseOp = {
                                add: function(){
                                    return col1CellValue + col2CellValue;
                                },
                                subtract: function(){
                                    return col1CellValue - col2CellValue;
                                },
                                multiply: function(){
                                    return col1CellValue * col2CellValue;
                                },
                                divide: function(){
                                    return col1CellValue / col2CellValue;
                                },
                            }
                            return parseOp[operation]();
                            
                        }
                        $cell = $('<td/>',{
                            text: rowText(),
                        });
                    }        
                    $this.append($cell);

                });
            },
            addRow : function(TableId,cellArray){

            },
        },
    }
    Template = {
        graphPanels: [],
        render : function(){
            Template.setup.changeEvents();
            Template.setup.clickEvents();
            Template.setup.hoverEvents();
            Template.setup.customEvents();
        },
        setup: {
            changeEvents : function(){
                $("#select_graph_dataset_name").change(function(e){
                    var selectedDataset = $("#select_graph_dataset_name :selected").val();
                    Data.selectedDatasetIndex = Object.keys(Data.datasets).indexOf(selectedDataset);
                    Data.updateSettingsIvDv(selectedDataset);
                });
            },
            clickEvents : function(){
                //sort graphs onclick
                $(".graph-sort-button").unbind('click').click(function(e){
                    var $this = $(this);
                    var graphName = $this.attr('data-sort-for');
                    var order = $this.attr('data-sort');
                    var thisGraph = Graph.graphObjects[graphName];
                    Graph.saveGraphSettings(
                        Graph.graphList[Graph.graphNames
                             .indexOf(graphName)]
                             [graphName],{
                        'dataset':thisGraph.dataset,
                        'dataset_name':thisGraph['dataset_name'],
                        'name': thisGraph['name'],
                        'independent_variable': thisGraph['independent_variable'],
                        'dependent_variable': thisGraph['dependent_variable'],
                        'size': thisGraph['size'],
                        'order': order,
                        'type': thisGraph['type'],
                        'format':thisGraph['format'],
                        'id': thisGraph.name.replace(/ /g, '_'),
                        'index': thisGraph['index'],
                    });
                });
            },
            hoverEvents : function(){
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
            customEvents : function(){

            },
        },
        
        generateAllGraphs: function() {
            $(".graph-panel").remove();
            $(Graph.graphList).each(function(i, item) {
                if (typeof item == "object") {
                    //get graph object of index i from Graph.graph_list
                    //generate graph panel html for that object
                    var graphListObject = item[Object.keys(item).toString()];
                    var graphDimensions = Operations.parseGraphSize(graphListObject.size);

                    var $graphPanel = $("<li/>", {
                        class: 'panel-box col-md-' + graphDimensions.width.colMd + ' no-padding graph-panel',
                    });
                    var $graphPanelHeader = $('<div/>', {
                        class: 'col-md-12 panel-header',
                    });
                    var $graphPanelHeaderSortAsc = $("<span/>", {
                        class:'floatright glyphicon glyphicon-chevron-up graph-sort-button descriptive',
                        'data-sort-asc-id': "graph_sort_asc_"+i,
                        'data-sort-for':graphListObject.name,
                        'data-sort': "Ascending",
                        'data-description':'Sort ' + graphListObject.name + ' items in ascending order.',
                    });
                    var $graphPanelHeaderSortDesc = $('<span/>', {
                        class:'floatright glyphicon glyphicon-chevron-down graph-sort-button descriptive',
                        'data-sort-desc-id': 'graph_sort_desc_'+i,
                        'data-sort-for':graphListObject.name,
                        'data-sort': 'Descending',
                        'data-description':'Sort ' + graphListObject.name +' items in descending order.',
                    });
                    var $graphPanelHeaderSettings = $('<span/>', {
                        class: 'floatright glyphicon glyphicon-cog graph-settings-modal-icon descriptive',
                        'data-settings-id': 'graph_settings_' + i,
                        'data-settings-for': graphListObject.name,
                        'data-description': 'Adjust graph settings for ' + graphListObject.name + '.',
                    });
                    var $graphPanelHeaderTitle = $('<div/>', {
                        class: 'floatleft descriptive',
                        'data-description': graphListObject['independent_variable'] + ' vs. ' + graphListObject['dependent_variable'],
                        text: graphListObject.name,
                        'data-title-id': 'graph_title_' + i,
                    });
                    var $graphPanelBody = $('<div/>', {
                        class: 'panel-body-custom no-padding',
                        'data-graph-name': graphListObject.name,
                        'data-graph-id': graphListObject.id,
                    });

                    $('#graph_panel_container').append(
                        $graphPanel.append(
                            [
                                $graphPanelHeader.append(
                                [
                                    $graphPanelHeaderTitle,
                                    $graphPanelHeaderSettings,
                                    $graphPanelHeaderSortAsc,
                                    $graphPanelHeaderSortDesc
                                ]), 
                                $graphPanelBody,
                            ]
                        )
                    );

                    $('[data-settings-id="graph_settings_'+i+'"]').click(function() {
                        Graph.loadGraphSettings(i);
                    });

                    Template.graphPanels.push($graphPanel);
                }
            });
            Graph.updateAllGraphs();
        },
    }
    Graph = {
        graphList : [],
        graphNames: [],
        graphObjects: [],
        updateAllGraphs: function() {
            $(".chartlist").html('');
            $(Graph.graphList).each(function(i, item) {
                //update all graphs
                if (typeof item == "object") {
                    //update each graph
                    Graph.updateGraph(item);
                    //Display charts in dashboard
                    var graphName = item[Object.keys(item).toString()].name;
                    var outputElement = $("<li/>", {
                        "data-value": graphName,
                        text: graphName,
                    });

                    $(".chartlist").append(outputElement);
                }
            });
            if(Graph.graphList.length == 0){
                $(".chartlist").append("<li>No charts to display.</li>")
            }
            Data.graphSettingsDict['dataset_name'] = Object.keys(Data.datasets);
            Template.render();
        },
        //update one particular graph
        updateGraph: function(graphObject) {

            var graphListObject = graphObject[Object.keys(graphObject).toString()];
            var index = graphListObject.index;
            var graphName = graphListObject.name;
            
            $("*[data-id='graph_title_" + index +"']").text(graphName);
            //copy graph_list_object to Graph.graphs[graph_name]
            Graph.graphObjects[graphName] = $.extend({}, graphListObject)
            var thisGraph = Graph.graphObjects[graphName];
            var hoveredGraph = Graph.graphObjects[Data.hgName];

            thisGraph.dimensions = Operations.parseGraphSize(graphListObject.size);
            thisGraph.pixelHeight = thisGraph.dimensions.height.pixelHeight;
            thisGraph.dataset = [];
            Graph.outputItems = [];
            
            var generateDataset = function(){
                var rawDataset = Data.datasets[thisGraph['dataset_name']];
                thisGraph.dataset = rawDataset.map(function(item){
                    var iv = item[thisGraph['independent_variable']];
                    var dv = parseFloat(item[thisGraph['dependent_variable']]);
                    if(isNaN(dv)){
                        console.log("Dependent Variable : "+dv);
                        console.log("Your dependent variable must be numeric.");
                    }else{
                        return [iv,dv];
                    }
                }); 
            }

            generateDataset();
            
            //set sorted dataset
            thisGraph.sortedDatasetValues = Operations.sorting.quicksort(
                thisGraph.dataset.map(function(item){
                    return item[1];
            }),thisGraph.order);
            thisGraph.sortedDataset = [];
            var datasetValues = thisGraph.dataset.map(function(item){
                return item[1];
            });
            var sortedDatasetValueIndeces = [];
            $(thisGraph.sortedDatasetValues).each(function(i,value){
                sortedDatasetValueIndeces.push(datasetValues.indexOf(value));
            });
            $(sortedDatasetValueIndeces).each(function(i,index){
                thisGraph.sortedDataset.push(thisGraph.dataset[index]);
            });
            //set dataset sum
            thisGraph.datasetSum = 0;
            $(thisGraph.dataset).each(function(i, item){
                var name = item[0];
                var value = item[1];
                thisGraph.datasetSum += value;
            });
            $("*[data-graph-id='"+thisGraph.id+"']").highcharts({
                chart: {
                    type: thisGraph.type,
                    height: thisGraph.pixelHeight,
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
                        text: thisGraph['independent_variable'],
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
                        text: thisGraph['dependent_variable']
                    },
                },
                legend: {
                    enabled: true
                },
                series: [
                    {
                        name: thisGraph['dependent_variable'],
                        data: thisGraph.sortedDataset,
                        innerSize: "50%",
                        size: '55%',
                        cursor:'pointer',
                        events: {

                        },
                        dataLabels: {
                            formatter: function() {
                                //generate labels for top 5 products
                                //line break every 3 spaces for formatting
                                var splitName = this.point.name.split(' ');
                                $(split_name).each(function(i,item){
                                    if(i%3==0 && i !== 0){
                                        splitName.splice(i,0,"<br>")
                                    }
                                });
                                var formattedName = splitName.join(' ');
                                return this.y > thisGraph.sortedDatasetValues[2] ?
                                                formattedName +
                                                ':<br> <b>' +
                                                Operations.formatValue(this.y,thisGraph.format) +
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
                        var hoveredGraph = Graph.graphObjects[Data.hgName];
                        var name = this.key;
                        return "<div>"+name +
                               ": " +
                               hoveredGraph['dependent_variable'] +
                               "= <b>" +
                                Operations.formatValue(this.y,hoveredGraph.format) +
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
                Data.hgName = $(this).find('[data-graph-name]').attr('data-graph-name');
            });
        },
        loadGraphSettings: function(index) {

            var newGraph = index == null || undefined ? true : false;
            var thisGraph = Graph.graphList[index];    

            if (newGraph) {
                //creating new graph
                var graphName = "";
                var modalTitle = "New Graph";
            } else {
                //editing existing graph
                Data.sgIndex = index;
                Data.selectedDatasetIndex = index;
                var graphName = Object.keys(thisGraph).toString();
                var graphObject = thisGraph[graphName];
                var modalTitle = graphName + " settings";
                //set iv and dv in settings dict, depending on the dataset selected
                var possibleVariables = Object.keys(Data.datasets[graphObject['dataset_name']][0]);
                var dict = Data.graphSettingsDict;
                dict['independent_variable'] = possibleVariables;
                dict['dependent_variable'] = possibleVariables;
            }

            //fill elements appropriately
            $("#graph_title").text(modalTitle);
            $("#graph_name_input").val(graphName);

            Data.loadSettingsDict(graphName,graphObject['dataset_name']);
            //delete button
            $("#delete_graph").html('');
            if(!newGraph){
                $deleteGraphElement = $("<a/>",{
                    id:"delete_graph_button",
                    text:"-Delete this graph",
                    href:"#"
                });
                $("#delete_graph").append($deleteGraphElement);
                $("#delete_graph_button").click(function(e){
                    Graph.deleteGraph(index);
                });
            }
            //save button
            //unbind present so click does not execute more than once
            $("#save_graph_settings_button").unbind("click").click(function() {
                if($("#graph_name_input").val().length < 3){
                    alert("Your graph must be at least 3 characters long.");
                }else{
                    //create new object from input values
                    var index = newGraph ? Graph.graphList.length : index;
                    var newGraphObject = {
                        'name': $("#graph_name_input").val(),
                        'dataset_name': $("#select_graph_dataset_name :selected").text(),
                        'independent_variable': $("#select_graph_independent_variable :selected").text(),
                        'dependent_variable': $("#select_graph_dependent_variable :selected").text(),
                        'type': $("#select_graph_type :selected").text(),
                        'size': $("#select_graph_size :selected").text(),
                        'order': $("#select_graph_order :selected").text(),
                        'format': $("#select_graph_format :selected").text(),
                        'index': Data.sgIndex,
                        'id': $("#graph_name_input").val(),
                    };
                    if (!newGraph) {
                        Graph.saveGraphSettings(graphObject, newGraphObject);
                    } else {
                        Graph.graph.createNewGraph(newGraphObject);
                    }
                }
            });

            $("#graph_settings_modal").modal();
        },
        saveGraphSettings: function(oldGraphObject, newGraphObject) {
            var name = newGraphObject.name;
            var graphList = Graph.graphList;
            graphList[oldGraphObject.index] = {};
            graphList[oldGraphObject.index][name] = newGraphObject;
            Template.generateAllGraphs();
        },
        createNewGraph: function(graphObject) {
            var g = graphObject;
            //if name is already taken, add index to name to distinguish from other graph(s)
            g.name = Graph.graphNames.indexOf(g.name) > -1 ? g.name + ' ('+g.index+')' : g.name;
            //add index to object id, save
            g.id = g.id.replace(/ /g, '_')+'_'+g.index;
            var graphList = Graph.graphList;
            Graph.graphNames.push(g.name);
            graphList[g.index] = {};
            graphList[g.index][g.name] = graphObject;
            Template.generateAllGraphs();
        },
        deleteGraph: function(index) {
            Graph.graphNames.splice(index,1);
            Graph.graphList.splice(index,1);
            Template.generateAllGraphs();
        },
    }
    Operations = {
        convert : {
            table: function(tableId){

                var id = tableId.replace(/#|\./g,'');
                var $table = $(tableId);
                //var name = $table.attr('data-name');
                var tableGraphs = [];

                Data.datasets[id] = [];
                //get keys from headers
                headerKeys = [];
                $(tableId+' tr>th').each(function(j,item){
                    headerText = $(this).text();
                    headerKeys.push(headerText)
                });
                //map tds to keys
                Data.datasets[id] = $(tableId+' tr:has(td)').map(function(j,v) {
                    var $td =  $('td', this);
                    var tableObject = {};
                    $(headerKeys).each(function(k,key){
                        tableObject[key] = $td.eq(k).text();
                    })
                    return tableObject;
                }).get();

                //find first numeric header key
                var firstNumericHk;
                $(headerKeys).each(function(i,key){
                    if(!isNaN(Data.datasets[id][0][key])){
                        firstNumericHk = key;
                        return false;
                    }
                });
                //create graph_list with data attributes stored in table
                var graphObject = {
                    'name': $table.attr('data-name') || 'Default Graph ' + Graph.graphList.length,
                    'independent_variable': $table.attr('data-independent-variable') || headerKeys[0],
                    'dependent_variable': $table.attr('data-dependent-variable') || firstNumericHk, 
                    'size': $table.attr('data-size') || '2x1',
                    'type': $table.attr('data-type') || 'column',
                    'order': $table.attr('data-order') || 'None',
                    'id': $table.attr('id') || id,
                    'dataset_name': $table.attr('data-dataset-id') || id,
                    'format': $table.attr('data-format') || 'number',
                    'index': Graph.graphList.length,
                };
                Graph.createNewGraph(graphObject);
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
                var sortedArray;
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
                    sortedArray = qsort(a);
                }else{
                    sortedArray = a;
                }
                return sortedArray;
            },
        },
        formatValue: function(value, format) {
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
        parseGraphSize : function(graphDimensions){
            graphSizeArray = graphDimensions.split('x');
            gwUnits  = graphSizeArray[0];
            ghUnits = graphSizeArray[1];
            graphSizeObject = {
                width : {
                    units : gwUnits,
                    colMd: gwUnits * 2,
                },
                height : {
                    units : ghUnits,
                    //gh_units * 30vh converted to pixels
                    //+ (10px * graph_height_unts);
                    //this number will vary based on the client's screen size
                    pixelHeight : (ghUnits *
                                    $(".vh30").height()) +
                                    (10*ghUnits) +
                                    (35* (ghUnits-1)),
                }
            }
            return graphSizeObject;
        },
    }

    Data = {
        datasets : {},
        loadSettingsDict : function(){
            //var new_graph = dataset_name == null || undefined ? true : false;
            var graphName = Object.keys(Graph.graphList[Data.selectedDatasetIndex]).toString();
            var thisGraph = Graph.graphList[Data.selectedDatasetIndex][graphName];
            //load each setting according to selected dataset and, if !new_graph, graph state 
            $(Data.graphSettingsDict['attributes']).each(function(i, attribute) {
                $("#select_graph_" + attribute).html('');
                $(Data.graphSettingsDict[attribute]).each(function(j, item) {
                    //if(!new_graph){}
                    var $option = $('<option/>',{
                        class: attribute + '_attr',
                        value: item,
                        text: item,
                        'selected':thisGraph[attribute] == item ? 'selected' : false,
                    });
                    //dont re-append existing datasets
                    if(Object.keys(Data.datasets).indexOf($option.value) == -1){
                        $("#select_graph_" + attribute).append($option);
                    }
                });
            });
        },
        updateSettingsIvDv : function(selectedDataset){
            var graphName = Object.keys(Graph.graphList[Data.selectedDatasetIndex]).toString();
            var thisGraph = Graph.graphList[Data.selectedDatasetIndex][graphName];
            var possibleVariables = Object.keys(Data.datasets[selectedDataset][0]);
            var dict = Data.graphSettingsDict;
            var elements = {
                'independent_variable' : $('#select_graph_independent_variable'),
                'dependent_variable' : $('#select_graph_dependent_variable'),
            }
            var ivdv = ['independent_variable','dependent_variable'];
            $(ivdv).each(function(i,varType){
                dict[varType] = possibleVariables;
                elements[varType].html('');
                $(possibleVariables).each(function(i,variable){
                    var $option = $('<option/>',{
                        value: variable,
                        text: variable,
                        selected: thisGraph[varType] == variable ? 'selected' : false,
                    });      
                    elements[vartype].append($option.clone());
                });
            });
        },
        graphSettingsDict : {
            'attributes': ["type", "independent_variable", "dependent_variable","size","order","dataset_name","format"],
            'dataset_name': [],
            'type': ['bar', 'pie', 'column', 'area', 'scatter', 'line'],
            'independent_variable': [],
            'dependent_variable': [],
            'size': ["1x1","1x2","1x3","2x1","2x2","2x3","3x1","3x2","3x3","4x1","4x2","4x3","5x1","5x2","5x3","6x1","6x2","6x3"],
            'order': ["None","Ascending","Descending"],
            'format':["currency","currency_cents","percent","number","number_hundredth"]
        },
    }

    Template.render();

}(window.agile = window.agile || {}, jQuery));