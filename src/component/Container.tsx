import React, { ReactNode } from "react"

import "./Container.scss";

interface ContainerProps {
    children: ReactNode
}

const Container: React.FC<ContainerProps> = ({ children }: ContainerProps) => {
    return (
        <div className="container">{children}</div>
    )
}

export default Container;