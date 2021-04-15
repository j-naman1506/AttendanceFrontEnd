import React, { Component } from "react";
import clsx from "clsx";
import Spinner from "./Loader";
// import { makeStyles, useTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
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
import Paper from "@material-ui/core/Paper";
import StudentDetailsTable from "./Tables";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import axios from "axios";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { InputLabel } from "@material-ui/core";

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
        user: _user.data,
      });
    }
    this.setState((prevvalue) => {
      return {
        isLoading: false,
      };
    });
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
      classdata: {
        class: "",
      },
      studentsData: [],
      teachersdata: [],
      teacherSelected: "",
      details: [],
      user: {},
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

  selectClass = (e) => {
    const _class = e.target.value;

    this.setState((prev) => {
      return {
        classdata: {
          class: _class,
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

  clicked = async (e) => {
    if (e.target.innerText === "Details") {
      this.setState(() => {
        return {
          selected: 0,
        };
      });
    } else if (e.target.innerText === "Allot Teachers") {
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
    } else if (e.target.innerText == "Teacher Allotment Details") {
      this.setState((prevvalue) => {
        return {
          isLoading: true,
        };
      });
      this.setState(() => {
        return {
          selected: 2,
        };
      });
      const resp = await axios.get(
        process.env.REACT_APP_SERVER_URL + "/api/dashboard/Host/AllotmentData",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (resp.data.Error) {
        alert(resp.data.Error);
      } else {
        let temp = resp.data;
        temp.sort((a, b) => {
          if (a.class < b.class) return -1;
          else return 1;
        });

        this.setState(() => {
          return {
            details: temp,
          };
        });
      }
      this.setState((prevvalue) => {
        return {
          isLoading: false,
        };
      });
    } else if (e.target.innerText == "Class Details") {
      this.setState(() => {
        return {
          selected: 4,
          studentsData: [],
          classdata: {
            class: "",
          },
        };
      });
    } else {
    }
  };
  selectteacher = (e) => {
    this.setState(() => {
      return {
        teacherSelected: e.target.value,
      };
    });
  };
  selectSubject = (e) => {
    const _subject = e.target.value;
    const cdata = {
      class: this.state.formData.class,
      subject: _subject,
    };
    axios
      .post(
        process.env.REACT_APP_SERVER_URL + "/api/dashboard/Host/fetchTedata",
        cdata,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((resp) => {
        if (resp.data.Error) {
          alert(resp.data.Error);

          this.setState((prev) => {
            return {
              formData: {
                ...prev.formData,
                subjectSelected: _subject,
              },
              teachersdata: [{ name: "Not Available", email: "None" }],
            };
          });
        } else {
          var tdata = resp.data;
          var obj = {};

          for (var i = 0, len = tdata.length; i < len; i++)
            obj[tdata[i]["email"]] = tdata[i];

          tdata = new Array();
          for (var key in obj) tdata.push(obj[key]);
          this.setState({ teachersdata: [] });
          this.setState((prev) => {
            return {
              formData: {
                ...prev.formData,
                subjectSelected: _subject,
              },
              teachersdata: tdata,
            };
          });
        }
      });
  };
  allotTeacher = async () => {
    this.setState((prevvalue) => {
      return {
        isLoading: true,
      };
    });
    const data = {
      class: this.state.formData.class,
      subject: this.state.formData.subjectSelected,
      email: this.state.teacherSelected,
    };
    const resp = await axios.post(
      process.env.REACT_APP_SERVER_URL + "/api/dashboard/Host/AllotTeacher",
      data,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (resp.data.Error) {
      alert(resp.data.Error);
    } else {
      alert("Successfully Alloted");
    }
    this.setState(() => {
      return {
        formData: {
          class: "",
          subject: ["None"],
          subjectSelected: "",
        },
        teacherSelected: "",
      };
    });
    this.setState((prevvalue) => {
      return {
        isLoading: false,
      };
    });
  };
  fetchStudentdata = async (e) => {
    this.setState((prevvalue) => {
      return {
        isLoading: true,
      };
    });
    const _class = this.state.classdata.class;

    const resp = await axios.post(
      process.env.REACT_APP_SERVER_URL + "/api/dashboard/Host/fetchStdata",
      { class: _class },
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
          classdata: {
            class: "",
          },
        };
      });
    } else {
      this.setState(() => {
        return {
          studentsData: resp.data,
        };
      });
    }
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
              "Allot Teachers",
              "Teacher Allotment Details",
              "Class Details",
            ].map((text, index) => (
              <ListItem button onClick={this.clicked} value={text} key={text}>
                <ListItemIcon>
                  {
                    {
                      0: <AccountBoxIcon />,
                      1: <BorderColorIcon />,
                      2: <AssessmentIcon />,
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
                  <h1>Teacher Allotment</h1>
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
                  <FormControl
                    variant="outlined"
                    className={this.props.classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Teachers
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={this.state.teacherSelected}
                      onChange={this.selectteacher}
                      label="Subject"
                    >
                      {this.state.teachersdata.map(({ name, email }, index) => (
                        <MenuItem key={index} value={email}>
                          {name}
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
                    onClick={this.allotTeacher}
                    startIcon={<SaveIcon />}
                  >
                    Allot
                  </Button>
                </>
              ),
              2: (
                <>
                  <h1 align="Center">Allotment Details</h1>
                  <StudentDetailsTable index={1} courses={this.state.details} />
                  <Divider className="mt-4 mb-4" />
                </>
              ),
              4: (
                <>
                  {this.state.studentsData.length != 0 ? (
                    <>
                      <h1 align="Center">Class Details</h1>
                      <StudentDetailsTable
                        index={0}
                        courses={this.state.studentsData}
                      />
                    </>
                  ) : (
                    <>
                      <h1>Select Class</h1>
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
                          value={this.state.classdata.class}
                          onChange={this.selectClass}
                          label="Class"
                        >
                          <MenuItem value={10}>10th</MenuItem>
                          <MenuItem value={11}>11th</MenuItem>
                          <MenuItem value={12}>12th</MenuItem>
                        </Select>
                      </FormControl>

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
                  )}
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
