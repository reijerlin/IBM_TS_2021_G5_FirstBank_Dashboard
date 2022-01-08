(function($) {
    'use strict';
    $(function() {
        if ($("#pending-list").length) {
            setInterval(() => {
                getCapacity().then((response) => {
                    const finishedList = response.finishedList;
                    const waitingList = response.waitingList;

                    updatePendingLiHtmlElement(waitingList);
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

})(jQuery);


