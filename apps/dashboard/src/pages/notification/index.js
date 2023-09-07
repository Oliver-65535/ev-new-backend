import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { clearLogs, getLogs } from 'services/ocpp.service';
import { useEffect, useState } from 'react';

import MainCard from 'components/MainCard';

// material-ui

// project import

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Logs = () => {
  const [logs, setLogs] = useState({ logs: [] });

  useEffect(() => {
    const timer = setInterval(() => {
      getLogs().then((e) => {
        // console.log("DDDDDDDDDDDDDDDDDDDDDDDDD",e)
        e.error == null ? setLogs(e.data) : setLogs({ logs: [] });
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const handleClickClear = () => {
    clearLogs();
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 3 */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Logs</Typography>
          </Grid>
          <Grid item>
            <Button onClick={handleClickClear}>Clear</Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Paper style={{ minHeight: 300, maxHeight: '90hv', overflow: 'auto' }}>
            <pre>{JSON.stringify(logs.logs, null, 2)}</pre>
          </Paper>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default Logs;
