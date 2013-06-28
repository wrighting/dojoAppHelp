define([ "dojo/_base/declare", "dojo/parser", "dojo/ready",
         "dojo/_base/lang", "dojo/_base/array", "dojo/dom-construct", "dojo/_base/window", "dojo/on", "dojo/topic",
        "dijit/Dialog", "help/HelpIndex",
		"dojo/i18n!nls/jsAppHelpResources" ], function(
		declare, parser, ready, lang, array, domConstruct, win, on, topic,
		Dialog, HelpIndex, helpResources) {
	return declare("FAQIndex", [HelpIndex], {
		indexDialog: null,
		label: 'FAQ',
		service: null,
        templateString: '<a class="${baseClass}" href="#" data-dojo-attach-point="labelNode">${label}</a>',

        // A class to be applied to the root node in our template
        baseClass: "helpIndex",
		isValidItem: function (resource) {
			return (true);
		},
		mergeItems: function (dbQuestions) {
			var faqList = helpResources.faq;
			this.items = [];
			array.forEach(faqList.items, function(item) {
				this.items[item.qno] = item;
			}, this);
			//Db overwrites config
			array.forEach(dbQuestions, function(item) {
				this.items[item.qno] = item;
			}, this);
			topic.publish("jsAppHelp"+ this.widgetNumber, this);
		},
		createListItem: function (resource) {
			
			var dialogOptions = {
					title: this.label,
					"class": this.baseClass,
					content: resource.answer,
				};
			
			var diag = new Dialog( dialogOptions );
			linkProps = {
					innerHTML: resource.question
			}
			linkNode = domConstruct.create("li", linkProps);
			
			on(linkNode, "click", lang.hitch(diag,function(e) {
				this.show();
				}));
			return linkNode;
		}
	});
	ready(function() {
		parser.parse();
	})
});