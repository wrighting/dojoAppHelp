define({
  root: {
	  'default': {},
	  templateContext: {
		  organismshort: '<i>P. falciparum</i>',
		  Partnerstudies: 'partner studies'
	  },
	  variants: {
		  title: 'Help',
		  shortText: 'Short Text',
		  
		  bitmap : {
			  src: 'Bitmaps/datagrid2.png',
			  alt: 'datagrid'
		  },
		  helpDoc : {
			  dtlTemplate: "Help/dtl_Help1.htm"
		  }			  
	  },
	  samples: {
		  title: 'Help',
		  shortText: 'Short Text Sample',
		  
		  bitmap : {
			  src: 'Bitmaps/datagrid2.png',
			  alt: 'datagrid'
		  },
		  helpDoc : {
			  href: "Help/Help.htm"
		  }			  
	  },
	  faq: {
		  items: [
		          {
		        	  question: 'First FAQ item',
		        	  answer: 'Answer 1',
		        	  qno: 0
		          },
		          {
		        	  question: 'Second FAQ item',
		        	  answer: 'Answer 2',
		        	  qno: 1
		          },
		          ]
	  }
  }
});