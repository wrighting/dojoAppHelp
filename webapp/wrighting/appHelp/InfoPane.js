define([ "dojo/_base/declare", "dojo/_base/lang", "dijit/_WidgetBase","dojo/dom-construct", "dojo/dom-attr", "dojo/_base/window", "dojo/on","dojo/topic",
         "dijit/TitlePane", "dijit/layout/ContentPane", "help/AppHelp" ], function(
        		 declare, lang, _WidgetBase, domConstruct, domAttr, win, on, topic, TitlePane, ContentPane, AppHelp) {
	return declare("InfoPane", [AppHelp,_WidgetBase], {

		helpPane : null,
		helpTitlePane : null,
		helpTextPane: null,
		helpDialog: null,
		reference: null,
		buildRendering : function() {
			
			this.domNode = domConstruct.create("span");
			
			this.own (
					topic.subscribe("jsAppHelp"+ this.widgetNumber, this.buildPane)
					);
			
		},
		buildPane : function(self) {
			
			self.fetchResource();
			if (self.resource.title) {
				self.helpTitlePane = new TitlePane({
					id : self.getIdPrefix() + "HelpTitle",
					title : self.resource.title
				});
			}
			
			self.helpContent = new ContentPane({
				id : self.getIdPrefix() + "HelpContent"
			});
			var helpText = '';
			if (self.resource.bitmap) {
				self.helpContent.domNode.appendChild(domConstruct.create("img",self.resource.bitmap));
			}
			if (self.hasExtendedHelp(self.resource.helpDoc)) {
				var myDialog = self.helpDialog = self.createDialog(self.resource.helpDoc);
				linkNode = domConstruct.create("span", {
					"id" : self.getIdPrefix() +"helpLinkImg",
					"class": self.resource.helpDoc.cssImgClass
				});

				on(linkNode, "click", function(e) { myDialog.show()});
				
				linkNode.appendChild(domConstruct.create("img",self.resource.helpDoc.bitmap));

				self.helpContent.domNode.appendChild(linkNode);
	        }

			self.helpContent.domNode.appendChild(win.doc.createTextNode(self.resource.shortText));
			
			if (self.hasExtendedHelp(self.resource.helpDoc)) {
				var myDialog = self.helpDialog;
				linkNode = domConstruct.create("a", {
					"id" : self.getIdPrefix() +"helpLinkText",
					"class": self.resource.helpDoc.cssTextClass
				});
				on(linkNode, "click", function(e) { myDialog.show()});
	            linkNode.appendChild(win.doc.createTextNode(self.resource.helpDoc.linkText));
	            self.helpContent.domNode.appendChild(linkNode);
	        }
			
			
			if (self.helpTitlePane) {
				self.helpTitlePane.addChild(self.helpContent);
				self.helpPane = self.helpTitlePane;
			} else {
				self.helpPane = self.helpContent;
			}

			if (self.resource.cssClass) {
				domAttr.set(self.domNode, "class", self.resource.cssClass);
			}
			self.domNode.appendChild(self.helpPane.domNode);
			
			
			
		},
		getHelpPane: function () {
			return this.helpPane;
		}

	})
});
