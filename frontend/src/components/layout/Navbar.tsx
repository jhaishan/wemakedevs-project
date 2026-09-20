import { Link, useNavigate } from 'react-router-dom';
import { Wrench, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useUser } from '../../context/UserContext';

export function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  if (!user) return null;

  const handleSwitchUser = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Brand + Nav */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
              <Wrench className="h-6 w-6" />
              HostelFix
            </Link>

            <div className="hidden sm:flex items-center gap-1">
              {user.role === 'STUDENT' && (
                <>
                  <Link to="/report">
                    <Button variant="ghost" size="sm">Report</Button>
                  </Link>
                  <Link to="/my-complaints">
                    <Button variant="ghost" size="sm">My Complaints</Button>
                  </Link>
                </>
              )}
              {(user.role === 'WARDEN' || user.role === 'STAFF') && (
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right: User info + Switch */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-700">{user.name}</span>
              <Badge variant="secondary">{user.role}</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSwitchUser}>
              <LogOut className="h-4 w-4 mr-1" />
              Switch User
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
