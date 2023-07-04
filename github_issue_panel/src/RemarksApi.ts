
export interface RemarkCreate {
    issueId: string,
    remark: string,
}

export interface RemarkDetail {
    issue_id: string,
    remark: string,
}

export interface ErrorDetail {
    title: string
}

export class RemarksApi {

    public async getRemark(issueId: string): Promise<RemarkDetail | null> {
        try {
            const response = await fetch(`http://localhost:3001/issue/${issueId}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            });
            if (response.status === 204) {
                return null;
            }
            const remarkDetail: RemarkDetail = await response.json() as RemarkDetail;
            return remarkDetail;
        } catch (error) {
            console.log(error)
        }
        return null;
    }

    public async postRemark(remarkData: RemarkCreate): Promise<boolean> {
        try {
            const respone = await fetch(`http://localhost:3001/issue`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(remarkData)
            });
            if (respone.status === 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
        return false;
    }

    public async deleteRemark(issueId: string): Promise<boolean> {
        try {
            const respone = await fetch(`http://localhost:3001/issue/${issueId}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                }
            });
            if (respone.status === 200) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
        return false;
    }
}