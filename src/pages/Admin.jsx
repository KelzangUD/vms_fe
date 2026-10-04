import { Box, Tab, Tabs, } from '@mui/material';
import { useState } from 'react';
import Vehicles from '../components/Vehicles';
import Categories from '../components/Categories';


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      tabIndex={0}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Admin = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex' }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            backgroundColor: '#f1f5f9',
            borderRadius: 3,
            p: 0.5,
            minHeight: 40,
            '& .MuiTabs-indicator': {
              display: 'none', // Hide standard underline indicator
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              color: '#64748b',
              borderRadius: 2.5,
              minHeight: 36,
              py: 1,
              px: 3,
              transition: 'all 0.2s ease-in-out',
              '&.Mui-selected': {
                color: '#1e88e5',
                backgroundColor: '#ffffff',
                fontWeight: 600,
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              },
            },
          }}
        >
          <Tab label="Vehicles" {...a11yProps(0)} />
          <Tab label="Categories" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        <Vehicles />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <Categories />
      </CustomTabPanel>

    </Box>
  )
}

export default Admin;