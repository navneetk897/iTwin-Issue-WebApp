import { DocumentNode, useQuery } from "@apollo/client";
import React from "react";
import { issuesWithRespositoryQuery, getFilterdOnState, getFilteredOnAssignment, getFilteredOnReply, getFilteredOnMilestone } from  "../Utility";
import Spinner from "./Spinner";
import "./Table.css";
import TableRowData from "./TableRowData";

interface TableProps {
    state: string,
    assignment: string,
    haveReply: string,
    milestone: number
}

const Table = ({ state, assignment, haveReply, milestone }: TableProps) => {
    const [cursor, setCursor] = React.useState<string | null>(null);

    const [havePrevPage, setHavePrevPage] = React.useState<boolean>(false);
    const [haveNextpage, setHaveNextpage] = React.useState<boolean>(true);

    const [stateFilteredData, setStateFilteredData] = React.useState<any>(null);
    const [assignmentFilteredData, setAssignmentFilteredData] = React.useState<any>(null);
    const [haveReplyData, setHaveReplyData] = React.useState<any>(null);
    const [milestoneData, setMileStoneData] = React.useState<any>(null); 

    const query: DocumentNode = issuesWithRespositoryQuery('iTwin', 'itwinjs-core', cursor);
    const { loading, error, data } = useQuery(query);

    React.useEffect(() => {
        if (!loading) {
            setHavePrevPage(data.repository.issues.pageInfo.hasPreviousPage);
            setHaveNextpage(data.repository.issues.pageInfo.hasNextPage);
        }
    }, [loading]);


    const stack: string[] = React.useMemo(() => {
        return [];
    }, []);

    React.useEffect(() => {
        if (loading) {
            setStateFilteredData([]);
        } else {
            setStateFilteredData(getFilterdOnState(data, state));
        }
    }, [loading, data, state]);

    React.useEffect(() => {
        if (loading) {
            setAssignmentFilteredData([]);
        } else {
            setAssignmentFilteredData(getFilteredOnAssignment(stateFilteredData, assignment));
        }
    }, [loading, stateFilteredData, assignment]);

    React.useEffect(() => {
        if (loading) {
            setHaveReplyData([]);
        } else {
            setHaveReplyData(getFilteredOnReply(assignmentFilteredData, haveReply));
        }
    }, [loading, assignmentFilteredData, haveReply]);

    React.useEffect(() => {
        if (loading) {
            setMileStoneData([]);
        } else {
            setMileStoneData(getFilteredOnMilestone(haveReplyData, milestone));
        }
    }, [loading, haveReplyData, milestone]);
    
    if (loading) {
        return <Spinner />
    }
    if (error) {
        return <h1>Error</h1>
    }

    

    const tableValue = milestoneData.map((node: any) => {
        return <TableRowData key={node.id}
                        issueId={node.id}
                        url={node.url}
                        title={node.title}
                        author={node.author.login}
                        createdAt={node.createdAt}
                        updatedAt={node.updatedAt}
                        totalReply={node.comments.totalCount}
                        state={node.state}
                        labels={node.labels}
                    />
    })

    // const index = getFilterdDataIndex(state, assignment, haveReply);
    // const tableValue = filterdTableData[index].map((node: { id: React.Key | null | undefined; url: string; title: string; author: { login: string; }; createdAt: string; updatedAt: string; comments: { totalCount: number; }; state: string; labels: any; }) => {
    //     return <TableRowData key={node.id}
    //                 url={node.url}
    //                 title={node.title}
    //                 author={node.author.login}
    //                 createdAt={node.createdAt}
    //                 updatedAt={node.updatedAt}
    //                 totalReply={node.comments.totalCount}
    //                 state={node.state}
    //                 labels={node.labels}
    //             />

    // });

    const nextPageHandler = () => {
        stack.push(data.repository.issues.pageInfo.endCursor);
        window.scrollTo(0, 0);
        setCursor(data.repository.issues.pageInfo.endCursor);
    }

    const prevPageHandler = () => {
        stack.pop();
        window.scrollTo(0, 0);
        if (stack.length > 0) {
            setCursor(stack[stack.length - 1]);
        } else {
            setCursor(null);
        }
    }
    return (
        <React.Fragment>
            <div className="table-container">
                <table className="content-table" id="table-to-xls">
                    <thead>
                        <tr>
                            <th>Issue link</th>
                            <th>Label</th>
                            <th>Author</th>
                            <th>Creation Date</th>
                            <th>Updation Date</th>
                            <th>Reply</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableValue}
                    </tbody>
                </table>
            </div>
            <div className="btns">
                {havePrevPage && <button className="prev-btn" onClick={prevPageHandler}>prev</button>}
                {haveNextpage && <button className="next-btn" onClick={nextPageHandler}>next</button>}
            </div>
        </React.Fragment>
        
    );
}


export default Table;

