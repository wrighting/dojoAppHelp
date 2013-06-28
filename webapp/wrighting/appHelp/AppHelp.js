define([ "dojo/_base/declare", "dojo/_base/kernel", "dojo/_base/lang", "dojo/_base/array", "dojo/topic", "dijit/_WidgetBase",
         "dojo/store/JsonRest","dojo/store/Memory", "dojo/store/Cache", "dijit/Dialog",
         "dojox/dtl", "dojox/dtl/Context",
		"dojo/i18n!nls/jsAppHelpResources" ], function(
		declare, kernel, lang, array, topic, _WidgetBase, 
		JsonRest, Memory, Cache, Dialog, Template, Context, helpResources) {
	return declare([_WidgetBase], {

		resources: null,
		widgetNumber: null,
		reference: null,
		service: null,
		statics: {
			widgetCount: 0,
			stores: []
		},
		constructor : function() {
			this.widgetNumber = this.statics.widgetCount++;
		},
		postCreate: function() {
			this.fetchItems();
		},
		getIdPrefix: function () {
			return "jsAppHelp" + this.widgetNumber.toString();
		},
		hasExtendedHelp: function (helpDoc) {
			return (helpDoc && 
					(helpDoc.href || helpDoc.dtlTemplate));
		},
		createDialog: function (helpDoc) {
			var dialogOptions = {
					"style": helpDoc.dialogcssStyle,
					"class": helpDoc.dialogcssClass
				};
			if (helpDoc.href) {
				dialogOptions.href = helpDoc.href; 
			} else if (helpDoc.dtlTemplate) {
				template = new dojox.dtl.Template(helpDoc.dtlTemplate);
				context = new Context(helpResources.templateContext);
				dialogOptions.content = template.render(context);
			}
			return (new Dialog( dialogOptions ));
		},
		//Recursive mixin
		mixinDeep: function(dest, source) {
		     // Recursively mix the properties of two objects
		     var empty = {};
		     for (var name in source) {
		          if(!(name in dest) || 
		        		  (dest[name] !== source[name] && 
		        				  (!(name in empty) || empty[name] !== source[name]))) {
		               try {
		                    if ( source[name].constructor == Object ) {
		                         dest[name] = this.mixinDeep(dest[name], source[name]);
		                    } else {
		                         dest[name] = source[name];
		                    };
		               } catch(e) {
		                    // Property in destination object not set. Create it
							// and set its value.
		                    dest[name] = source[name];
		               };
		          };
		     }
		     return dest;
		},
		buildResource: function(reference, resource) {
			var myresources = {
					title: null, //If defined creates a titled pane
					shortText: '',
					cssClass: 'DQXIntroInfo',
					cssStyle: '',
					bitmap : {
						src: 'Bitmaps/datagrid2.png',
						style: 'float:left;margin-left:0px;margin-top:5px;margin-right:5px;margin-bottom:5px;',
						alt: 'info'
					},
					helpDoc : {
						href: null,
						dtlTemplate: null,
						cssImgClass: 'DQXHelpLink DQXIntroBoxHelpLink',
						cssTextClass: 'DQXHelpLink',
						linkText : ' More information...',
						dialogcssClass: '',
						dialogcssStyle: 'width: 50%;',
						bitmap : {
							src: 'Bitmaps/info4.png',
							style: 'float:left;margin-right:2px;border:0;',
							alt: 'Help'
						},
					}	  
				  };
			// call jquery
			//$.extend(true, obj1, obj2);
			this.mixinDeep(myresources, helpResources['default']);
			this.mixinDeep(myresources, resource);
			
			myresources.name = reference;
			return (myresources);
		},
		fixURLs : function (myresources) {
			if (myresources.bitmap) {
				myresources.bitmap.src = require.toUrl(myresources.bitmap.src);
			}
			
			if (myresources.helpDoc) {
				if (myresources.helpDoc.href) {
					myresources.helpDoc.href = require.toUrl(myresources.helpDoc.href);
				}
				if (myresources.helpDoc.dtlTemplate) {
					myresources.helpDoc.dtlTemplate = require.toUrl(myresources.helpDoc.dtlTemplate);
				}
				if (myresources.helpDoc.bitmap) {
					if (myresources.helpDoc.bitmap.src) {
						myresources.helpDoc.bitmap.src = require.toUrl(myresources.helpDoc.bitmap.src);
					}
				}
			}
		},
		fetchResource: function () {
			if (this.resource) {
				return (this.resource);
			}
			/*
			this.resource = this.buildResource(this.reference, helpResources[this.reference]);
			this.fixURLs(this.resource);
			*/
			this.resource = this.items[this.reference];
		},
		mergeItems: function (dbItems) {
			console.log("merging:" + this.service + ":" + this.widgetNumber);
			this.items = {};
			for (var item in helpResources) {
				this.items[item] = this.buildResource(item, helpResources[item]);
				var ref = item;
				array.forEach(dbItems, function(dbItem) {
					if (dbItem.name == ref) {
						this.mixinDeep(this.items[ref], this.items[ref]);
					}
				}, this);
				this.fixURLs(this.items[item]);
			}
			array.forEach(dbItems, function(dbItem) {
				if (!this.items[dbItem.name]) {
					var newItem = this.buildResource(dbItem.name, dbItem);
					this.fixURLs(this.items[item]);
					this.items[dbItem.name] = newItem;
				}
			}, this);
			topic.publish("jsAppHelp"+ this.widgetNumber, this);
		},
		fetchCachedItems: function(self) {
			if (self.statics.stores[self.service]) {
				store = self.statics.stores[self.service].mem;
				var data = store.query({});
				if (data.length == 0) {
					console.log("subscribing:" + self.service + ":" + self.statics.stores[self.service].event);
					self.statics.stores[self.service].dependencies.push(self);
				//first call hasn't returned yet
					topic.subscribe(self.statics.stores[self.service].event, self.fetchCachedItems);
				} else {
					console.log("merging");
					while((dep = self.statics.stores[self.service].dependencies.pop())) {
						dep.mergeItems(data);
					}
				}
			}
		},
		fetchItems: function () {
			if (this.service) {
				//Avoid reloading the help data
				var store;

				if (this.statics.stores[this.service]) {
					this.fetchCachedItems(this);
				} else {
					var cstore = {
							event: "jsAppHelp"+ this.widgetNumber,
							dependencies: []
					};
					cstore.serv = new JsonRest({
						target : this.service
					});
					cstore.mem = new Memory();
					cstore.cache = new Cache(cstore.serv, cstore.mem);
					this.statics.stores[this.service] = cstore;
					store = cstore.cache;
					var options = this;
					store.query("?locale=" + kernel.locale, {}).then(function(results) {
						options.mergeItems(results);
					});
				}
				
				
			} else {
				this.mergeItems(null);
			}
		},
	})
});