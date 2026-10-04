import * as Icons from '@mui/icons-material';

const DynamicIcon = ({ name, ...props }) => {
    const IconComponent = Icons[name] || Icons.RvHookup;
    return <IconComponent {...props} />;
};

export default DynamicIcon;