import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: "6px 16px",
            width: "500px",
            height: "150px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h5"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            当前访问的页面不存在, 请确认网址是否正确
          </Typography>
          <div style={{ height: "10px" }} />
          <Link
            to="/customers"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {" "}
            Go Back{" "}
          </Link>
        </Paper>
      </div>
    </div>
  );
}

export default NotFound;
