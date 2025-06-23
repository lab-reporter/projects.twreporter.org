"use client";

const ChallengeTitle = ({ title, onClick }) => {
    return (
        <h1
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-black will-change-transform font-bold uppercase challengeTitle cursor-pointer font-alverata-mixed"
            onClick={onClick}
        >
            {title}
        </h1>
    );
};

export default ChallengeTitle; 