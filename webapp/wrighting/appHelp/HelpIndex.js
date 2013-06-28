define([ "dojo/_base/declare", "dojo/parser", "dojo/ready", "dijit/_WidgetBase", "dijit/_TemplatedMixin",
         "dojo/_base/lang", "dojo/_base/array", "dojo/dom-construct", "dojo/_base/window", "dojo/on", "dojo/topic",
         "dijit/Dialog", "help/AppHelp",
		"dojo/i18n!nls/jsAppHelpResources" ], function(
		declare, parser, ready, _WidgetBase, _TemplatedMixin, 
		lang, array, domConstruct, win, on, topic,
		Dialog, AppHelp, helpResources) {
	return declare("HelpIndex", [AppHelp, _TemplatedMixin], {
		indexDialog: null,
		label: 'Help Index',
		// Our template - important!
        templateString: '<a class="${baseClass}" href="#" data-dojo-attach-point="labelNode">${label}</a>',

        // A class to be applied to the root node in our template
        baseClass: "helpIndex",
		constructor: function () {
			
		},
		buildDialog : function(self) {
			var list = domConstruct.create("ul", {
				'class': this.baseClass
			});
			var resources = self.items;
			if ( resources.constructor == Object ) {
				for (var resource in resources) {
					if (self.isValidItem(resource)) {
						list.appendChild(self.createListItem(resources[resource]));
					}
				}
			} else if (resources.constructor == Array) {
				array.forEach(resources, function(resource) {
					if (self.isValidItem(resource)) {
						list.appendChild(self.createListItem(resource));
					}
				}, self);
			}
			var dialogOptions = {
					content: list
				};
			
			self.indexDialog = new Dialog( dialogOptions );			
		},
		isValidItem: function (resource) {
			return (resource && 
					!(resource == 'default' || resource == 'templateContext' || resource == 'faq'));
		},
		createListItem: function (resource) {
			var ah = {};		
			ah.helpDialog = this.createDialog(resource.helpDoc);
			linkProps = {
					innerHTML: resource.name
			}
			linkNode = domConstruct.create("li", linkProps);
			
			on(linkNode, "click", lang.hitch(ah,function(e) {
				this.helpDialog.show();
				}));
			return linkNode;
		},
        postCreate: function(){
        	this.own (
        			topic.subscribe("jsAppHelp"+ this.widgetNumber, this.buildDialog)
        			);
			this.fetchItems();
        	this.own (
        			on(this.domNode, "click", lang.hitch(this, function(e){ 
        				this.indexDialog.show();
        				}))
            );
        },
	});
	ready(function() {
		parser.parse();
	})
});