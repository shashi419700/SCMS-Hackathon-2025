import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  getUserDetails,
  updateUser,
} from "../../../redux/userRelated/userHandle";
import { useNavigate, useParams } from "react-router-dom";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableHead,
  Typography,
  Tab,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Grid2,
  
  Avatar,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  removeStuff,
  updateStudentFields,
} from "../../../redux/studentRelated/studentHandle";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../../../components/attendanceCalculator";
import CustomBarChart from "../../../components/CustomBarChart";
import CustomPieChart from "../../../components/CustomPieChart";
import { StyledTableCell, StyledTableRow } from "../../../components/styles";

import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import Popup from "../../../components/Popup";
import styled from "styled-components";
// import {  GreenButton } from '../../components/buttonStyles';

const ViewStudent = () => {
  const [showTab, setShowTab] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { userDetails, response, loading, error } = useSelector(
    (state) => state.user
  );

  const studentID = params.id;
  const address = "Student";

  useEffect(() => {
    dispatch(getUserDetails(studentID, address));
  }, [dispatch, studentID]);

  useEffect(() => {
    if (
      userDetails &&
      userDetails.sclassName &&
      userDetails.sclassName._id !== undefined
    ) {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    }
  }, [dispatch, userDetails]);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }
  // const [loader, setLoader] = useState(false)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [cAddress, setCAddress] = useState("");
  const [pAddress, setPAddress] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [password, setPassword] = useState("");
  const [sclassName, setSclassName] = useState("");
  const [studentSchool, setStudentSchool] = useState("");
  const [subjectMarks, setSubjectMarks] = useState("");
  const [subjectAttendance, setSubjectAttendance] = useState([]);

  const [openStates, setOpenStates] = useState({});

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpen = (subId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId],
    }));
  };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState("table");
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const fields =
    password === "" ? { name, rollNum,phoneNo } : { name, rollNum,phoneNo, password };

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || "");
      setEmail(userDetails.email || "");
      setPhoneNo(userDetails.phoneNo || "");
      setGender(userDetails.gender || "");
      setDob(userDetails.dob || "");
      setCAddress(userDetails.cAddress || "");
      setPAddress(userDetails.pAddress || "");
      setRollNum(userDetails.rollNum || "");
      setSclassName(userDetails.sclassName || "");
      setStudentSchool(userDetails.school || "");
      setSubjectMarks(userDetails.examResult || "");
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(updateUser(fields, studentID, address))
      .then(() => {
        dispatch(getUserDetails(studentID, address));
      })
      .catch((error) => {
        console.error(error);
      });
  };
//   const updatedFields = {
//     name,
//     email,
//     phoneNo,
//     gender,
//     dob,
//     cAddress,
//     pAddress,
//     rollNum,
//     password
//   };
// const submitHandler = (event) => { 
//     event.preventDefault();
  
//     // Ensure all form fields are updated before dispatching
//     // const updatedFields = {
//     //   name,
//     //   email,
//     //   phoneNo,
//     //   gender,
//     //   dob,
//     //   cAddress,
//     //   pAddress,
//     //   rollNum,
//     //   password
//     // };
    
//     // Dispatch the action to update user details
//     dispatch(updateUser(updatedFields, studentID, address))
//       .then(() => {
//         // Only after updating, fetch the user details again
//         return dispatch(getUserDetails(studentID, address));
//       })
//       .catch((error) => {
//         console.error("Error updating user details:", error);
//       });
//   };
  

  const deleteHandler = () => {
    // setMessage("Sorry the delete function has been disabled for now.")
    // setShowPopup(true)

    dispatch(deleteUser(studentID, address)).then(() => {
      navigate(-1);
    });
  };

  const removeHandler = (id, deladdress) => {
    dispatch(removeStuff(id, deladdress)).then(() => {
      dispatch(getUserDetails(studentID, address));
    });
  };

  const removeSubAttendance = (subId) => {
    dispatch(
      updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten")
    ).then(() => {
      dispatch(getUserDetails(studentID, address));
    });
  };

  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  const subjectData = Object.entries(
    groupAttendanceBySubject(subjectAttendance)
  ).map(([subName, { subCode, present, sessions }]) => {
    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(
      present,
      sessions
    );
    return {
      subject: subName,
      attendancePercentage: subjectAttendancePercentage,
      totalClasses: sessions,
      attendedClasses: present,
    };
  });

  const StudentAttendanceSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3>Attendance:</h3>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Subject</StyledTableCell>
                <StyledTableCell>Present</StyledTableCell>
                <StyledTableCell>Total Sessions</StyledTableCell>
                <StyledTableCell>Attendance Percentage</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(
              ([subName, { present, allData, subId, sessions }], index) => {
                const subjectAttendancePercentage =
                  calculateSubjectAttendancePercentage(present, sessions);
                return (
                  <TableBody key={index}>
                    <StyledTableRow>
                      <StyledTableCell>{subName}</StyledTableCell>
                      <StyledTableCell>{present}</StyledTableCell>
                      <StyledTableCell>{sessions}</StyledTableCell>
                      <StyledTableCell>
                        {subjectAttendancePercentage}%
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => handleOpen(subId)}
                        >
                          {openStates[subId] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                          Details
                        </Button>
                        <IconButton onClick={() => removeSubAttendance(subId)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                        <Button
                          variant="contained"
                          sx={styles.attendanceButton}
                          onClick={() =>
                            navigate(
                              `/Admin/subject/student/attendance/${studentID}/${subId}`
                            )
                          }
                        >
                          Change
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={openStates[subId]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Attendance Details
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <StyledTableRow>
                                  <StyledTableCell>Date</StyledTableCell>
                                  <StyledTableCell align="right">
                                    Status
                                  </StyledTableCell>
                                </StyledTableRow>
                              </TableHead>
                              <TableBody>
                                {allData.map((data, index) => {
                                  const date = new Date(data.date);
                                  const dateString =
                                    date.toString() !== "Invalid Date"
                                      ? date.toISOString().substring(0, 10)
                                      : "Invalid Date";
                                  return (
                                    <StyledTableRow key={index}>
                                      <StyledTableCell
                                        component="th"
                                        scope="row"
                                      >
                                        {dateString}
                                      </StyledTableCell>
                                      <StyledTableCell align="right">
                                        {data.status}
                                      </StyledTableCell>
                                    </StyledTableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                );
              }
            )}
          </Table>
          <div>
            Overall Attendance Percentage:{" "}
            {overallAttendancePercentage.toFixed(2)}%
          </div>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => removeHandler(studentID, "RemoveStudentAtten")}
          >
            Delete All
          </Button>
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/students/student/attendance/" + studentID)
            }
          >
            Add Attendance
          </Button>
        </>
      );
    };
    const renderChartSection = () => {
      return (
        <>
          <CustomBarChart
            chartData={subjectData}
            dataKey="attendancePercentage"
          />
        </>
      );
    };
    return (
      <>
        {subjectAttendance &&
        Array.isArray(subjectAttendance) &&
        subjectAttendance.length > 0 ? (
          <>
            {selectedSection === "table" && renderTableSection()}
            {selectedSection === "chart" && renderChartSection()}

            <Paper
              sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
              elevation={3}
            >
              <BottomNavigation
                value={selectedSection}
                onChange={handleSectionChange}
                showLabels
              >
                <BottomNavigationAction
                  label="Table"
                  value="table"
                  icon={
                    selectedSection === "table" ? (
                      <TableChartIcon />
                    ) : (
                      <TableChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Chart"
                  value="chart"
                  icon={
                    selectedSection === "chart" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        ) : (
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/students/student/attendance/" + studentID)
            }
          >
            Add Attendance
          </Button>
        )}
      </>
    );
  };

  const StudentMarksSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3>Subject Marks:</h3>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Subject</StyledTableCell>
                <StyledTableCell>Exam Name</StyledTableCell>
                <StyledTableCell>Marks</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {subjectMarks.map((result, index) => {
                if (!result.subName || !result.marksObtained ||!result.examName) {
                  return null;
                }
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{result.subName.subName}</StyledTableCell>
                    <StyledTableCell>{result.examName}</StyledTableCell>
                    <StyledTableCell>{result.marksObtained}</StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/students/student/marks/" + studentID)
            }
          >
            Add Marks
          </Button>
        </>
      );
    };
    const renderChartSection = () => {
      return (
        <>
          <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
        </>
      );
    };
    return (
      <>
        {subjectMarks &&
        Array.isArray(subjectMarks) &&
        subjectMarks.length > 0 ? (
          <>
            {selectedSection === "table" && renderTableSection()}
            {selectedSection === "chart" && renderChartSection()}

            <Paper
              sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
              elevation={3}
            >
              <BottomNavigation
                value={selectedSection}
                onChange={handleSectionChange}
                showLabels
              >
                <BottomNavigationAction
                  label="Table"
                  value="table"
                  icon={
                    selectedSection === "table" ? (
                      <TableChartIcon />
                    ) : (
                      <TableChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Chart"
                  value="chart"
                  icon={
                    selectedSection === "chart" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        ) : (
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/students/student/marks/" + studentID)
            }
          >
            Add Marks
          </Button>
        )}
      </>
    );
  };

  const StudentDetailsSection = () => {
    return (
      <Container maxWidth="lg">
       
        <Grid2 sx={{ display: "flex", flexWrap: { xs: "wrap", md: "nowrap" } }}>
          <div>
            {/* Name : {userDetails.name}
                <br />
                Roll Number : {userDetails.rollNum}
                <br />
                Class : {sclassName.sclassName}
                <br />
                School : {studentSchool.schoolName}
                <br />
                Email : {userDetails.email}
                <br />
                Phone no. : {userDetails.phoneNo}
                <br />
                Gender : {userDetails.gender}
                <br />
                Date of Birth : {userDetails.dob}
                <br />
                Current Address : {userDetails.cAddress}
                <br />
                Permenent Address : {userDetails.pAddress}
                <br /> */}
            <StyledPaper>
              <Grid2
                container
                spacing={2}
                sx={{ display: "flex",gap: "70px" }}
              >
                <Grid2 container sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
                  <Grid2 xs={12}>
                    <Box display="flex" justifyContent="center">
                      <Avatar alt="Student Avatar" sx={{ width: 150, height: 150 }}>
                        {String(userDetails.name).charAt(0)}
                        </Avatar>
                    </Box>
                  </Grid2>

                  <Grid2 xs={12}>
                      <Box display="flex" justifyContent="center">
                        <Typography variant="h5" component="h2" textAlign="center">
                          {userDetails.name}
                        </Typography>
                      </Box>
                  </Grid2>
                    <Grid2 xs={12}>
                    <Box display="flex" justifyContent="center">
                      <Typography
                        variant="subtitle1"
                        component="p"
                        textAlign="center"
                      >
                        Student Roll No: {userDetails.rollNum}
                      </Typography>
                    </Box>
                  </Grid2>
                  <Grid2 xs={12}>
                    <Box display="flex" justifyContent="center">
                      <Typography
                        variant="subtitle1"
                        component="p"
                        textAlign="center"
                      >
                        Class : {sclassName.sclassName}
                      </Typography>
                    </Box>
                  </Grid2>

                  <Grid2 xs={12}>
                    <Box display="flex" justifyContent="center">
                      <Typography
                        variant="subtitle1"
                        component="p"
                        textAlign="center"
                      >
                        School: {studentSchool.schoolName}
                      </Typography>
                    </Box>
                  </Grid2>

                </Grid2>

                <Grid2
                  sx={{
                    
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: { xs: "wrap", md: "nowrap" },
                  }}
                >
                  
                  
                  <Grid2 xs={12}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography
                        variant="subtitle1"
                        component="p"
                        textAlign="center"
                      >
                        Email : {userDetails.email}
                      </Typography>
                    </Box>
                  </Grid2>
                  <Grid2 xs={12}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography
                        variant="subtitle1"
                        component="p"
                        textAlign="center"
                      >
                        Phone no. : {userDetails.phoneNo}
                      </Typography>
                    </Box>
                  </Grid2>
                  <Grid2 xs={12}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography
                        variant="subtitle1"
                        component="p"
                        textAlign="center"
                      >
                        Gender : {userDetails.gender}
                      </Typography>
                    </Box>
                  </Grid2>
                  <Grid2 xs={12}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography
                        variant="subtitle1"
                        component="p"
                        textAlign="center"
                      >
                        Date of Birth : {userDetails.dob}
                      </Typography>
                    </Box>
                  </Grid2>
                  <Grid2 xs={12}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography
                        variant="subtitle1"
                        component="p"
                        textAlign="center"
                      >
                        {/* Current Address : {userDetails.cAddress} */}
                        Current Address: Room No. -09, Kumud bldg, New Mandala, Anushaktinagar, Mumbai -94
                      </Typography>
                    </Box>
                  </Grid2>
                  <Grid2 xs={12}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography
                        variant="subtitle1"
                        component="p"
                        textAlign="center"
                      >
                        {/* Permanent Address : {userDetails.pAddress} */}
                        Permanent Address: Room No. -09, Kumud bldg, New Mandala, Anushaktinagar, Mumbai -94 
                      </Typography>
                    </Box>
                  </Grid2>
                </Grid2>
              </Grid2>
            </StyledPaper>
            <Grid2
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                flexWrap: { xs: "wrap", md: "nowrap" },
              }}
            >
              {subjectAttendance &&
                Array.isArray(subjectAttendance) &&
                subjectAttendance.length > 0 && (
                  <CustomPieChart data={chartData} />
                )}
              <Button
                variant="contained"
                sx={styles.styledButton}
                onClick={deleteHandler}
              >
                Delete
              </Button>
              
              {/* <Button
                variant="contained"
                sx={styles.styledButton}
                className="show-tab"
                onClick={() => {
                  setShowTab(!showTab);
                }}
              >
                {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                Edit Student Password
              </Button> */}
            </Grid2>
           
            <Grid2
              sx={{
                
                display: "flex",
                flexDirection: "column",
                flexWrap: { xs: "wrap", md: "nowrap" },
              }}
            >
              <Collapse in={showTab} timeout="auto" unmountOnExit>
                <div className="register" styles={{height: "40vh"}}>
                  <style>
                    {`
                    .registerForm {
                       margin-top: 100px
                    }`}
                  </style>
                  <form className="registerForm" onSubmit={submitHandler} autoComplete="off">
                    <span className="registerTitle">Edit Details</span>

                    <label>Phone No.</label>
                    <input
                      className="registerInput"
                      type="tel"
                      placeholder="Enter student's Phone no...."
                      value={phoneNo}
                      onChange={(event) => setPhoneNo(event.target.value)}
                      autoComplete="new-password"
                    />
              
                    <label>Password</label>
                    <input
                      className="registerInput"
                      type="password"
                      placeholder="Enter user's password..."
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      // autoFocus
                      // autoComplete="new-password"
                     />

                    <button className="registerButton" type="submit">
                      Update
                    </button>
                  </form>
                </div>
              </Collapse>
            </Grid2>
          </div>
        </Grid2>
        
      </Container>
    );
  };

  return (
    <>
      {loading ? (
        <>
          <div>Loading...</div>
        </>
      ) : (
        <>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  sx={{
                    position: "fixed",
                    width: "100%",
                    bgcolor: "background.paper",
                    zIndex: 1,
                  }}
                >
                  <Tab label="Details" value="1" />
                  <Tab label="Attendance" value="2" />
                  <Tab label="Marks" value="3" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <StudentDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <StudentAttendanceSection />
                </TabPanel>
                <TabPanel value="3">
                  <StudentMarksSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ViewStudent;

const styles = {
  attendanceButton: {
    marginLeft: "20px",
    backgroundColor: "#270843",
    "&:hover": {
      backgroundColor: "#3f1068",
    },
  },
  styledButton: {
    margin: "20px",
    backgroundColor: "var(--text-primary-color-light)",
    "&:hover": {
      backgroundColor: "var(--hover-color-light)",
    },
  },
};


 const StyledPaper = styled(Paper)`
  max-width: 300%;
  padding: 20px;
  margin-bottom: 20px;
`;