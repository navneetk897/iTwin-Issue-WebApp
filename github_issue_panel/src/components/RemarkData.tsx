import React from "react";
import ReactDom from 'react-dom';
import { RemarkCreate, RemarksApi, RemarkDetail } from "../RemarksApi";

import "./RemarkData.css";

interface RemarkDataProps {
    issueId: string
}

interface OverLayProps {
    setShowModel: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ModelProps {
    issueId: string,
    remarksApi: RemarksApi,
    setRemark: React.Dispatch<React.SetStateAction<RemarkDetail | undefined>>
    setShowModel: React.Dispatch<React.SetStateAction<boolean>>;
}

const OverLay = ({ setShowModel }: OverLayProps) => {

    const setShowModelHandler = () => {
        setShowModel(false);
    }

    return (
        <div className="overlay" onClick={setShowModelHandler} />
    );
}

const Model = ({ issueId, remarksApi, setRemark, setShowModel }: ModelProps) => {

   const [text, setText] = React.useState<string>('');
   const [isTextEmpty, setIsTextEmpty] = React.useState<boolean>(false);

    const cancelHandler = () => {
        setShowModel(false);
    }

    const submitHandler = async (event: any) => {
        event.preventDefault();
        if (text.length === 0) {
            setIsTextEmpty(true);
            return;
        }
        const remarkCreate: RemarkCreate = {
            issueId: issueId,
            remark: text,
        }
        const response: boolean = await remarksApi.postRemark(remarkCreate);
        if (response) {
            const remarkDetail: RemarkDetail | null = await remarksApi.getRemark(issueId);
            if (remarkDetail !== null) {
                setRemark(remarkDetail);
                setShowModel(false);
            }
        }
    }

    const textChangeHandler = (event: any) => {
        if (event.target.value.length > 0) {
            setIsTextEmpty(false);
        }
        setText(event.target.value);
    }

    return (
        <div className="model">
            <p className="cancel" onClick={cancelHandler}>X</p>
            <form>
                <label>Remark</label>
                <br />
                <textarea  cols={60} rows={8} className="text-area" value={text} onChange={textChangeHandler}></textarea>
                {isTextEmpty && <p>Remark text-box is empty.</p>}
                <input type="submit" className="btn" onClick={submitHandler}/>
            </form>
        </div>
    );
}




const RemarkData = ({ issueId }: RemarkDataProps) => {
    const [showModel, setShowModel] = React.useState<boolean>(false);
    const [remark, setRemark] = React.useState<RemarkDetail>();

    const remarksApi: RemarksApi = React.useMemo(() => {
        return new RemarksApi();
    }, []);

    React.useEffect(() => {
        const loadRemark = async () => {
            const remarkDetail: RemarkDetail | null = await remarksApi.getRemark(issueId);
            if (remarkDetail !== null) {
                setRemark(remarkDetail);
            } 
        };
        loadRemark();
    }, [issueId]);

    const addRemarkHandler = () => {
        setShowModel(true);
    }
    const overlays = document.getElementById('overlays')!;
    const models = document.getElementById('models')!;

    return (
       <React.Fragment>
            {remark !== undefined ? <p>{remark.remark}</p> : 
            <button className="add-remark-btn" onClick={addRemarkHandler}>Add remark</button>}
            {showModel && ReactDom.createPortal(<OverLay setShowModel={setShowModel} />, overlays)}
            {showModel && ReactDom.createPortal(<Model issueId={issueId} remarksApi={remarksApi} setRemark={setRemark} setShowModel={setShowModel} />, models)}
       </React.Fragment>
    );
}

export default RemarkData;