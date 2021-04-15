import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import React, { Component } from "react";
import clsx from "clsx";
// import { makeStyles, useTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AssessmentIcon from "@material-ui/icons/Assessment";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import Paper from "@material-ui/core/Paper";
import StudentDetailsTable from "./Tables";
import AttendanceTableTeacher from "./AttendanceTableTeacher";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import axios from "axios";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import Spinner from "./Loader";
const drawerWidth = 240;
const styles = (theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: "1rem 4rem",
    minWidth: 120,
  },
  button: {
    margin: theme.spacing(1),
    display: "flex",
    width: "fit-content",
    padding: "1rem 2rem",
    margin: "auto",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class Dash extends Component {
  logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("post");
    window.location.replace(process.env.REACT_APP_SITE_URL);
  };

  getData = async () => {
    this.setState((prevvalue) => {
      return {
        isLoading: true,
      };
    });
    const tok = localStorage.getItem("token");
    const post = localStorage.getItem("post");

    if (tok === null) {
      window.location.replace(process.env.REACT_APP_SITE_URL);
    } else {
      const _user = await axios.get(
        process.env.REACT_APP_SERVER_URL + "/api/" + post + "/dashboard",
        {
          headers: {
            Authorization: "Bearer " + tok,
          },
        }
      );
      this.setState({
        user: _user.data.teacher,
        assignData: _user.data.tcourses,
      });
    }
    this.setState((prevvalue) => {
      return {
        isLoading: false,
      };
    });
  };

  handleDateChange = (date) => {
    this.setState({ date });
  };

  constructor() {
    super();
    this.state = {
      courseData: {
        10: ["a", "b"],
        11: ["x", "y"],
        12: ["i", "j"],
      },
      assignData: {},
      formData: {
        class: "",
        subject: ["None"],
        subjectSelected: "",
      },
      assdata: {
        class: "",
        subject: ["None"],
        subjectSelected: "",
      },
      regdata: [],
      attendance: [],
      user: {},
      date: new Date(),
      courses: [],
      open: false,
      selected: 0,
      isLoading: true,
    };

    this.getData();
  }

  getCourse = (e) => {
    const _class = e.target.value;
    let _subject;

    if (_class === "None") {
      _subject = [];
    } else {
      _subject = this.state.courseData[_class];
    }

    this.setState((prev) => {
      return {
        formData: {
          ...prev.formData,
          subject: _subject,
          class: _class,
        },
      };
    });
  };
  getAssignCourse = (e) => {
    const _aclass = e.target.value;
    let _asubject;

    if (_aclass === "None") {
      _asubject = [];
    } else {
      _asubject = this.state.assignData[_aclass];
    }

    this.setState((prev) => {
      return {
        assdata: {
          ...prev.assdata,
          subject: _asubject,
          class: _aclass,
        },
      };
    });
  };

  selectSubject = (e) => {
    const _subject = e.target.value;

    this.setState((prev) => {
      return {
        formData: {
          ...prev.formData,
          subjectSelected: _subject,
        },
      };
    });
  };
  selectAssignSubject = (e) => {
    const _asubject = e.target.value;

    this.setState((prev) => {
      return {
        assdata: {
          ...prev.assdata,
          subjectSelected: _asubject,
        },
      };
    });
  };
  markattendance = async (e) => {
    this.setState((prevvalue) => {
      return {
        isLoading: true,
      };
    });
    var attenData = {
      class: this.state.assdata.class,
      subject: this.state.assdata.subjectSelected,
      present: this.state.attendance,
      date: this.state.date.toLocaleDateString(),
    };

    const res = await axios.post(
      process.env.REACT_APP_SERVER_URL +
        "/api/dashboard/Teacher/MarkAttendance",
      attenData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (res.data === "Done") {
      alert("Successfully Marked");
    } else {
      alert(res.data.Error);
    }
    this.setState(() => {
      return {
        selected: 1,
        attendance: [],
        assdata: {
          class: "",
          subject: ["None"],
          subjectSelected: "",
        },
      };
    });
    this.setState((prevvalue) => {
      return {
        isLoading: false,
      };
    });
  };

  check = (e) => {
    var newAtten = this.state.attendance;
    if (e.target.checked) {
      newAtten.push(e.target.value);
    } else {
      var ind = newAtten.indexOf(e.target.value);
      newAtten.splice(ind, 1);
    }

    this.setState((pre) => {
      return {
        attendance: newAtten,
      };
    });
  };

  clicked = (e) => {
    if (e.target.innerText === "Details") {
      this.setState(() => {
        return {
          selected: 0,
        };
      });
    } else if (e.target.innerText === "Mark Attendance") {
      this.setState(() => {
        return {
          selected: 1,
        };
      });
      this.setState(() => {
        return {
          assdata: {
            class: "",
            subject: ["None"],
            subjectSelected: "",
          },
        };
      });
    } else if (e.target.innerText == "Course Registration") {
      this.setState(() => {
        return {
          selected: 2,
        };
      });
      this.setState(() => {
        return {
          formData: {
            class: "",
            subject: ["None"],
            subjectSelected: "",
          },
        };
      });
    } else if (e.target.innerText == "Show Attendance") {
      this.setState(() => {
        return {
          selected: 4,
        };
      });
    } else {
    }
  };
  fetchStudentdata = async (e) => {
    this.setState((prevvalue) => {
      return {
        isLoading: true,
      };
    });
    const courseassignData = {
      class: this.state.assdata.class,
      subject: this.state.assdata.subjectSelected,
      date: this.state.date.toLocaleDateString(),
    };

    const resp = await axios.post(
      process.env.REACT_APP_SERVER_URL + "/api/dashboard/Teacher/fetchStdata",
      courseassignData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (resp.data.Error) {
      alert(resp.data.Error);
      this.setState(() => {
        return {
          assdata: {
            class: "",
            subject: ["None"],
            subjectSelected: "",
          },
        };
      });
    } else {
      this.setState(() => {
        return {
          regdata: resp.data,
        };
      });
      this.setState(() => {
        return {
          selected: 3,
        };
      });
    }

    this.setState((prevvalue) => {
      return {
        isLoading: false,
      };
    });
  };
  fetchAttendance = async () => {
    this.setState((prevvalue) => {
      return {
        isLoading: true,
      };
    });
    const courseData = {
      class: this.state.assdata.class,
      subject: this.state.assdata.subjectSelected,
    };
    const resp = await axios.post(
      process.env.REACT_APP_SERVER_URL +
        "/api/dashboard/Teacher/fetchAttendance",
      courseData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    this.getData();
    if (resp.data.Error) {
      alert(resp.data.Error);
    } else {
      this.setState(() => {
        return {
          attendance: resp.data,
          selected: 5,
        };
      });
    }
    this.setState(() => {
      return {
        assdata: {
          class: "",
          subject: ["None"],
          subjectSelected: "",
        },
      };
    });

    this.setState((prevvalue) => {
      return {
        isLoading: false,
      };
    });
  };

  registerCourse = async () => {
    this.setState((prevvalue) => {
      return {
        isLoading: true,
      };
    });
    const courseData = {
      class: this.state.formData.class,
      subject: this.state.formData.subjectSelected,
    };

    const resp = await axios.post(
      process.env.REACT_APP_SERVER_URL +
        "/api/dashboard/Teacher/courseRegister",
      courseData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    this.getData();
    if (resp.data.Error) {
      alert(resp.data.Error);
    } else {
      alert("Successfully Registered.");
    }
    this.setState(() => {
      return {
        formData: {
          class: "",
          subject: ["None"],
          subjectSelected: "",
        },
      };
    });

    this.setState((prevvalue) => {
      return {
        isLoading: false,
      };
    });
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }
    return (
      <div className={this.props.classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(this.props.classes.appBar, {
            [this.props.classes.appBarShift]: this.state.open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              className={clsx(
                this.props.classes.menuButton,
                this.state.open && this.props.classes.hide
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Dashboard
            </Typography>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.logOut}
              style={{ position: "absolute", right: "1rem" }}
            >
              Logout
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          className={this.props.classes.drawer}
          variant="persistent"
          anchor="left"
          open={this.state.open}
          classes={{
            paper: this.props.classes.drawerPaper,
          }}
        >
          <div className={this.props.classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {this.props.theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <div class="ml-1 row">
            <div class="col-4 pb-4">
              <img
                class="rounded-circle img-fluid"
                style={{ height: "50px", width: "50px", size: "cover" }}
                src={`${process.env.REACT_APP_SERVER_URL}/${this.state.user.image}`}
              ></img>
            </div>
            <div class="col-8 pt-3">
              <h4>Hi {this.state.user.fName} !</h4>
            </div>
          </div>
          <Divider />
          <List>
            {[
              "Details",
              "Mark Attendance",
              "Course Registration",
              "Show Attendance",
            ].map((text, index) => (
              <ListItem button onClick={this.clicked} value={text} key={text}>
                <ListItemIcon>
                  {
                    {
                      0: <AccountBoxIcon />,
                      1: <BorderColorIcon />,
                      2: <AddToPhotosIcon />,
                      3: <AssessmentIcon />,
                    }[index]
                  }
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main
          style={{ textAlign: "center" }}
          className={clsx(this.props.classes.content, {
            [this.props.classes.contentShift]: this.state.open,
          })}
        >
          <div className={this.props.classes.drawerHeader} />
          {
            {
              0: (
                <>
                  <h1>Details</h1>
                  <Paper
                    elevation={5}
                    className="m-auto"
                    style={{
                      width: "60%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <div class="p-2">
                      <img
                        class="rounded-circle img-fluid pb-3"
                        style={{ height: "300px", width: "300px" }}
                        src={`${process.env.REACT_APP_SERVER_URL}/${this.state.user.image}`}
                      ></img>
                    </div>
                    <div class="p-2">
                      <h3 style={{ fontWeight: "500" }}>
                        <span style={{ fontWeight: "900" }}> Name: </span>{" "}
                        {`${this.state.user.fName} ${this.state.user.lName}`}
                      </h3>
                      <h3 style={{ fontWeight: "500" }}>
                        <span style={{ fontWeight: "900" }}> Email: </span>{" "}
                        {this.state.user.username}
                      </h3>
                      <h3 style={{ fontWeight: "500" }}>
                        <span style={{ fontWeight: "900" }}> Phone: </span>{" "}
                        {this.state.user.phone}
                      </h3>
                    </div>
                  </Paper>
                  <Divider className="mt-4 mb-4" />
                </>
              ),
              1: (
                <>
                  <h1>Select Class and Subject</h1>
                  <FormControl
                    variant="outlined"
                    className={this.props.classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Class
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.assdata.class}
                      onChange={this.getAssignCourse}
                      label="Class"
                    >
                      <MenuItem value={10}>10th</MenuItem>
                      <MenuItem value={11}>11th</MenuItem>
                      <MenuItem value={12}>12th</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    className={this.props.classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Subject
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.assdata.subjectSelected}
                      onChange={this.selectAssignSubject}
                      label="Subject"
                    >
                      {this.state.assdata.subject.map((subject, index) => (
                        <MenuItem key={index} value={subject}>
                          {subject}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="date-picker-dialog"
                      label="Select the Attendance Date"
                      format="MM/dd/yyyy"
                      value={this.state.date}
                      style={{ marginLeft: "50px" }}
                      onChange={this.handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={this.props.classes.button}
                    style={{ marginTop: "5rem" }}
                    onClick={this.fetchStudentdata}
                    startIcon={<SaveIcon />}
                  >
                    Proceed
                  </Button>
                  <Divider className="mt-4 mb-4" />
                </>
              ),
              2: (
                <>
                  <h1>Course Registration</h1>
                  <FormControl
                    variant="outlined"
                    className={this.props.classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Class
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.formData.class}
                      onChange={this.getCourse}
                      label="Class"
                    >
                      <MenuItem value={10}>10th</MenuItem>
                      <MenuItem value={11}>11th</MenuItem>
                      <MenuItem value={12}>12th</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    className={this.props.classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Subject
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.formData.subjectSelected}
                      onChange={this.selectSubject}
                      label="Subject"
                    >
                      {this.state.formData.subject.map((subject, index) => (
                        <MenuItem key={index} value={subject}>
                          {subject}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={this.props.classes.button}
                    style={{ marginTop: "5rem" }}
                    onClick={this.registerCourse}
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </Button>
                </>
              ),
              3: (
                <>
                  <h1 align="Center">Student Details</h1>
                  <AttendanceTableTeacher
                    data={this.state.regdata}
                    mark={this.check}
                  />
                  <Divider className="mt-4 mb-4" />
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={this.markattendance}
                    className={this.props.classes.button}
                    style={{ marginTop: "5rem" }}
                    startIcon={<SaveIcon />}
                  >
                    Save Attendance
                  </Button>
                </>
              ),
              4: (
                <>
                  <h1>Select Class and Subject</h1>
                  <FormControl
                    variant="outlined"
                    className={this.props.classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Class
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.assdata.class}
                      onChange={this.getAssignCourse}
                      label="Class"
                    >
                      <MenuItem value={10}>10th</MenuItem>
                      <MenuItem value={11}>11th</MenuItem>
                      <MenuItem value={12}>12th</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    className={this.props.classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Subject
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.assdata.subjectSelected}
                      onChange={this.selectAssignSubject}
                      label="Subject"
                    >
                      {this.state.assdata.subject.map((subject, index) => (
                        <MenuItem key={index} value={subject}>
                          {subject}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={this.props.classes.button}
                    style={{ marginTop: "5rem" }}
                    onClick={this.fetchAttendance}
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </Button>
                  <Divider className="mt-4 mb-4" />
                </>
              ),
              5: (
                <>
                  <h1 align="Center">Student Details</h1>
                  <StudentDetailsTable
                    index={2}
                    courses={this.state.attendance}
                  />
                  <Divider className="mt-4 mb-4" />
                </>
              ),
            }[this.state.selected]
          }
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Dash);
