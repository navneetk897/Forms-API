import "./Spinner.scss";

interface SpinnerProps {
    customSyle?: React.CSSProperties
}

const Spinner: React.FC<SpinnerProps> = ({ customSyle }: SpinnerProps) => {
    return (
        <div style={customSyle} className="spinner" />
    );
}

export default Spinner;