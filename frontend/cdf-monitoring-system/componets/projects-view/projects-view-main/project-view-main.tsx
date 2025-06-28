import SideNav from "../../side-nav";
import ProjectDetail from "../main-section"

const ProjectViewMain = () => {

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar: 1/3 width */}
        <SideNav>

        </SideNav>
      {/* Main content: 2/3 width */}
      <main className="w-2/2 p-12 overflow-y-auto flex flex-col">
        <ProjectDetail/>
      </main>
    </div>
  );
};

export default ProjectViewMain