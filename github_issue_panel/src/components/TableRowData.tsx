import RemarkData from "./RemarkData";
import "./TableRowData.css";


interface TableRowDataProps {
    issueId: string,
    url: string,
    title: string,
    author: string,
    createdAt: string,
    updatedAt: string,
    totalReply: number;
    state: string,
    labels: any;
}

//closed-issue - green
//open-issue- red if have no reply
//open-issue - orange if have reply

const TableRowData = ({ url, title, author, createdAt, updatedAt, totalReply, state, labels, issueId }: TableRowDataProps) => {
    let className = 'green-color';
    if (state === 'OPEN' && totalReply === 0) {
        className = 'red-color';
    } else if (state === 'OPEN') {
        className = 'orange-color';
    }
    const labelData = labels.nodes.map((node: any) => {
        let color = 'black';
        if (node.name === 'flaky-test' || node.name === 'buildology' || node.name === 'breaking change') {
            color = 'white';
        } 
        return <li key={node.id} style={{ backgroundColor: `#${node.color}`, color: color}}>{node.name}</li>
    });
    return (
        <tr>
            <td><a href={url} target="_blank" className={className}>{title}</a></td>
            <td>
                <ul className="label-list">
                    {labelData}
                    {labelData.length == 0 && <li style={{ backgroundColor: 'rgb(143, 93, 34)'}}>Un-labelled</li>}
                </ul>
            </td>
            <td>{author}</td>
            <td>{createdAt.split('T')[0]}</td>
            <td>{updatedAt.split('T')[0]}</td>
            <td>{totalReply}</td>
            <td><RemarkData issueId={issueId} /></td>
         </tr>
    );
}

export default TableRowData;