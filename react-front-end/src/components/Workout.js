import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Video from "./show/Video";
import Timer from "./show/Timer";
import { Button } from "./show/Button";
import "./Workout.css";
import classNames from "classnames";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    height: "65px",
  },
}))(TableRow);

const StyledTableContainer = withStyles((theme) => ({
  root: {
    width: "940px",
    margin: "32px auto 0px",
  },
}))(TableContainer);

export default function Workout() {
  const { state } = useLocation();
  const classes = useStyles();
  // State holding exercises objects returned from da
  const [data, setData] = useState([]);
  const [savedWorkout, setSavedWorkout] = useState("");
  const [videoURL, setVideoURL] = useState(null);
  const [formClass, setFormClass] = useState("save--workout");

  const handleVideoURL = (video) => {
    setVideoURL(video);
  };

  // TODO implement functionality that only allows one save.
  const handleSaveWorkout = () => {
    const params = {
      exerciseIDs: data.map((ex) => ex.id),
      workoutName: savedWorkout,
      workoutTime: data
        .map((obj) => obj.total_time)
        .reduce((total, num) => total + num, 0),
    };
    axios
      .post("/api/workout", params)
      .then(() => {
        console.log("Successfully saved your workout!");
        setSavedWorkout("");
        setFormClass("save--workout__display--none");
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  React.useEffect(() => {
    const params = {
      exerciseIDs: state.exerciseIDs,
    };
    axios
      .get("/api/workout", { params })
      .then((res) => {
        setData(res.data.exercises);
        setVideoURL(res.data.exercises[0].exercise_video_url);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, []);

  return (
    data.length > 0 && (
      <>
        <div className="page--container workout--page">
          <form className={formClass}>
            <div>
              <input
                id="workoutname"
                name="workoutname"
                type="text"
                placeholder="Name your workout"
                value={savedWorkout}
                onChange={(e) => setSavedWorkout(e.target.value)}
              />

              <Button
                className="btns"
                buttonStyle="btn--go"
                buttonSize="btn--saved"
                href="/savedworkouts"
                onClick={handleSaveWorkout}
                type="reset"
                defaultValue="Reset"
              >
                Save Workout
              </Button>
            </div>
          </form>
          <h3>Get help from the coach by clicking on any exercise</h3>
          <div className="exercises--section">
            <StyledTableContainer>
              <Table
                className={classes.table}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow classes={classes.tableRow}>
                    <TableCell>Exercise Name</TableCell>
                    <TableCell align="right">Time(m)</TableCell>
                    <TableCell align="right">Sets</TableCell>
                    <TableCell align="right">Reps</TableCell>
                    <TableCell align="right">Muscle Group</TableCell>
                    <TableCell align="right">Intensity</TableCell>
                    <TableCell align="right">Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(
                    ({
                      exercise_name,
                      total_time,
                      num_of_sets,
                      num_of_reps,
                      muscle_group_id,
                      intensity,
                      rating,
                      exercise_video_url,
                      title,
                      exercise_picture_url,
                      exercise_info,
                    }) => (
                      <StyledTableRow
                        key={exercise_name}
                        onClick={() => handleVideoURL(exercise_video_url)}
                      >
                        <TableCell component="th" scope="row">
                          {exercise_name}
                        </TableCell>

                        <TableCell align="right">{total_time}</TableCell>
                        <TableCell align="right">{num_of_sets}</TableCell>
                        <TableCell align="right">{num_of_reps}</TableCell>
                        <TableCell align="right">{title}</TableCell>
                        <TableCell align="right">{intensity}</TableCell>
                        <TableCell align="right">{rating}</TableCell>
                      </StyledTableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
            <div className="timer--container">
              <Timer exerciseTimes={data.map((obj) => obj.total_time)} />
            </div>
          </div>
          <Video videoURL={videoURL} />
        </div>
      </>
    )
  );
}
