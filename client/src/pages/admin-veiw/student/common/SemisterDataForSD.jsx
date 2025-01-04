import style from './semisterDataForSD.module.css'

export default function SemisterDataForSD() {

    return (
        <div>
            <br />
            <hr />
            <div className={style.header}>
                <div className="">
                    <h1>Sem No</h1>
                </div>
                <div className="">
                    <button className={style.btnPrint}>Print</button>
                </div>
            </div>
            <hr />
            {/* result data  */}

        </div>
    )
}
