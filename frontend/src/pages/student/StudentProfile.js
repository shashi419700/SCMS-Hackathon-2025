import React from 'react'
import styled from 'styled-components';
import { Card, CardContent, Typography, Grid2, Box, Avatar, Container, Paper } from '@mui/material';
import { useSelector } from 'react-redux';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const sclassName = currentUser.sclassName
  const studentSchool = currentUser.school

  return (
    <>
      <Container maxWidth="md" sx={{padding: "30px"}}>
        <StyledPaper elevation={3}>
          <Grid2 container spacing={2} sx={{display: "flex", justifyContent: "space-evenly"}}>
            <Grid2  xs={12}>
              <Box display="flex" justifyContent="center">
                <Avatar alt="Student Avatar" 
                src="/studentAvatar.png"
                sx={{ width: 150, height: 150 }}>
                  {/* {String(currentUser.name).charAt(0)} */}
                </Avatar>
              </Box>
            </Grid2>
            
            <Grid2 sx={{display: "flex",flexDirection: "column", flexWrap: { xs: "wrap", md: "nowrap" }}}>
            <Grid2  xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography variant="h5" component="h2" textAlign="center">
                  {currentUser.name}
                </Typography>
              </Box>
            </Grid2>
            <Grid2  xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography variant="subtitle1" component="p" textAlign="center">
                  Student Roll No: {currentUser.rollNum}
                </Typography>
              </Box>
            </Grid2>
            <Grid2  xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography variant="subtitle1" component="p" textAlign="center">
                  Class: {sclassName.sclassName}
                </Typography>
              </Box>
            </Grid2>
            <Grid2  xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography variant="subtitle1" component="p" textAlign="center">
                  School: {studentSchool.schoolName}
                </Typography>
              </Box>
            </Grid2>
            </Grid2>
          </Grid2>
        </StyledPaper>
        {/* <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Date of Birth:</strong> January 1, 2000
                </Typography>
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Gender:</strong> Male
                </Typography>
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Email:</strong> john.doe@example.com
                </Typography>
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Phone:</strong> (123) 456-7890
                </Typography>
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Address:</strong> 123 Main Street, City, Country
                </Typography>
              </Grid2>
              <Grid2 item xs={12} sm={6}>
                <Typography variant="subtitle1" component="p">
                  <strong>Emergency Contact:</strong> (987) 654-3210
                </Typography>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card> */}
      </Container>
    </>
  )
}

export default StudentProfile

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`;