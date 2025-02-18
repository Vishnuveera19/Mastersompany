import {
  Grid,
  Card,
  TextField,
  Button,
  Typography,
  CardContent,
  FormControl,
  Tabs,
  Tab,Box,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useState, useEffect } from "react";
import { PAYMCOMPANIES, PAYMBRANCHES, REPORTS } from "../../../serverconfiguration/controllers";
import { getRequest ,postRequest} from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { useNavigate } from "react-router-dom";
import { SAVE } from "../../../serverconfiguration/controllers";
import Employeeprofile0909090 from "./EmployeePrfile1Org"
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";
export default function PaymEmployeeFormm() {
  const navigate = useNavigate();
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [errors, setErrors] = useState({});
  const [profileTabValue, setProfileTabValue] = useState(0);
  const [profileData, setProfileData] = useState({});
  const [isloggedin, setloggedin] = useState(sessionStorage.getItem("user"))
  const [loggedBranch, setloggedBranch] = useState([])
  const [loggedCompany, setloggedCompany] = useState([])
  
  const [formData, setFormData] = useState({
    pn_CompanyID:  "",

   pn_BranchID:  "",
    employeeCode: "",
    employeeFirstName: "",
    employeeMiddleName: "",
    employeeLastName: "",
    dateofBirth: "",
    password: "",
    gender: "",
    status: "",
    employeeFullName: "",
    readerid: "",
    otEligible: "",
    pfno: "",
    esino: "",
    otCalc: "",
    ctc: "",
    basicSalary: "",
    bankCode: "",
    bankName: "",
    branchName: "",
    accountType: "",
    accountNo:"",
    micrCode: "",
    ifscCode: "",
    address: "",
    otherInfo: "",
    reportingPerson: "",
    reportingId: "",
    reportingEmail: "",
    panNo: "",
    
    salaryType: "",
    tdsApplicable: "",
    flag: "",
    role: "",
  });



  useEffect(() => {
    async function fetchInitialData() {
      const companyData = await getRequest(ServerConfig.url, PAYMCOMPANIES);
      setCompany(companyData.data);
  
      const branchData = await getRequest(ServerConfig.url, PAYMBRANCHES);
      setBranch(branchData.data);
  
      
    }
  
    fetchInitialData();
  }, []); // Only run when isloggedin changes
  
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
          query: `select * from paym_Branch where Branch_User_Id = '${isloggedin}'`,
        });
  
        if (loggedBranchData.data) {
          setloggedBranch(loggedBranchData.data);
  
          // Dynamically set pn_BranchID based on the fetched data
          setFormData((prevData) => ({
            ...prevData,
            pn_BranchID: loggedBranchData.data[0].pn_BranchID,
          }));
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    }
  
    // Always fetch fresh data based on isloggedin
    if (isloggedin) {
      fetchInitialData();
    }
  }, [isloggedin]);
  
  useEffect(() => {
    async function fetchLoggedCompany() {
      try {
        if (loggedBranch.length > 0) {
          const loggedCompanyData = await postRequest(ServerConfig.url, REPORTS, {
            query: `select * from paym_Company where pn_CompanyID = ${loggedBranch[0].pn_CompanyID}`,
          });
  
          if (loggedCompanyData.data) {
            setloggedCompany(loggedCompanyData.data);
  
            // Dynamically set pn_CompanyID based on the fetched data
            setFormData((prevData) => ({
              ...prevData,
              pn_CompanyID: loggedCompanyData.data[0].pn_CompanyID,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    }
  
    // Fetch company data when loggedBranch is available
    if (loggedBranch.length > 0) {
      fetchLoggedCompany();
    }
  }, [loggedBranch]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
  
    // Helper function to validate email format
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    // Helper function to validate if value is a number
    const isNumber = (value) => !isNaN(value) && value.trim() !== "";
  
    // Example validation based on the current tab
    if (tabValue === 0) {
      // Validate fields for General Information
      if (!formData.employeeCode) newErrors.employeeCode = "This field is required enter the 50 characters";
      if (!formData.employeeFirstName) newErrors.employeeFirstName = "This field is required enter the 50 characters";
      if (!formData.employeeMiddleName) newErrors.employeeMiddleName = "This field is required enter the 50 characters";
      if (!formData.employeeLastName) newErrors.employeeLastName = "This field is required enter the 50 characters";

      if (!formData.dateofBirth) newErrors.dateofBirth = "This field is required";
      if (!formData.password)  newErrors.password = "Password must be at Strong 20 characters";
      if (!formData.gender) newErrors.gender = "This field is required";
      if (!formData.status) newErrors.status = "This field is required at 1 character";
       if (!formData.employeeFullName) newErrors.employeeFullName = "This field is required enter the 70 characters";
       if (!formData.readerid) newErrors.readerid = "This field is required only integer";
      if (!formData.otEligible)  newErrors.otEligible = "This field is required at 1 characters";
      if (!formData.pfno) newErrors.pfno = "This field is required  at 20 characters";
      if (!formData.esino) newErrors.esino = "This field is required at 20 characters";
      if (!formData.otCalc) newErrors.otCalc = "This field is required only float value";
      if (!formData.ctc)  newErrors.ctc = "This field is required only float value";
      if (!formData.basicSalary) newErrors.basicSalary = "This field is required only float value";
    } else if (tabValue === 1) {
      // Validate fields for Bank Details
      if (!formData.bankCode) newErrors.bankCode = "This field is required at 10 character";
      if (!formData.bankName) newErrors.bankName = "This field is required at 30 character";
      if (!formData.branchName) newErrors.branchName = "This field is required at 30 character";
      if (!formData.accountType) newErrors.accountType = "This field is required at 20 character";
      if (!formData.accountNo) newErrors.accountNo = "This field is required at 50 character";

      if (!formData.micrCode) newErrors.micrCode = "This field is required at 20 character";
      if (!formData.ifscCode) newErrors.ifscCode = "This field is required at 20 character";
    } else if (tabValue === 2) {
      // Validate fields for Contact Details
      if (!formData.address) newErrors.address = "This field is required at 50 character";
      if (!formData.otherInfo) newErrors.otherInfo = "This field is required at 100 character";
      if (!formData.reportingPerson) newErrors.reportingPerson = "This field is required at 50 character";
      if (!formData.reportingId) newErrors.reportingId = "This field is required only integer";
      if (!formData.reportingEmail) newErrors.reportingEmail = "This field is required";
      if (formData.reportingEmail && !isValidEmail(formData.reportingEmail)) newErrors.reportingEmail = "Invalid email address";
    } else if (tabValue === 3) {
      // Validate fields for Additional Info
      if (!formData.panNo) newErrors.panNo = "This field is required at 20 character";
      if (!formData.salaryType) newErrors.salaryType = "This field is required at 5 character";
      if (!formData.tdsApplicable) newErrors.tdsApplicable = "This field is required at 1 character";
      if (!formData.flag) newErrors.flag = "This field is required at 1 character";
      if (!formData.role) newErrors.role = "This field is required only integer";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  

  const handlesave = async () => {
    try {
      const save = await postRequest(ServerConfig.url, SAVE, {
        "query": `INSERT INTO [dbo].[paym_Employee]([pn_CompanyID],[pn_BranchID],[EmployeeCode],[Employee_First_Name],[Employee_Middle_Name],[Employee_Last_Name], [DateofBirth], [Password] ,[Gender], [status] , [Employee_Full_Name], [Readerid] ,[Pfno],[Esino], [OT_calc], [CTC], [basic_salary] ,[Bank_code],[Bank_Name],[Branch_Name] ,[Account_Type] ,[MICR_code] ,[IFSC_Code], [Address] ,[Other_Info], [Reporting_person] ,[ReportingID] ,[Reporting_email], [Pan_no] , [salary_type], [TDS_Applicable],[Flag],[role],[accountNo]) VALUES (${formData.pn_CompanyID},${formData.pn_BranchID},'${formData.employeeCode}','${formData.employeeFirstName}','${formData.employeeMiddleName}','${formData.employeeLastName}','${formData.dateofBirth}','${formData.password}','${formData.gender}','${formData.status}','${formData.employeeFullName}','${formData.readerid}','${formData.otEligible}','${formData.pfno}','${formData.esino}','${formData.otCalc}','${formData.ctc}','${formData.basicSalary}','${formData.bankCode}','${formData.bankName}','${formData.accountType}','${formData.micrCode}','${formData.ifscCode}','${formData.address}','${formData.otherInfo}','${formData.reportingPerson}','${formData.reportingId}','${formData.reportingEmail}','${formData.panNo}','${formData.salaryType}','${formData.tdsApplicable}','${formData.flag}','${formData.role}','${formData.accountNo}')`
      });
  
      if (save && save.status === 200) {
        alert("Data saved successfully");
        navigate("/Employeeprofile0909090")

      } else {
        alert("Failed to save data");
      }
    } catch (error) {
      alert("An error occurred:", error);
    }
  };
  

  const handleNext = () => {
    if (validateForm()) {
      setTabValue((prev) => {
        // Ensure the new tab index is within bounds
        return Math.min(prev + 1, 3);
      });
    }
  };
  

  const handleBack = () => {
    setTabValue((prev) => prev - 1);
  };

  return (

      <Grid container sx={{ height: "100vh" }}>
    {/* Navbar */}
    <Grid item xs={12}>
      <Navbar />
    </Grid>

    {/* Sidebar and Main Content */}
    <Grid item xs={12} sx={{ display: "flex", flexDirection: "row" }}>
      {/* Sidebar */}
      <Grid item xs={2}>
        <Sidenav />
      </Grid>

      {/* Main Content */}
      <Grid item xs={10} sx={{ padding: "60px 0 0 100px", overflowY: "auto",marginLeft:'auto',marginRight:'auto', }}>
        <Card style={{ maxWidth: 800, width: "100%" }}>
          <CardContent>

            <Typography variant="h5" align="center" gutterBottom>
              Paym Employee
            </Typography>
            {profileTabValue === 0 && (
  <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="employee-form-tabs">
    <Tab label="General Information" />
    <Tab label="Bank Details" />
    <Tab label="Contact Details" />
    <Tab label="Additional Info" />
  </Tabs>
)}

{profileTabValue === 1 && (
  <Employeeprofile0909090 />
)}
            <form >
              <Grid container spacing={2} style={{ marginTop: "20px" }}>
                {tabValue === 0 && (
                  <>
                    {/* General Information Fields */}
                    <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="CompanyName"
                    value={loggedCompany.length > 0 ? loggedCompany[0].CompanyName : ""}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>


                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Branch Name"
                    name="BranchName"
                    value={loggedBranch.length > 0 ? loggedBranch[0].BranchName : ""}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>

 <Grid item xs={12} sm={4}>
                      <TextField
                        name="employeeCode"
                        label="Employee Code"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.employeeCode}
                        helperText={errors.employeeCode}
                        value={formData.employeeCode}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="employeeFirstName"
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.employeeFirstName}
                        helperText={errors.employeeFirstName}
                        value={formData.employeeFirstName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="employeeLastName"
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.employeeLastName}
                        helperText={errors.employeeLastName}
                        value={formData.employeeLastName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="employeeMiddleName"
                        label="Middle Name"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.employeeMiddleName}
                        helperText={errors.employeeMiddleName}
                        value={formData.employeeMiddleName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="dateofBirth"
                        label="Date of Birth"
                        type="date"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.dateofBirth}
                        helperText={errors.dateofBirth}
                        InputLabelProps={{ shrink: true }}
                        value={formData.dateofBirth}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.password}
                        helperText={errors.password}
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth error={!!errors.gender}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                        </Select>
                        {errors.gender && (
                          <Typography color="error">{errors.gender}</Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="status"
                        label="Status"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.status}
                        helperText={errors.status}
                        value={formData.status}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="employeeFullName"
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.employeeFullName}
                        helperText={errors.employeeFullName}
                        value={formData.employeeFullName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="readerid"
                        label="Readerid"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.readerid}
                        helperText={errors.readerid}
                        value={formData.readerid}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="otEligible"
                        label="otEligible"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.otEligible}
                        helperText={errors.otEligible}
                        value={formData.otEligible}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="pfno"
                        label="pfno"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.pfno}
                        helperText={errors.pfno}
                        value={formData.pfno}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="esino"
                        label="esino"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.esino}
                        helperText={errors.esino}
                        value={formData.esino}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="otCalc"
                        label="otCalc"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.otCalc}
                        helperText={errors.otCalc}
                        value={formData.otCalc}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="ctc"
                        label="ctc"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.ctc}
                        helperText={errors.ctc}
                        value={formData.ctc}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="basicSalary"
                        label="basicSalary"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.basicSalary}
                        helperText={errors.basicSalary}
                        value={formData.basicSalary}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    
                  </>
                )}
                {tabValue === 1 && (
                  <>
                    {/* Bank Details Fields */}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="bankCode"
                        label="Bank Code"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.bankCode}
                        helperText={errors.bankCode}
                        value={formData.bankCode}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="bankName"
                        label="Bank Name"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.bankName}
                        helperText={errors.bankName}
                        value={formData.bankName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="branchName"
                        label="Branch Name"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.branchName}
                        helperText={errors.branchName}
                        value={formData.branchName}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="accountType"
                        label="accountType"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.accountType}
                        helperText={errors.accountType}
                        value={formData.accountType}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="accountNo"
                        label="AccountNumber"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.accountNo}
                        helperText={errors.accountNo}
                        value={formData.accountNo}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="micrCode"
                        label="MICR Code"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.micrCode}
                        helperText={errors.micrCode}
                        value={formData.micrCode}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="ifscCode"
                        label="IFSC Code"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.ifscCode}
                        helperText={errors.ifscCode}
                        value={formData.ifscCode}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </>
                )}
                {tabValue === 2 && (
                  <>
                    {/* Contact Details Fields */}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="address"
                        label="Address"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.address}
                        helperText={errors.address}
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="otherInfo"
                        label="Other Information"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.otherInfo}
                        helperText={errors.otherInfo}
                        value={formData.otherInfo}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="reportingPerson"
                        label="Reporting Person"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.reportingPerson}
                        helperText={errors.reportingPerson}
                        value={formData.reportingPerson}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="reportingId"
                        label="Reporting ID"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.reportingId}
                        helperText={errors.reportingId}
                        value={formData.reportingId}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="reportingEmail"
                        label="Reporting Email"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.reportingEmail}
                        helperText={errors.reportingEmail}
                        value={formData.reportingEmail}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </>
                )}
                {tabValue === 3 && (
                  <>
                    {/* Additional Info Fields */}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="panNo"
                        label="PAN Number"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.panNo}
                        helperText={errors.panNo}
                        value={formData.panNo}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="salaryType"
                        label="Salary Type"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.salaryType}
                        helperText={errors.salaryType}
                        value={formData.salaryType}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="tdsApplicable"
                        label="TDS Applicable"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.tdsApplicable}
                        helperText={errors.tdsApplicable}
                        value={formData.tdsApplicable}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="flag"
                        label="Flag"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.flag}
                        helperText={errors.flag}
                        value={formData.flag}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="role"
                        label="Role"
                        variant="outlined"
                        fullWidth
                        required
                        error={!!errors.role}
                        helperText={errors.role}
                        value={formData.role}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
                  
              <Grid container spacing={2} justifyContent="flex-end" style={{ marginTop: "20px" }}>
  {tabValue > 0 && (
    <Grid item>
      <Button variant="contained" onClick={handleBack}>
        Back
      </Button>
    </Grid>
  )}
  {tabValue < 3 ? (
    <Grid item>
      <Button variant="contained" onClick={handleNext}>
        Next
      </Button>
    </Grid>
  ) : (
    <Grid item>
      <Button variant="contained"  onClick={handlesave}>
        Submit
      </Button>
    </Grid>
  )}
</Grid>

              </form>
            </CardContent>
          </Card>
        </Grid>
     
    </Grid>
    </Grid>
    
    
  );
}