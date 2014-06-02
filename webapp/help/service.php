<?php

class Service {

        function __construct() {
                $dbhost = 'localhost';
                $dbuser = 'root';
                $dbpwd = '';
                $mysql_connect = mysql_connect($dbhost, $dbuser, $dbpwd) or die("Cannot access the database server (".$dbhost.")");
        }

        function listQuestions() {


                $tquery = "select * FROM (select * from `help`.faq where locale = '".$_GET["locale"]."' union select * from `help`.faq where sort_order not in (select sort_order from `help`.faq where locale='".$_GET["locale"]."') and locale is null) faq_locale order by sort_order;";
                $tresult = mysql_query($tquery) or die($this->sqlError);
		echo "[";
                while ($trow = mysql_fetch_array($tresult)) {
			echo "{";
			echo 'question:"'.$trow["question"].'",';
			echo 'answer:"'.$trow["answer"].'",';
			echo 'qno:"'.$trow["sort_order"].'",';
			echo "},";
                }
		echo "]";
                mysql_free_result($tresult);
        }

}
//$serv = new Service();
//$serv->listQuestions();
?>
[
                          {
                                  question: 'Third FAQ item',
                                  answer: 'Answer 3',
                                  qno: 2
                          },
                          {
                                  question: 'Fourth FAQ item',
                                  answer: 'Answer 4',
                                  qno: 3
                          },
                          ]

