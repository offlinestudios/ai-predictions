import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2, Users, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Get current user to check admin status
  const { data: user, isLoading: userLoading } = trpc.auth.me.useQuery();

  // Get test users
  const { data: testUsers, isLoading: usersLoading, refetch } = trpc.admin.getTestUsers.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  // Seed test users mutation
  const seedMutation = trpc.admin.seedTestUsers.useMutation({
    onSuccess: (data) => {
      setMessage({ type: "success", text: data.message });
      refetch();
    },
    onError: (error) => {
      setMessage({ type: "error", text: error.message });
    },
  });

  // Delete test users mutation
  const deleteMutation = trpc.admin.deleteTestUsers.useMutation({
    onSuccess: (data) => {
      setMessage({ type: "success", text: data.message });
      refetch();
    },
    onError: (error) => {
      setMessage({ type: "error", text: error.message });
    },
  });

  const handleSeedUsers = () => {
    setMessage(null);
    seedMutation.mutate();
  };

  const handleDeleteUsers = () => {
    if (window.confirm("Are you sure you want to delete all test users? This cannot be undone.")) {
      setMessage(null);
      deleteMutation.mutate();
    }
  };

  // Check if user is admin
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>You do not have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage test users and system settings</p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        {/* Message Alert */}
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Test Users Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Test Users Management
            </CardTitle>
            <CardDescription>
              Create and manage test users with different personality types for testing predictions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleSeedUsers}
                disabled={seedMutation.isPending}
                className="flex-1"
              >
                {seedMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Users...
                  </>
                ) : (
                  "Seed Test Users"
                )}
              </Button>
              <Button
                onClick={handleDeleteUsers}
                disabled={deleteMutation.isPending || !testUsers || testUsers.length === 0}
                variant="destructive"
                className="flex-1"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All Test Users
                  </>
                )}
              </Button>
            </div>

            {/* Instructions */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-sm">How to Use:</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Click "Seed Test Users" to create 8 test accounts with different personalities</li>
                <li>Sign up with Clerk using the test emails (e.g., test-maverick@test.com)</li>
                <li>Set any password you want during signup</li>
                <li>You'll be logged in with that personality type already assigned</li>
                <li>Test predictions to see how responses differ by personality</li>
              </ol>
            </div>

            {/* Test Users List */}
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : testUsers && testUsers.length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Test Users ({testUsers.length}):</h3>
                <div className="grid gap-2">
                  {testUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-muted-foreground">{user.personality}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {user.onboardingCompleted ? "✓ Onboarded" : "⚠ Incomplete"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No test users found</p>
                <p className="text-sm">Click "Seed Test Users" to create them</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test User Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>Test User Credentials</CardTitle>
            <CardDescription>Use these emails to sign up with Clerk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { email: "test-maverick@test.com", personality: "The Maverick", color: "bg-red-100 text-red-800" },
                { email: "test-strategist@test.com", personality: "The Strategist", color: "bg-blue-100 text-blue-800" },
                { email: "test-visionary@test.com", personality: "The Visionary", color: "bg-purple-100 text-purple-800" },
                { email: "test-guardian@test.com", personality: "The Guardian", color: "bg-green-100 text-green-800" },
                { email: "test-pioneer@test.com", personality: "The Pioneer", color: "bg-orange-100 text-orange-800" },
                { email: "test-pragmatist@test.com", personality: "The Pragmatist", color: "bg-gray-100 text-gray-800" },
                { email: "test-catalyst@test.com", personality: "The Catalyst", color: "bg-yellow-100 text-yellow-800" },
                { email: "test-adapter@test.com", personality: "The Adapter", color: "bg-teal-100 text-teal-800" },
              ].map((user) => (
                <div key={user.email} className="p-3 border rounded-lg space-y-1">
                  <p className="font-mono text-sm">{user.email}</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${user.color}`}>
                    {user.personality}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Password:</strong> Set any password you want during Clerk signup (e.g., "test123")
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
