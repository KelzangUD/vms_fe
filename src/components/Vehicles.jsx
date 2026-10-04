import { Box, Button, Dialog, DialogTitle, DialogContent, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Slide, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';
import * as Icons from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import { useState, useEffect, forwardRef } from 'react';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const DynamicIcon = ({ name, ...props }) => {
    const IconComponent = Icons[name] || Icons.RvHookup;
    return <IconComponent {...props} />;
};

const columns = [
    { field: 'sl', headerName: 'Sl. No', minWidth: 90, flex: 0.2 },
    { field: 'ownerName', headerName: 'Owner Name', minWidth: 150, flex: 1 },
    {
        field: 'manufacturerName', headerName: 'Manufacturer', minWidth: 150, flex: 1, renderCell: (params) => {
            return params.row.manufacturerName || params.row.otherManufacturerName;
        }
    },
    { field: 'yearOfManufacturer', headerName: 'Year', minWidth: 110, flex: 0.5 },
    { field: 'weight', headerName: 'Weight', minWidth: 110, flex: 0.5 },
    {
        field: 'categoryName', headerName: 'Category', minWidth: 150, flex: 1,
        renderCell: (params) => {
            return (
                <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DynamicIcon name={params.row.iconName} />
                        {params.row.categoryName}
                    </Box>
                </>
            );
        }
    }
];


const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [addNew, setAddNew] = useState(false);
    const [details, setDetails] = useState({
        "ownerName": "",
        "manufacturerId": null,
        "yearOfManufacturer": dayjs().year(),
        "otherManufacturerName": "",
        "weight": null
    })
    const [handleClicked, setHandleClicked] = useState(false);

    const fetchVehicles = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/vehicles`,
            );
            if (response.status === 200) {
                setVehicles(response.data?.data?.map((item, index) => ({
                    sl: index + 1,
                    ...item
                })) || []);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to fetch vehicles. Please try again.');
        }
    }
    const fetchManufacturers = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/manufacturers`,
            );
            if (response.status === 200) {
                setManufacturers(response.data?.data || []);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to fetch manufacturer. Please try again.');
        }
    }
    useEffect(() => {
        fetchVehicles();
        fetchManufacturers()
    }, []);

    const closeHandle = () => {
        setDetails((prev) => ({
            ...prev,
            "ownerName": "",
            "manufacturerId": null,
            "yearOfManufacturer": dayjs().year(),
            "otherManufacturerName": "",
            "weight": null
        }))
        setAddNew(false);
    }

    const onChangeHandler = (e) => {
        // console.log(e.target.name, e.target.value);
        if (e.target.name === 'weight') {
            const val = e.target.value;
            // Regex allows empty string, positive integers, and up to 2 decimal places (e.g., "12", "12.3", "12.34")
            if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                setDetails({ ...details, weight: val });
            }
        } else if (e.target.name === 'manufacturerId' && e.target.value === 0) {
            setDetails({ ...details, manufacturerId: 0 });
        }
        else {
            setDetails({ ...details, [e.target.name]: e.target.value });
        }
    }

    const addHandler = async () => {
        const token = localStorage.getItem("token");
        setHandleClicked(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/vehicles`, {
                "ownerName": details?.ownerName,
                "manufacturerId": details?.manufacturerId === 0 ? null : details?.manufacturerId,
                "yearOfManufacturer": details?.yearOfManufacturer,
                "otherManufacturerName": details?.otherManufacturerName,
                "weight": details?.weight
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                alert('Vehicle added successfully.');
                fetchVehicles();
                closeHandle();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add vehicle. Please try again.');
            console.log('Failed to add vehicle:', error?.response);
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography variant="h5">
                        Vehicles
                    </Typography>
                    <Typography variant="body1">
                        {vehicles?.length || 0} Registered vehicles
                    </Typography>
                </Box>
                <Box>
                    <Button variant="contained" color="primary" onClick={() => {
                        setHandleClicked(false);
                        setAddNew(true)
                    }}>
                        <AddIcon /> Add Vehicle
                    </Button>
                </Box>
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid rows={vehicles} columns={columns} />
            </Box>
            <Dialog
                open={addNew}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={closeHandle}
                aria-describedby="alert-dialog-slide-description"
                role="alertdialog"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: "bold" }} variant="body1">
                        Add Vehicle
                    </Typography>
                    <Button onClick={closeHandle}>
                        <CloseIcon />
                    </Button>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
                    <TextField id="ownerName" name="ownerName" label="Owner's Name" variant="outlined" fullWidth value={details?.ownerName ?? ""} onChange={onChangeHandler} helperText={handleClicked && !details?.ownerName ? "Owner's Name is Required!" : ""} sx={{ mt: 2 }} />
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Year of Manufacturer"
                                    views={['year']}
                                    maxDate={dayjs()}
                                    value={details.yearOfManufacturer ? dayjs(`${details.yearOfManufacturer}-01-01`) : null}
                                    onChange={(newValue) => {
                                        setDetails({
                                            ...details,
                                            yearOfManufacturer: newValue ? newValue.year() : null // Stores 2026 or null
                                        });
                                    }}
                                    helperText={handleClicked && !details?.yearOfManufacturer ? "Year of Manufacturer is Required!" : ""}
                                    slotProps={{ textField: { fullWidth: true, id: 'yearOfManufacturer' } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                id="weight"
                                name="weight"
                                label="Weight (in Kg)"
                                variant="outlined"
                                fullWidth
                                type="number"
                                value={details?.weight ?? ""}
                                onChange={onChangeHandler}
                                onKeyDown={(e) => {
                                    // Prevent invalid input characters like 'e', 'E', '-', and '+' for number inputs
                                    if (['e', 'E', '-', '+'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                slotProps={{
                                    htmlInput: {
                                        min: 0,
                                        step: '0.01',
                                    },
                                }}
                                helperText={handleClicked && !details?.weight ? "Weight is Required!" : ""}
                            />
                        </Grid>
                    </Grid>
                    <FormControl>
                        <InputLabel id="manufacturerId">Manufacturer</InputLabel>
                        <Select
                            id="manufacturerId"
                            name="manufacturerId"
                            value={details?.manufacturerId ?? ""}
                            label="Manufacturer"
                            onChange={onChangeHandler}
                            labelId="manufacturerId"
                        >
                            {
                                manufacturers?.map((manufacturer) => (
                                    <MenuItem key={manufacturer.id} value={manufacturer.id}>{manufacturer.name}</MenuItem>
                                ))

                            }
                            <MenuItem value={0}>Other</MenuItem>

                        </Select>

                    </FormControl>
                    {
                        details.manufacturerId === 0 && (
                            <TextField id="otherManufacturerName" name="otherManufacturerName" label="Other Manufacturer Name" variant="outlined" fullWidth value={details?.otherManufacturerName ?? ""} onChange={onChangeHandler} />
                        )
                    }
                    <FormHelperText>
                        {handleClicked && !details?.manufacturerId ? "Manufacturer is Required!" : ""}
                    </FormHelperText>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button onClick={closeHandle} variant="outlined" color="error">
                            Cancel
                        </Button>
                        <Button onClick={addHandler} variant="contained" color="primary">
                            Add Vehicle
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}
export default Vehicles;