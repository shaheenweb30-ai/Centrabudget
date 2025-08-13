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
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FormSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: 'new' | 'read' | 'replied';
}

export const FormSubmissions = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const { toast } = useToast();

  // Load form submissions
  const loadSubmissions = async () => {
    setLoading(true);
    console.log('Loading form submissions...');
    
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Error loading submissions:', error);
        toast({
          title: "Error",
          description: "Failed to load form submissions.",
          variant: "destructive",
        });
      } else {
        console.log('Submissions loaded successfully:', data);
        setSubmissions(data || []);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load form submissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mark submission as read
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) {
        console.error('Error updating submission:', error);
        toast({
          title: "Error",
          description: "Failed to mark submission as read.",
          variant: "destructive",
        });
      } else {
        setSubmissions(prev => 
          prev.map(sub => 
            sub.id === id ? { ...sub, status: 'read' } : sub
          )
        );
        toast({
          title: "Success",
          description: "Submission marked as read.",
        });
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: "Failed to mark submission as read.",
        variant: "destructive",
      });
    }
  };

  // Delete submission
  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting submission:', error);
        toast({
          title: "Error",
          description: "Failed to delete submission.",
          variant: "destructive",
        });
      } else {
        setSubmissions(prev => prev.filter(sub => sub.id !== id));
        toast({
          title: "Success",
          description: "Submission deleted successfully.",
        });
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Error",
        description: "Failed to delete submission.",
        variant: "destructive",
      });
    }
  };

  // Export submissions
  const exportSubmissions = () => {
    const csvContent = [
      ['Name', 'Email', 'Subject', 'Message', 'Date', 'Status'],
      ...submissions.map(sub => [
        `${sub.first_name} ${sub.last_name}`,
        sub.email,
        sub.subject,
        sub.message,
        new Date(sub.created_at).toLocaleDateString(),
        sub.status
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Submissions exported successfully.",
    });
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    loadSubmissions();
    
    // Test function to check table access
    const testTableAccess = async () => {
      console.log('Testing table access...');
      try {
        const { data, error } = await supabase
          .from('form_submissions')
          .select('count')
          .limit(1);
        
        console.log('Table access test result:', { data, error });
        
        if (error) {
          console.error('Table access failed:', error);
          if (error.message.includes('relation "form_submissions" does not exist')) {
            console.error('The form_submissions table does not exist. Please run the migration.');
          }
        } else {
          console.log('Table access successful');
        }
      } catch (err) {
        console.error('Table access test failed:', err);
      }
    };
    
    testTableAccess();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-gray-100 text-gray-800',
      replied: 'bg-green-100 text-green-800'
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
            <p className="text-muted-foreground">Loading form submissions...</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Form Submissions</h2>
          <p className="text-gray-600">Manage contact form submissions from the homepage</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadSubmissions} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportSubmissions} variant="outline" size="sm">
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
                  placeholder="Search submissions..."
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
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Submissions ({filteredSubmissions.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No form submissions found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                    submission.status === 'new' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {submission.first_name} {submission.last_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{submission.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="font-medium text-gray-900">{submission.subject}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {submission.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {getStatusBadge(submission.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(submission.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSubmission(submission.id);
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

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Submission Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSubmission(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">
                    {selectedSubmission.first_name} {selectedSubmission.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedSubmission.email}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <p className="text-gray-900">{selectedSubmission.subject}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Date</label>
                <p className="text-gray-900">
                  {new Date(selectedSubmission.created_at).toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(selectedSubmission.status)}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-6">
              <Button
                onClick={() => markAsRead(selectedSubmission.id)}
                disabled={selectedSubmission.status === 'read'}
              >
                Mark as Read
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Here you could implement reply functionality
                  toast({
                    title: "Reply Feature",
                    description: "Reply functionality coming soon!",
                  });
                }}
              >
                Reply
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteSubmission(selectedSubmission.id);
                  setSelectedSubmission(null);
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
