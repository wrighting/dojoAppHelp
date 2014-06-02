define({
  root: {
	  'default': {},
	  templateContext: {
              boilerPlateText: 'Lorem ipsum'
	  },
	  help1: {
		  title: 'Help',
		  shortText: 'Short Text',
		  bitmap : {
			  src: 'images/helpimage.png',
			  alt: 'helpimage'
		  },
		  helpDoc : {
			  dtlTemplate: "helpText/dtl_help1.html"
		  }			  
	  },
	  help2: {
		  title: 'Help',
		  shortText: 'Short Text Sample',
		  helpDoc : {
			  href: "helpText/help.html"
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
