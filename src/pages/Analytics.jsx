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
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontSize: '1.1rem' }}>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ mr: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography color="textSecondary" variant="caption" sx={{ fontSize: '0.75rem' }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ mb: 0.5, fontSize: '1.25rem' }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontSize: '0.75rem' }}>
                  {stat.change} {stat.period}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1" gutterBottom>
                Revenue Analytics
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Detailed analytics coming soon
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;