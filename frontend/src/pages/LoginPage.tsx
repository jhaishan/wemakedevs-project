import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { useUser } from '../context/UserContext';
import { fetchUsers } from '../lib/api';
import type { User, Role } from '../lib/types';

const roleOrder: Role[] = ['STUDENT', 'WARDEN', 'STAFF'];

const roleColors: Record<Role, string> = {
  STUDENT: 'bg-blue-100 text-blue-800',
  WARDEN: 'bg-amber-100 text-amber-800',
  STAFF: 'bg-green-100 text-green-800',
  ADMIN: 'bg-purple-100 text-purple-800',
};

export function LoginPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load users');
        setLoading(false);
      });
  }, []);

  const handleSelectUser = (user: User) => {
    setUser(user);
    if (user.role === 'STUDENT') {
      navigate('/report');
    } else {
      navigate('/dashboard');
    }
  };

  const groupedUsers = roleOrder.reduce((acc, role) => {
    acc[role] = users.filter((u) => u.role === role);
    return acc;
  }, {} as Record<Role, User[]>);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Wrench className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">HostelFix</h1>
          <p className="text-lg text-gray-500 mt-2">Hostel Maintenance Triage System</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">{error}</p>
            <p className="text-gray-500 text-sm">Make sure the backend is running at the configured API URL</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        )}

        {/* User Cards */}
        {!loading && !error && (
          <div className="space-y-8">
            <p className="text-center text-sm text-gray-500">Select a user to continue</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {roleOrder.map((role) => (
                <div key={role}>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {role}s
                  </h2>
                  <div className="space-y-3">
                    {groupedUsers[role].length === 0 ? (
                      <p className="text-sm text-gray-400">No {role.toLowerCase()}s found</p>
                    ) : (
                      groupedUsers[role].map((user) => (
                        <Card
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className="cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all duration-200"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
                                {user.roomNumber && (
                                  <p className="text-xs text-gray-400 mt-1">Room {user.roomNumber}</p>
                                )}
                              </div>
                              <Badge className={roleColors[user.role]}>{user.role}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
