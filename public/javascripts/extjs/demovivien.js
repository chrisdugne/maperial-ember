Ext.require(['*']);

Ext.onReady(function(){

    var cPick = Ext.create('Ext.picker.Color',{
        value: '993300',  // initial selected color
        renderTo: Ext.getBody(),
        listeners: {
            select: function(picker, selColor) {
               alert(selColor);
            }
        }
    });

    var states = Ext.create('Ext.data.Store', {
         fields: ['abbr', 'name'],
         data : [
            {"abbr":"AL", "name":"Alabama"},
            {"abbr":"AK", "name":"Alaska"},
            {"abbr":"AZ", "name":"Arizona"}
            //...
         ]
    });

	var comboTest = Ext.create('Ext.form.ComboBox', {
	    fieldLabel: 'Choose State',
	    store: states,
	    queryMode: 'local',
	    displayField: 'name',
	    valueField: 'abbr',
	    renderTo: Ext.getBody()
	});

	Ext.define('Ext.ux.CustomSpinner', {
	    extend: 'Ext.form.field.Spinner',
	    alias: 'widget.customspinner',
	
	    // override onSpinUp (using step isn't neccessary)
	    onSpinUp: function() {
	        var me = this;
	        if (!me.readOnly) {
	            var val = parseInt(me.getValue().split(' '), 10)||0; // gets rid of " Pack", defaults to zero on parse failure
	            me.setValue((val + me.step) + ' Pack');
	        }
	    },
	
	    // override onSpinDown
	    onSpinDown: function() {
	        var val, me = this;
	        if (!me.readOnly) {
	           var val = parseInt(me.getValue().split(' '), 10)||0; // gets rid of " Pack", defaults to zero on parse failure
	           if (val <= me.step) {
	               me.setValue('Dry!');
	           } else {
	               me.setValue((val - me.step) + ' Pack');
	           }
	        }
	    }
	});

	var spinTest = Ext.create('Ext.form.FormPanel', {
	    title: 'Form with SpinnerField',
	    bodyPadding: 5,
	    width: 350,
	    renderTo: Ext.getBody(),
	    items:[{
	        xtype: 'customspinner',
	        fieldLabel: 'How Much Beer?',
	        step: 6
	    }]
	});

    var item1 = Ext.create('Ext.Panel', {
        title: 'Configure roads',
        html: '&lt;empty panel&gt;',
        cls:'empty',
        items: [ cPick, comboTest, spinTest,
             	{
		            xtype: 'fieldcontainer',
		            fieldLabel: 'Toppings',
		            defaultType: 'checkboxfield',
		            items: [
		                {
		                    boxLabel  : 'Anchovies',
		                    name      : 'topping',
		                    inputValue: '1',
		                    id        : 'checkbox1'
		                }, {
		                    boxLabel  : 'Artichoke Hearts',
		                    name      : 'topping',
		                    inputValue: '2',
		                    checked   : true,
		                    id        : 'checkbox2'
		                }, {
		                    boxLabel  : 'Bacon',
		                    name      : 'topping',
		                    inputValue: '3',
		                    id        : 'checkbox3'
		                }
		            ]
		        }                       
				]
    });

    var item2 = Ext.create('Ext.Panel', {
        title: 'Configure building',
        html: '&lt;empty panel&gt;',
        cls:'empty'
    });

    var item3 = Ext.create('Ext.Panel', {
        title: 'Configure points',
        html: '&lt;empty panel&gt;',
        cls:'empty'
    });

    var item4 = Ext.create('Ext.Panel', {
        title: 'Accordion Item 4',
        html: '&lt;empty panel&gt;',
        cls:'empty'
    });

	var storeTree = Ext.create('Ext.data.TreeStore', {
	    root: {
	        expanded: true,
	        children: [
	            { text: "Road", leaf: true },
	            { text: "Building", expanded: true, children: [
	                { text: "town", leaf: true },
	                { text: "sports", leaf: true}
	            ] },
	            { text: "Rivrs", leaf: true }
	        ]
	    }
	});


	var treeTest = Ext.create('Ext.tree.Panel', {
	    title: 'Simple Tree',
	    width: 200,
	    height: 150,
	    store: storeTree,
	    rootVisible: false,
	    renderTo: Ext.getBody()
	});


    var item5 = Ext.create('Ext.Panel', {
        title: 'Config tree',
        html: '&lt;empty panel&gt;',
        cls:'empty',
       id : 'treeView',
        items : [ treeTest ]
    });

    var item6 = Ext.create('Ext.Panel', {
        title: 'Accordion Item 6',
        html: '&lt;empty panel&gt;',
        cls:'empty'
    });

    var accordion = Ext.create('Ext.Panel', {
        title: 'Layer config',
        collapsible: true,
        collapsed : false,
        region:'west',
        margins:'5 0 5 5',
        split:true,
        width: 210,
        layout:'accordion',
        items: [item1, item2, item3, item4, item5]
    });

    var accordion2 = Ext.create('Ext.Panel', {
        title: 'Color scale',
        collapsible: true,
        collapsed : true,
        region:'east',
        margins:'5 0 5 5',
        split:true,
        width: 210,
        layout:'accordion',
        items: [item6]
    });

    var mapcenter = Ext.create('Ext.Panel',{
        title: 'Mapnify (ExtJs API layout sandbox)',
        region:'center',
        layout:'fit',
        id:'external_content_panel',
        xtype:'panel',
        bodyStyle: 'padding:0px',
        border: false,
        scope:this,
//                html: '<img src="/project/bk.jpg" width="100%" height="100%"></img>',
//        html: '<iframe src="map.html" width="100%" height="100%"></iframe>'
                  html: '<div id="map_canvas"></div>'
    });

    var cbar = Ext.create('Ext.Panel',{
        title: 'ColorBar',
        region:'east',
        collapsible: true,
        collapsed : true,
        margins:'5 0 5 5',
        split:true,
        width: 210,
        layout:'fit',
        html: '<iframe src="mycarto/wwwClient/cb1.html" width="100%" height="100%"></iframe>',
    });

	function doMin() {
	  if ( this.collapsed ){
	      this.expand();
	  }
	  else{
	      this.collapse(false);
	  }
	}


    var window = Ext.create('Ext.Window',{
        title : "Layer config (floating)",
        x : 800,
        y : 70,
        width : 300,
        height : 600,
        minimizable :true,
        layout : 'accordion',
        closable : false,
        items: [ item1, item2 ,item3, item4 ]               
    });

    window.show();
    window.on('minimize', doMin, window);
            
    var window2 = Ext.create('Ext.Window',{
        title : "ColorBar config (floating)",
        x : 250,
        y : 50,
        width : 300,
        height : 710,
        minimizable :true,
        layout : 'fit',
        closable : false,
        html: '<iframe src="mycarto/wwwClient/cb1.html" width="100%" height="100%"></iframe>',
    });

    window2.show();
    window2.on('minimize', doMin, window2);

    var viewport = Ext.create('Ext.Viewport', {
        layout:'border',
        items:[ accordion, cbar, mapcenter ]
    });

});