<snippet>
  <content>
# Agile.js
 
Agile.js is a jquery plugin that makes it easy to modify tables and create graphs from tables and csv's.

[Example Use](http://africanawiki.org/_blackbox/coontown/)

[Demo](http://mikejohnsonjr.com/projects/agile)
 
## Usage

To run the demo locally, clone the repo, cd into agile and do:
  
    python -m SimpleHTTPServer
 
To create a graph from a table: 

    Agile.createGraph({
        dataType:'table',
        identifier: '#myTable', //or .myTable 
    });

To create a graph from a csv:

    Agile.createGraph({
        dataType:'csv',
        identifier:'http://url.to/my.csv'
    })

To append a column in a table:

    Agile.tableOps.addColumn({
        name: 'My New Column',    //this will be displayed as the header text of the new column 
        col1: 'Benefit',          //header text of first column to base new column value off of
        col2: 'Cost',             //header text of second column to base new column value off of
        operation: 'subtract',    //operation to perform, in this case, col1 - col2
    })

When incorporating agile.js and agile_styles.css into your own projects for visualizations, be sure to include this in your html file:

    <div class="chartlist datasetlist" style="display:none"></div>
    <div class="vh30" style="display:none"></div>
    <div class="tables-container" style="display:none"></div>
    <div id="graph_panel_container"></div>

#Coming Soon

 - Defining Options during graph creation
 - Exporting (PNG/PDF/JPG/CSV/JSON) and Embedding (HTML5) Graphs and Tables
 - Converting JSON to Graph
 - D3 Integration
 
# Known Bugs

 - Treemap graph type conversion to any other graph renders black bar, working on a solution for this
 

## Credits
 
Creator: Mike Johnson Jr.

Graphs powered by: HighCharts
 
## License
 
Copyright (c) 2014 Mike Johnson Jr

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

</content>
</snippet>
