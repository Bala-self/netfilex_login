import video from "./assets/vi.mp4";

function Dashboard() {
    return (
        <div className="dashboard-container">
            <video src={video} autoPlay className="dashboard-video"></video>
        </div>
    );
}

export default Dashboard;