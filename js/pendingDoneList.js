(function($) {
    'use strict';
    $(function() {
        if ($("#pending-list").length) {
            setInterval(() => {
                getCapacity().then((response) => {

                    const finishedList = response.finishedList;
                    const waitingList = response.waitingList;

                    // 為空的時候，顯示訊息
                    if(waitingList && waitingList.length === 0)
                        document.getElementById('pending-list').innerHTML = '目前無人等待中';
                    if(finishedList && finishedList.length === 0)
                        document.getElementById('done-list').innerHTML = '目前無完成';

                    // 不為空的時候，才做清空
                    if(document.getElementById('done-list').innerHTML !== '目前無完成') {
                        cleanInnerHtmlById('done-list');
                    }
                    if(document.getElementById('pending-list').innerHTML !== '目前無人等待中')
                        cleanInnerHtmlById('pending-list');

                    if(waitingList && waitingList.length !== 0)
                        updatePendingLiHtmlElement(waitingList);
                    if(finishedList && finishedList.length !== 0)
                        updateDoneLiHtmlElement(finishedList);
                });
            }, 2000);
        }
        $(document).ready(createLineChart);
      $(document).bind("kendo:skinChange", createLineChart);
      $(document).ready(createBarChart);
    $(document).bind("kendo:skinChange", createBarChart);
    });
    function createLineChart() {
              var month = moment().format("MMM");
              var date = moment().format("DD");
              var currentCapacityList = [];
              var maxCapacityList = [];
              var Linechartoptions={
                transitions: false,
                /*title: {
                    text: "Current Capacity %"
                },*/
                legend: {
                  position: "bottom"
                },
                chartArea: {
                  background: ""
                },
                seriesDefaults: {
                  type: "line",
                  style: "smooth",
                  markers: {
                    visible: false,
                    size: 3
                  },

                },
                series: [{
                  name: "Max Capacity",
                  data: maxCapacityList,
                  color: "red",
                }, {
                  name: "Current Capacity",
                  data: currentCapacityList,
                  color: "blue",
                }],
                valueAxis: {

                  labels: {
                    format: "{0}人"
                  },
                  line: {
                    visible: false
                  },
                  axisCrossingValue: -10,
                  title: {
                    text: "容量(人)"
                  },

                },
                categoryAxis: {
                  title: {
                    text: "時間"
                  }
                },
                tooltip: {
                  visible: true,
                  format: "{0}%",
                  template: "#= value #"
                }
              };
              $("#capacityChart").kendoChart(Linechartoptions);

              // 固定每0.5秒拿一次資料
              var keepGoing = true;
              var intervalId = window.setInterval(function () {
                $.ajax({
                  url: "http://localhost:8080/bank/loan/capacity",
                  method: "GET",
                  crossDomain: true,
                  dataType: "json",
                }).done(function (req) {
                  console.log(req);
                  if (keepGoing) {
                    currentCapacityList.push(req.current * 1000);
                    maxCapacityList.push(req.max * 1000);
                    $("#capacityChart").data("kendoChart").refresh();
                  }
                  if (req.current == 0) {
                    keepGoing = false;
                  } else {
                    keepGoing = true;
                  }
                });
              }, 1000);
          }
          function createBarChart() {
                    var month = moment().format("MMM");
                    var date = moment().format("DD");
                    var currentCapacityList = [];
                    var maxCapacityList = [];
                    var Linechartoptions={
                      transitions: false,
                      /*title: {
                          text: "Current Capacity %"
                      },*/
                      legend: {
                        position: "bottom"
                      },
                      chartArea: {
                        background: ""
                      },
                      seriesDefaults: {
                        type: "column",
                        style: "smooth",
                        markers: {
                          visible: false,
                          size: 3
                        },

                      },
                      series: [ {
                        name: "Current Capacity",
                        data: currentCapacityList,
                        color: "blue",
                      }],
                      valueAxis: {

                        labels: {
                          format: "{0}人"
                        },
                        line: {
                          visible: false
                        },
                        axisCrossingValue: -10,
                        title: {
                          text: "容量(人)"
                        },

                      },
                      categoryAxis: {
                        title: {
                          text: "時間"
                        }
                      },
                      tooltip: {
                        visible: true,
                        format: "{0}%",
                        template: "#= value #"
                      }
                    };
                    $("#BarChart").kendoChart(Linechartoptions);

                    // 固定每0.5秒拿一次資料
                    var keepGoing = true;
                    var intervalId = window.setInterval(function () {
                      $.ajax({
                        url: "http://localhost:8080/bank/loan/capacity",
                        method: "GET",
                        crossDomain: true,
                        dataType: "json",
                      }).done(function (req) {
                        console.log(req);
                        if (keepGoing) {
                          currentCapacityList.push(req.current * 1000);
                          //maxCapacityList.push(req.max * 1000);
                          $("#BarChart").data("kendoChart").refresh();
                        }
                        if (req.current == 0) {
                          keepGoing = false;
                        } else {
                          keepGoing = true;
                        }
                      });
                    }, 1000);
                }
    function getCapacity() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8080/bank/loan/capacity?waitingSize=10&finishedSize=5',
                success: (response) => {
                    resolve(response);
                }
            });
        });
    }

    function updatePendingLiHtmlElement(waitingList) {
        let waitingUIHtml = '';
        for(let index in waitingList) {
            const waitingItem = waitingList[index];
            waitingUIHtml = waitingUIHtml + getPendingLi(waitingItem.name, waitingItem.created_at);
        }

        setInnerHtmlInID('pending-list', waitingUIHtml);
    }

    function getPendingLi(name, time) {
        let newLiDom =
            "<li class=\"d-block\">\
                <div class=\"form-check w-100\">\
                    <label class=\"form-check-label\">\
                    <input class=\"text\" type=\"text\">" + name + " is Waiting <i class=\"input-helper rounded\"></i>\
                    </label>\
                    <div class=\"d-flex mt-2\">\
                        <div class=\"ps-4 text-small me-3\">" + time + "</div>\
                        <div class=\"badge badge-opacity-warning me-3\">Waiting</div>\
                    </div>\
                </div>\
            </li>";

        return newLiDom;
    }

    function updateDoneLiHtmlElement(finishedList) {
        let doneUIHtml = '';
        for(let index in finishedList) {
            const finishedItem = finishedList[index];
            doneUIHtml = doneUIHtml + getDoneLi(finishedItem.name, finishedItem.finished_at);
        }

        setInnerHtmlInID('done-list', doneUIHtml);
    }

    function getDoneLi(name, time) {
        let newLiDom =
            "<li class=\"d-block\">\
                <div class=\"form-check w-100\">\
                    <label class=\"form-check-label\">\
                    <input class=\"text\" type=\"text\">" + name + " has Done <i class=\"input-helper rounded\"></i>\
                    </label>\
                    <div class=\"d-flex mt-2\">\
                        <div class=\"ps-4 text-small me-3\">" + time + "</div>\
                        <div class=\"badge badge-opacity-success me-3\">Done</div>\
                    </div>\
                </div>\
            </li>";

        return newLiDom;
    }

    function setInnerHtmlInID(id, innerHtml) {
        document.getElementById(id).innerHTML = innerHtml;
    }

    function cleanInnerHtmlById(id) {
        document.getElementById(id).innerHTML = '';
    }

})(jQuery);
