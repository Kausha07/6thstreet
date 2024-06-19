import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import CDN from '../../util/API/provider/CDN';
import { isArabic } from "Util/App";
import "./EventCalendar.style.scss";


function EventCalendar(props) {
    const [eventContent, setEventContent] = useState({});
      const dispatch = useDispatch();
    const getCalendarContent = async () => {
        const configFile = 'eventCalendar.json';
        const directory = process.env.REACT_APP_REMOTE_CONFIG_DIR;
        const eventData = await CDN.get(`${directory}/${configFile}`);        
        setEventContent(isArabic() ? eventData["ar"] : eventData["en"])
    }
    useEffect(() => { 
        dispatch({ type: "TOGGLE_BREADCRUMBS", payload: { areBreadcrumbsVisible: true } });
        getCalendarContent();

        const popupBox = document.querySelector('.addEventPopup');
        const popupContainer = document.querySelector('.addEventContainer');
        popupContainer.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        const button = document.querySelector('#addToButton');
        button.addEventListener('click', addClass, false);
        function addClass(e) {
            e.preventDefault();
            popupBox.classList.add('addEventPopupHover');
        }

        var body = document.body;
        body.addEventListener('click', function (e) {
            if (popupBox.classList.contains('addEventPopupHover')) {
                popupBox.classList.remove('addEventPopupHover');
            }
        });
    }, [])
    return (
        <main block="pageLayout">
            <div block="wrap">
                <div block="box">
                    <h1 block="eventTitle">{eventContent?.eventName}</h1>
                    <div block="scheduledBox">
                        <div block="scheduledBox-time">
                            <img
                                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0Ij48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTExLjk5IDJDNi40NyAyIDIgNi40OCAyIDEyczQuNDcgMTAgOS45OSAxMEMxNy41MiAyMiAyMiAxNy41MiAyMiAxMlMxNy41MiAyIDExLjk5IDJ6TTEyIDIwYy00LjQyIDAtOC0zLjU4LTgtOHMzLjU4LTggOC04IDggMy41OCA4IDgtMy41OCA4LTggOHoiLz48cGF0aCBkPSJNMTIuNSA3SDExdjZsNS4yNSAzLjE1Ljc1LTEuMjMtNC41LTIuNjd6Ii8+PC9zdmc+" />
                            <span block="scheduledBox-date">{eventContent?.eventTime}</span>
                        </div>
                    </div>
                    <div block="eventContent">
                        <div dangerouslySetInnerHTML={{__html: eventContent?.eventDescription}} />
                    </div>
                    <div block="addEventBox">
                        <div block="addEventContainer">
                            <button block="addToButton" id="addToButton">{eventContent?.calendarBtnText}</button>
                            <div block="addEventPopup" id="addEventPopup">
                                <div block="addToCalendarLists">
                                    {
                                        eventContent.buttons?.map((item) => {
                                            return (
                                                <div block="addToCalendarItem">
                                                    <a href={item.link} block="addToCalendarBtn" target="_blank">
                                                        <img
                                                            src={item.icon} />
                                                        {item.text}
                                                    </a>
                                                </div>
                                            )
                                        })

                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div block="footer">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL8AAAAoCAYAAACviSv9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBMjlERTQwMzA0RDMxMUU4QkMzMEM1QjQzQzhFRDQzNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBMjlERTQwNDA0RDMxMUU4QkMzMEM1QjQzQzhFRDQzNyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkEyOURFNDAxMDREMzExRThCQzMwQzVCNDNDOEVENDM3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkEyOURFNDAyMDREMzExRThCQzMwQzVCNDNDOEVENDM3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+V8uSHwAACLJJREFUeNrsXQlsFVUU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" alt="6thstreet_logo" loading="lazy" class="Image-Image" />

                    </div>

                </div>

            </div>

        </main>
    );
}
export default EventCalendar;