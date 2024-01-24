import React, { useCallback, useEffect, useState } from "react";
import SubHeader from "./SubHeader/SubHeader";
import Table from "./Table/Table";

interface MainPageProps {
    toggleFilter: (filter: boolean) => void;
}


const MainPage: React.FC<MainPageProps> = ({ toggleFilter }) => {
    const [deleteIds, setDeleteIds] = useState<string[]>([]);

    const addDeleteIds = useCallback((ids: string[]) => {
        setDeleteIds(ids);
    }, [setDeleteIds]);
    
    useEffect(() => {
        toggleFilter(true);
    }, [toggleFilter]);

    
    return (
        <div className="main-page">
            <SubHeader deleteIds={deleteIds} addDeletedIds={addDeleteIds}/>
            <Table addDeleteIds={addDeleteIds}/>
        </div>
    )
}

export default MainPage;


