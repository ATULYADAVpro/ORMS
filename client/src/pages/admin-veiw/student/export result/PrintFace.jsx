import { useRef } from 'react';
import { useReactToPrint } from "react-to-print";
import CommonPrintLayout from './CommonPrintLayout';
import { toast } from 'react-toastify';
import '../../../../app.css';

export default function PrintFace({ setBack, selectedUsers }) {
    const contentRef = useRef();
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <div style={{width:"100%"}}>
            <div className="btnPrint">
                <button onClick={() => setBack(prev => !prev)}>Back</button>
                <button onClick={reactToPrintFn}>Print</button>
            </div>
            <div ref={contentRef}>
                {selectedUsers && selectedUsers.length > 0 ? (
                    selectedUsers.map((data, index) => (
                        <div key={index} style={{width:"100%", marginTop:"0"}} className="page_break">
                            <CommonPrintLayout data={data} />
                        </div>
                    ))
                ) : (
                    <div>There is nothing to print</div>
                )}
            </div>
        </div>
    );
}
