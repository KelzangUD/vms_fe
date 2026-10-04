import { useState, useMemo, useEffect } from 'react';
import {
    Box,
    TextField,
    Typography,
    InputAdornment,
    Grid,
    ButtonBase,
    Pagination,
    Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import * as Icons from '@mui/icons-material';

// 1. Curate icon list dynamically from MUI Icons
const ALL_ICON_KEYS = Object.keys(Icons).filter(
    (key) =>
        !key.endsWith('TwoTone') &&
        !key.endsWith('Outlined') &&
        !key.endsWith('Rounded') &&
        !key.endsWith('Sharp') &&
        typeof Icons[key] === 'object'
);

const ITEMS_PER_PAGE = 32;

export default function IconPicker({ selectedIconName, onSelectIcon }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        setSearchTerm(selectedIconName);
    }, [selectedIconName]);

    // Filter icons based on search query
    const filteredIcons = useMemo(() => {
        if (!searchTerm.trim()) return ALL_ICON_KEYS;
        return ALL_ICON_KEYS.filter((name) =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Paginate icons for fast rendering performance
    const pageCount = Math.ceil(filteredIcons.length / ITEMS_PER_PAGE);
    const currentIcons = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredIcons.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredIcons, page]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page on search
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', }}>
            {/* Search Input */}
            <TextField
                fullWidth
                placeholder="Search icons..."
                value={searchTerm}
                onChange={handleSearchChange}
                variant="outlined"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 3, backgroundColor: '#FAFAFA' },
                    },
                }}
                sx={{ mb: 3 }}
            />
            {/* Results Header */}
            <Typography variant="body1" color="text.secondary" fontWeight={500} sx={{ mb: 2 }}>
                {filteredIcons.length.toLocaleString()} matching results
            </Typography>

            {/* Icon Grid */}
            <Grid container spacing={1.5}>
                {currentIcons.map((iconName) => {
                    const IconComponent = Icons[iconName];
                    const isSelected = selectedIconName === iconName;

                    return (
                        <Grid item xs={3} sm={2} md={1.5} key={iconName}>
                            <Tooltip title={iconName} arrow placement="top">
                                <ButtonBase
                                    onClick={() => onSelectIcon(iconName)}
                                    sx={{
                                        width: '100%',
                                        aspectRatio: '1 / 1',
                                        borderRadius: 2.5,
                                        border: '1.5px solid',
                                        borderColor: isSelected ? 'primary.main' : '#EAEAEA',
                                        backgroundColor: isSelected ? '#EFF6FF' : '#F9FAFB',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        p: 1,
                                        transition: 'all 0.15s ease-in-out',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            backgroundColor: '#F0F7FF',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    {/* Selected Indicator Badge */}
                                    {isSelected && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                color: 'primary.main',
                                                display: 'flex',
                                            }}
                                        >
                                            <CheckCircleIcon sx={{ fontSize: 16 }} />
                                        </Box>
                                    )}

                                    {/* Render MUI Icon */}
                                    <IconComponent
                                        sx={{
                                            fontSize: 28,
                                            color: isSelected ? 'primary.main' : '#374151',
                                        }}
                                    />
                                </ButtonBase>
                            </Tooltip>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Pagination Controls */}
            {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(e, val) => setPage(val)}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            )}
        </Box>
    );
}