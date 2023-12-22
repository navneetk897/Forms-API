import React, { useCallback, useState } from "react";
import SubHeader from "./SubHeader/SubHeader";
import Table from "./Table/Table";


const MainPage: React.FC = () => {
    const [deleteIds, setDeleteIds] = useState<string[]>([]);

    const addDeleteIds = useCallback((ids: string[]) => {
        setDeleteIds(ids);
    }, [setDeleteIds]);
    
    
    return (
        <div className="main-page">
            <SubHeader deleteIds={deleteIds} addDeletedIds={addDeleteIds}/>
            <Table addDeleteIds={addDeleteIds}/>
        </div>
    )
}

export default MainPage;


