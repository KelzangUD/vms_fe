import { useState, useEffect, useMemo } from 'react';
import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography, } from '@mui/material';
import axios from 'axios';
import DynamicIcon from '../ui/DynamicIcon';
import FactoryIcon from '@mui/icons-material/Factory';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


const Home = () => {
    const [vehicles, setVehicles] = useState([]);
    const [sortOption, setSortOption] = useState("ownerAsc");
    const fetchVehicles = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/vehicles`,
            );
            if (response.status === 200) {
                setVehicles(response.data?.data?.map((item) => ({
                    ...item,
                    manufacturerName: item?.manufacturerId ? item?.manufacturerName : item?.otherManufacturerName
                })) || []);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to fetch vehicles. Please try again.');
        }
    }

    useEffect(() => {
        fetchVehicles();
    }, []);

    // Sorting logic using useMemo to avoid unnecessary recalculations
    const sortedVehicles = useMemo(() => {
        return [...vehicles].sort((a, b) => {
            switch (sortOption) {
                case 'ownerAsc':
                    return (a.ownerName || '').localeCompare(b.ownerName || '');
                case 'ownerDesc':
                    return (b.ownerName || '').localeCompare(a.ownerName || '');

                case 'manufacturerAsc':
                    return (a.manufacturerName || '').localeCompare(b.manufacturerName || '');
                case 'manufacturerDesc':
                    return (b.manufacturerName || '').localeCompare(a.manufacturerName || '');

                case 'yearAsc':
                    return (a.yearOfManufacturer || 0) - (b.yearOfManufacturer || 0);
                case 'yearDesc':
                    return (b.yearOfManufacturer || 0) - (a.yearOfManufacturer || 0);

                case 'weightAsc':
                    return (a.weight || 0) - (b.weight || 0);
                case 'weightDesc':
                    return (b.weight || 0) - (a.weight || 0);

                default:
                    return 0;
            }
        });
    }, [sortOption, vehicles]);

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: 'flex', flexDirection: "column", p: 2 }}>
                    <Typography variant="h5">
                        Vehicles
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#616161" }}>
                        {vehicles?.length || 0} Registered vehicles
                    </Typography>
                </Box>
                <Box sx={{ minWidth: 220, pr: 2 }}>
                    <InputLabel>Sort</InputLabel>
                    <FormControl fullWidth size="small">
                        <Select
                            labelId="sort-select-label"
                            id="sort-select"
                            value={sortOption ?? ''}
                            onChange={(e) => setSortOption(e?.target?.value)}
                            sx={{
                                borderRadius: 3,
                                backgroundColor: '#FAFAFA',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.87)',
                                },
                                paddingY: 1
                            }}
                        >
                            <MenuItem value="ownerAsc">Owner's Name (A-Z)</MenuItem>
                            <MenuItem value="ownerDesc">Owner's Name (Z-A)</MenuItem>
                            <MenuItem value="manufacturerAsc">Manufacturer (A-Z)</MenuItem>
                            <MenuItem value="manufacturerDesc">Manufacturer (Z-A)</MenuItem>
                            <MenuItem value="yearAsc">Year (Oldest First)</MenuItem>
                            <MenuItem value="yearDesc">Year (Newest First)</MenuItem>
                            <MenuItem value="weightAsc">Weight (Lightest First)</MenuItem>
                            <MenuItem value="weightDesc">Weight (Heaviest First)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            {/* Vehicle List */}
            <Grid container spacing={2} sx={{ mt: 2, px: 2 }}>
                {sortedVehicles.map((vehicle) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={vehicle.id}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                border: '1px solid #EAEAEA',
                                display: 'flex',
                                alignItems: 'center',
                                justify: 'space-between',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2.5,
                                        backgroundColor: '#EFF6FF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <DynamicIcon name={vehicle.iconName} />
                                </Box>
                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={600}>
                                            {vehicle.ownerName}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "#616161" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <FactoryIcon />
                                            <Typography variant="body2">
                                                {vehicle.manufacturerName}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <CalendarMonthIcon />
                                            <Typography variant="body2">
                                                {vehicle.yearOfManufacturer}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}
export default Home;