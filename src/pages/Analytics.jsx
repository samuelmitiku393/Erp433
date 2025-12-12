import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

const Analytics = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$15,250',
      icon: <TrendingUpIcon sx={{ color: 'success.main' }} />,
      change: '+12.5%',
      period: 'vs last month'
    },
    {
      title: 'Promotion ROI',
      value: '245%',
      icon: <AnalyticsIcon sx={{ color: 'primary.main' }} />,
      change: '+18%',
      period: 'vs last campaign'
    },
    {
      title: 'Customer Growth',
      value: '1,245',
      icon: <PieChartIcon sx={{ color: 'secondary.main' }} />,
      change: '+8.2%',
      period: 'new customers'
    },
    {
      title: 'Engagement Rate',
      value: '34.5%',
      icon: <TimelineIcon sx={{ color: 'warning.main' }} />,
      change: '+5.1%',
      period: 'vs last month'
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography color="textSecondary" variant="body2">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="success.main">
                  {stat.change} {stat.period}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <AnalyticsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Revenue Chart
              </Typography>
              <Typography color="textSecondary">
                Detailed revenue analytics coming soon
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <PieChartIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <Typography color="textSecondary">
                Campaign performance analytics coming soon
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Coming Soon Features
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2">Advanced Charts</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2">Export Reports</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2">Predictive Analytics</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2">Custom Dashboards</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Analytics;