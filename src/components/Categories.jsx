import { Box, Button, Card, Dialog, DialogTitle, DialogContent, FormHelperText, IconButton, Slide, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import * as Icons from '@mui/icons-material';
import IconPicker from './IconPicker';
import { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';

export const DynamicIcon = ({ name, ...props }) => {
    const IconComponent = Icons[name] || Icons.RvHookup;
    return <IconComponent {...props} />;
};

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const formatWeightRange = (currentWeight, allCategories = []) => {
    if (currentWeight === null || currentWeight === undefined) return '';
    const start = Math.floor(currentWeight);
    // 1. Get all startWeight values, sort them numerically ascending
    const sortedWeights = allCategories
        .map((c) => c.startWeight)
        .filter((w) => w !== null && w !== undefined)
        .sort((a, b) => a - b);

    // 2. Find the next weight that is strictly greater than the current start weight
    const nextStart = sortedWeights.find((w) => w > currentWeight);

    // 3. If a higher weight exists, calculate upper bound; otherwise, use "+" for the max category
    if (nextStart !== undefined) {
        const endWeight = Math.floor(nextStart - 1);
        return `${start.toLocaleString()} – ${endWeight.toLocaleString()} kg`;
    }

    return `${start.toLocaleString()}+ kg`;
};

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);
    const [details, setDetails] = useState({
        "id": "",
        "categoryName": "",
        "startWeight": null,
        "iconName": ""
    })
    const [handleClicked, setHandleClicked] = useState(false);
    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/categories`,
            );
            if (response.status === 200) {
                const data = response.data?.data || [];
                setCategories(
                    [...data]
                        .sort((a, b) => a.startWeight - b.startWeight)
                        .map((item) => ({
                            ...item,
                            weightRange: formatWeightRange(item.startWeight, data),
                        }))
                );
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to fetch categories. Please try again.');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const closeHandler = () => {
        setDetails((prev) => ({
            ...prev,
            "id": "",
            "categoryName": "",
            "startWeight": null,
            "iconName": ""
        }))
        setAdd(false);
        setEdit(false);
    }

    const onChangeHandler = (e) => {
        if (e.target.name === 'startWeight') {
            const val = e.target.value;
            // Regex allows empty string, positive integers, and up to 2 decimal places (e.g., "12", "12.3", "12.34")
            if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                setDetails({ ...details, [e.target.name]: val });
            }
        } else {
            setDetails({ ...details, [e.target.name]: e.target.value });
        }
    }

    const addHandler = async () => {
        const token = localStorage.getItem("token");
        setHandleClicked(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/categories`, {
                "categoryName": details?.categoryName,
                "startWeight": details?.startWeight,
                "iconName": details?.iconName

            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                alert('Category added successfully.');
                fetchCategories();
                closeHandler();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add category. Please try again.');
            console.log('Failed to add category:', error?.response);
        }
    }
    const editHandler = async () => {
        const token = localStorage.getItem("token");
        setHandleClicked(true);
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/categories/${details?.id}`, details, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                alert('Category Updated Successfully.');
                fetchCategories();
                closeHandler();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update category. Please try again.');
            console.log('Failed to update Category:', error?.response);
        }
    }

    const deleteHandler = async (id) => {
        const token = localStorage.getItem("token");
        setHandleClicked(true);
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                alert('Category Deleted Successfully.');
                fetchCategories();
                closeHandler();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete category. Please try again.');
            console.log('Failed to Delete Category:', error?.response);
        }
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography variant="h6" component="h1" gutterBottom>
                        Categories
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {categories.length || 0} Registered categories
                    </Typography>
                </Box>
                <Box>
                    <Button variant="contained" color="primary" onClick={() => {
                        setHandleClicked(false);
                        setAdd(true)
                    }}>
                        <AddIcon /> Add Category
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {categories.map((category) => (
                    <Card key={category.id} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', justifyItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <DynamicIcon name={category.iconName || 'Category'} sx={{ fontSize: 40, mb: 1 }} />
                            <Box>
                                <Typography variant="body2" component="h2">
                                    {category.categoryName}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {category.weightRange}
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <IconButton onClick={() => {
                                setDetails((prev) => ({
                                    ...prev,
                                    "id": category.id,
                                    "categoryName": category.categoryName,
                                    "startWeight": category.startWeight,
                                    "iconName": category.iconName
                                }))
                                setEdit(true);
                            }}><EditIcon /></IconButton>
                            <IconButton onClick={() => deleteHandler(category?.id)}><DeleteIcon /></IconButton>
                        </Box>
                    </Card>
                ))}
            </Box>
            <Dialog
                open={add}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={closeHandler}
                aria-describedby="alert-dialog-slide-description"
                role="alertdialog"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: "bold" }} variant="body1">
                        Add Cateogry
                    </Typography>
                    <Button onClick={closeHandler}>
                        <CloseIcon />
                    </Button>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, }}>

                    <TextField id="categoryName" name="categoryName" label="Category Name" variant="outlined" fullWidth value={details?.categoryName ?? ""} onChange={onChangeHandler} helperText={handleClicked && !details?.categoryName ? "Category Name is Required!" : ""} sx={{ mt: 2 }} />
                    <TextField id="startWeight" name="startWeight" label="Start Weight (in Kg)" variant="outlined" fullWidth value={details?.startWeight ?? ""} onChange={onChangeHandler} type="number" onKeyDown={(e) => {
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
                        }} helperText={handleClicked && !details?.startWeight ? "Start Weigth is Required!" : ""} />
                    <IconPicker id="iconName" selectedIconName={details.iconName}
                        onSelectIcon={(selectedName) => {
                            setDetails({ ...details, iconName: selectedName });
                        }} />
                    <FormHelperText>
                        {handleClicked && !details?.iconName ? "Icon is Required!" : ""}
                    </FormHelperText>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button onClick={closeHandler} variant="outlined" color="error">
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={addHandler}>
                            Add Category
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog
                open={edit}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={closeHandler}
                aria-describedby="edit-dialog-slide-description"
                role="editdialog"
                fullWidth
                maxWidth="md"
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: "bold" }} variant="body1">
                        Edit Cateogry
                    </Typography>
                    <Button onClick={closeHandler}>
                        <CloseIcon />
                    </Button>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
                    <TextField id="categoryName" name="categoryName" label="Category Name" variant="outlined" fullWidth value={details?.categoryName ?? ""} onChange={onChangeHandler} helperText={handleClicked && !details?.categoryName ? "Category Name is Required!" : ""} sx={{ mt: 2 }} />
                    <TextField id="startWeight" name="startWeight" label="Start Weight (in Kg)" variant="outlined" fullWidth value={details?.startWeight ?? ""} onChange={onChangeHandler} type="number" onKeyDown={(e) => {
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
                        }} helperText={handleClicked && !details?.startWeight ? "Start Weigth is Required!" : ""} />
                    <IconPicker id="iconName" selectedIconName={details.iconName}
                        onSelectIcon={(selectedName) => {
                            setDetails({ ...details, iconName: selectedName });
                        }} />
                    <FormHelperText>
                        {handleClicked && !details?.iconName ? "Icon is Required!" : ""}
                    </FormHelperText>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button onClick={closeHandler} variant="outlined" color="error">
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => editHandler()}>
                            Update Category
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}
export default Categories;