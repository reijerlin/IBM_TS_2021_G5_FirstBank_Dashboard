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
    });

    function getCapacity() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8088/bank/loan/capacity?waitingSize=10&finishedSize=5',
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
                        <div class=\"badge badge-opacity-warning me-3\">Done</div>\
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


