import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  Mail, 
  Calendar,
  User,
  MessageSquare,
  RefreshCw,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'pending';
  subscribed_at: string;
  updated_at: string;
}

export const NewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed' | 'pending'>('all');
  const [selectedSubscriber, setSelectedSubscriber] = useState<NewsletterSubscriber | null>(null);
  const { toast } = useToast();

  // Load newsletter subscribers
  const loadSubscribers = async () => {
    setLoading(true);
    console.log('Loading newsletter subscribers...');
    
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
  
      console.log('Supabase response:', { data, error });
  
      if (error) {
        console.error('Error loading subscribers:', error);
        toast({
          title: "Error",
          description: "Failed to load newsletter subscribers.",
          variant: "destructive",
        });
      } else {
        console.log('Subscribers loaded successfully:', data);
        setSubscribers(data || []);
      }
    } catch (error) {
      console.error('Error loading subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to load newsletter subscribers.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update subscriber status
  const updateSubscriberStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating subscriber:', error);
        toast({
          title: "Error",
          description: "Failed to update subscriber status.",
          variant: "destructive",
        });
      } else {
        setSubscribers(prev => 
          prev.map(sub => 
            sub.id === id ? { ...sub, status: status as any } : sub
          )
        );
        toast({
          title: "Success",
          description: "Subscriber status updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating subscriber:', error);
      toast({
        title: "Error",
        description: "Failed to update subscriber status.",
        variant: "destructive",
      });
    }
  };

  // Delete subscriber
  const deleteSubscriber = async (id: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting subscriber:', error);
        toast({
          title: "Error",
          description: "Failed to delete subscriber.",
          variant: "destructive",
        });
      } else {
        setSubscribers(prev => prev.filter(sub => sub.id !== id));
        toast({
          title: "Success",
          description: "Subscriber deleted successfully.",
        });
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscriber.",
        variant: "destructive",
      });
    }
  };

  // Export subscribers
  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Status', 'Subscribed Date', 'Last Updated'],
      ...subscribers.map(sub => [
        sub.email,
        sub.status,
        new Date(sub.subscribed_at).toLocaleDateString(),
        new Date(sub.updated_at).toLocaleDateString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Subscribers exported successfully.",
    });
  };

  // Filter subscribers
  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    loadSubscribers();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      unsubscribed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading newsletter subscribers...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h2>
          <p className="text-gray-600">Manage newsletter subscriptions from the footer</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadSubscribers} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportSubscribers} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Subscribers ({filteredSubscribers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No newsletter subscribers found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                    subscriber.status === 'active' ? 'border-green-200 bg-green-50' : 
                    subscriber.status === 'unsubscribed' ? 'border-red-200 bg-red-50' : 
                    'border-yellow-200 bg-yellow-50'
                  }`}
                  onClick={() => setSelectedSubscriber(subscriber)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">
                            {subscriber.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {new Date(subscriber.subscribed_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">
                          Status: {getStatusBadge(subscriber.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSubscriberStatus(subscriber.id, 'active');
                        }}
                        disabled={subscriber.status === 'active'}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSubscriberStatus(subscriber.id, 'unsubscribed');
                        }}
                        disabled={subscriber.status === 'unsubscribed'}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSubscriber(subscriber.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscriber Detail Modal */}
      {selectedSubscriber && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Subscriber Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSubscriber(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{selectedSubscriber.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(selectedSubscriber.status)}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Subscribed Date</label>
                <p className="text-gray-900">
                  {new Date(selectedSubscriber.subscribed_at).toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="text-gray-900">
                  {new Date(selectedSubscriber.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-6">
              <Button
                onClick={() => updateSubscriberStatus(selectedSubscriber.id, 'active')}
                disabled={selectedSubscriber.status === 'active'}
              >
                Activate
              </Button>
              <Button
                variant="outline"
                onClick={() => updateSubscriberStatus(selectedSubscriber.id, 'unsubscribed')}
                disabled={selectedSubscriber.status === 'unsubscribed'}
              >
                Unsubscribe
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteSubscriber(selectedSubscriber.id);
                  setSelectedSubscriber(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
