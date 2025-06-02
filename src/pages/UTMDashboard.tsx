
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UTMLinkGenerator } from '@/components/UTMLinkGenerator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  traffic_by_source: any[];
  conversion_funnel: any[];
  daily_traffic: any[];
}

const UTMDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('utm-analytics-dashboard', {
        body: { days: parseInt(dateRange) }
      });

      if (error) throw error;
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading analytics data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">UTM Analytics Dashboard</h1>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Traffic Sources Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic by Source</CardTitle>
          <CardDescription>Sessions by UTM source over the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsData?.traffic_by_source && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.traffic_by_source}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="utm_source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel by Source</CardTitle>
          <CardDescription>Conversion rates from traffic to signups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Source</th>
                  <th className="text-left p-4">Sessions</th>
                  <th className="text-left p-4">Email Signups</th>
                  <th className="text-left p-4">Tool Signups</th>
                  <th className="text-left p-4">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData?.conversion_funnel?.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4">
                      <Badge variant="outline">{row.utm_source || 'Direct'}</Badge>
                    </td>
                    <td className="p-4">{row.sessions || 0}</td>
                    <td className="p-4">{row.email_signups || 0}</td>
                    <td className="p-4">{row.tool_signups || 0}</td>
                    <td className="p-4">
                      {row.sessions ? ((row.tool_signups / row.sessions) * 100).toFixed(1) + '%' : '0%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Distribution</CardTitle>
          <CardDescription>Traffic distribution by campaign</CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsData?.traffic_by_source && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.traffic_by_source.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sessions"
                  nameKey="utm_source"
                >
                  {analyticsData.traffic_by_source.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* UTM Link Generator */}
      <UTMLinkGenerator />
    </div>
  );
};

export default UTMDashboard;
