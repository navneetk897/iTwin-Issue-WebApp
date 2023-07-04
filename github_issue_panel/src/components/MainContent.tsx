
import React, { ChangeEvent } from 'react';
import Table from './Table';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import "./MainContent.css";

const MainContent = () => {
    const [state, setState] = React.useState<string>("all");
    const [assignment, setAssignment] = React.useState<string>("all");
    const [haveReply, setHaveReply] = React.useState<string>("all");
    const [milestone, setMilestone] = React.useState<number>(-1);

    const stateChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        setState(event.target.value);
    }

    const assignmentChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        setAssignment(event.target.value);
    }

    const replyChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        setHaveReply(event.target.value);
    }

    const mileStoneChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const milestoneNumber: number = parseInt(event.target.value);
        setMilestone(milestoneNumber);
    }

    return (
        <React.Fragment>
            <section>
                <div className="container">
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button"
                    table="table-to-xls"
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Export to Excel"/>
                    <div className="select-menu">
                        <div>
                            <label id="state-select">State: </label>
                            <select id="state-select" name="choice" onChange={stateChangeHandler}>
                                <option value="all">All</option>
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                        <div>
                            <label id="assignment-select">Assigned/Unassigned: </label>
                            <select id="assignment-select" name="choice" onChange={assignmentChangeHandler}>
                                <option value="all">All</option>
                                <option value="assigned">Assigned</option>
                                <option value="unassigned">Unassigned</option>
                            </select>
                        </div>
                        <div>
                            <label id="milestone-select">Milestones: </label>
                            <select id="milestone-select" name="choice" onChange={mileStoneChangeHandler}>
                                <option value="-1">All</option>
                                <option value="2">iTwin.js 4.0</option>
                                <option value="5">iTwin.js 3.7</option>
                                <option value="4">iTwin.js 3.6</option>
                                <option value="-2">No miltesone</option>
                            </select>

                        </div>
                        <div>
                            <label id="reply-no-reply">Have reply/Have no-reply: </label>
                            <select id="reply-no-reply" name="choice" onChange={replyChangeHandler}>
                                <option value="all">All</option>
                                <option value="reply">Have-reply</option>
                                <option value="noReply">Have-no-reply</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <Table state={state}
                assignment={assignment}
                haveReply={haveReply}
                milestone={milestone}
                />
            </section>
        </React.Fragment>
    );
}

export default MainContent;