import React from "react";
import { history } from "../history";

function NotFound() {
  return (
    <div className="flex flex-row h-screen justify-center">
      <div className="flex flex-col h-screen justify-center">
        <div elevation={3} className="w-auto h-32 flex-col">
          <h2 className="w-auto h-12 flex-col">
            当前访问的页面不存在, 请确认网址是否正确
          </h2>
          <div className="h-1" />
          <div className="flex flex-row h-auto justify-center">
            <div
              onClick={() => history.goBack()}
              className="text-lg font-medium underline text-blue-dark cursor-pointer"
            >
              {" "}
              Go Back{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
